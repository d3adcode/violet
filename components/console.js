import { COMMON, KEYSETS, RESERVED_KEYS, TOPICS } from '../includes/constants'
import { isBackspace, isTab, isBackArrow, isReservedKey, isEnter } from '../includes/utils'
import Mousetrap from 'mousetrap'
import PubSub from 'pubsub-js'
import React, { Component } from 'react'
import SCRIPTS from '../scripts/scripts'
import VString from '../includes/vstring'

class Console extends Component {
  constructor() {
    super()
    this.text = Console.PROMPT
    this.previewText = ""
    this.autoComplete = ""
    this.lastCommand = ""

    this.state = {
      text: this.text,
      preview: this.autoComplete
    }

    this.subscribe()
  }

  // CONSTANTS
  static get PROMPT() {
    return Object.freeze(">> ")
  }

  // HELPERS
  // TODO: This is really basic for now.
  // Eventually we want to build an AST to parse
  // our commands so they can have nested commands
  // and the ability to script commands
  getOptions(text) {
    pre: {
      typeof text === 'string'
    }
    return text.split(' ').filter( word => word.startsWith('--') )
  }

  // FOR NOW OPTIONS MUST COME AT THE END
  trimOptions(text) {
    pre: {
      typeof text === 'string'
    }
    return text.replace(/ \-\-.*/,'')
  }

  EVENT_getConsole(event,data) {
    pre: typeof data.value !== 'undefined'
    data.value = this
  }

  static getConsole() {
    let holder = {value: null}
    PubSub.publishSync(TOPICS.GET_CONSOLE,holder)
    return holder.value
  }

  // REACT LIFECYCLE
  componentDidUpdate() {
    PubSub.publish(TOPICS.FOCUS)
  }

  componentDidMount() {
    Mousetrap.bind(KEYSETS.ALL,this.handleKeyPress.bind(this))
  }

  componentWillUnmount() {
    Mousetrap.unbind(KEYSETS.ALL)
  }

  // TOPICS
  subscribe() {
    PubSub.subscribe(TOPICS.EXECUTE,this.TOPIC_execute.bind(this))
    PubSub.subscribe(TOPICS.GET_CONSOLE,this.EVENT_getConsole.bind(this))
  }

  TOPIC_execute(event,data) {
    pre: {
      data.text,
      typeof data.text === 'string'
    }
    let text = data.text

    let splitText = text.split(' ')
    let command = splitText[0]

    if (Object.keys(SCRIPTS).includes(command)) {
      SCRIPTS[command].execute({
        text: this.trimOptions(splitText.slice(1,splitText.length).join(' ')),
        options: data.options
      })
    }

  }

  // KEYPRESS FUNCTIONS
  clear() {
    this.text = Console.PROMPT
    this.refresh()
  }

  execute(key,shiftKey) {
    pre: key, shiftKey

    if (!isEnter(key) || shiftKey)
      return

    let text = this.text.replace(Console.PROMPT,'')

    if (!text)
      text = this.lastCommand

    this.lastCommand = text

    if (text) {
      let splitText = text.split(' ')
      let command = splitText[0]

      try {
        if (SCRIPTS[command]) {
          SCRIPTS[command].execute({
            text: this.trimOptions(splitText.slice(1,splitText.length).join(' ')),
            options: this.getOptions(splitText.join(' '))
          })
        }
      }
      catch(err) {
        console.log(err)
      }
    }

    this.clear()
  }

  finishAutoComplete(key) {
    pre: key
    if (isBackspace(key) || isTab(key))
      return

    if (this.autoComplete)
      this.text += this.autoComplete

    this.autoComplete = ""
  }

  //async handleAutoComplete(key) {
  handleAutoComplete(key) {
    pre: key
    if (!isTab(key))
      return

    let dictionary = Object.keys(SCRIPTS)
    let text = this.text.replace(Console.PROMPT,'')
    let splitText = text.split(' ')
    let command = splitText[0]
    let currentWord = text.trim().substring(
      text.trim().lastIndexOf(' ')).trim()

    if ( SCRIPTS[command] ) {
      dictionary = SCRIPTS[command].dictionary
      if (typeof dictionary === 'function')
        //dictionary = await dictionary()
        dictionary = dictionary()
    }

    if (dictionary) {
      if (SCRIPTS[command] && typeof SCRIPTS[command].autocomplete === 'function') {
        this.autocomplete = SCRIPTS[command].autocomplete()
      }
      else {
        this.autoComplete = VString.autoComplete(
          currentWord, currentWord+this.autoComplete, dictionary
        ).substring(currentWord.length)
      }
    }
  }

  handleBackArrow(key) {
    pre: key
    if (!isBackArrow(key))
      return

    if (this.autoComplete) {
      this.autoComplete = ""
      return
    }

    let text = this.text.replace(Console.PROMPT,'')
    if (text) {
      let splitText = text.split(' ')
      this.text = Console.PROMPT + splitText.slice(0,-1).join(' ')
    }
  }

  handleBackspace(key) {
    pre: key
    if (!isBackspace(key))
      return

    // apply to auto-complete suggestion by default
    if (this.autoComplete) {
      this.autoComplete = this.autoComplete.slice(0,-1)
      return
    }

    // apply to text
    let text = this.text.replace(Console.PROMPT,'')
    if (text) {
      this.text = Console.PROMPT + text.slice(0,-1)
    }
  }

  append(key) {
    pre: key
    if (isReservedKey(key) || isBackArrow(key))
      return
    this.text += key
  }

  handleNewline(key,shiftKey) {
    pre: key
    if (!shiftKey || !isEnter(key))
      return

    this.text += COMMON.NEWLINE
  }

  // TODO: contemplate moving these internal methods to scripts
  // so that the console behavior can be modified
  // also, moving to rxjs intervals to handle re-render
  // and rely on simply manipulating the data model
  // 16 ms render interval = 60 FPS
  async handleKeyPress(keypress) {
    // prevent browser shortcuts from firing
    keypress.preventDefault()
    keypress.returnValue = false

    // ORDER IS IMPORTANT DUE TO FALLTHROUGH
    // 1. REMOVALS 2. AUTO-COMPLETE 3. ANYTHING ELSE

    this.handleBackspace(keypress.key)
    this.handleBackArrow(keypress.key)
    await this.handleAutoComplete(keypress.key)
    //await console.log(`console.autocomplete: ${this.autocomplete}`)
    this.finishAutoComplete(keypress.key)
    this.append(keypress.key)
    this.handleNewline(keypress.key,keypress.shiftKey)

    // finally, check if we need to execute anything
    //let command = this.text.replace(Console.PROMPT,'').split(' ')[0]
    this.execute(keypress.key,keypress.shiftKey)

    // handle preview, if any
    this.preview()

    this.refresh()
  }

  preview() {
    let text = this.text.replace(Console.PROMPT,'')
    if (text) {
      let splitText = text.split(' ')
      let command = splitText[0]

      if (SCRIPTS[command] && SCRIPTS[command].preview) {
        SCRIPTS[command].preview({
          text: splitText.slice(1,splitText.length).join(' ')
        })
      }
    }
  }

  // RENDER FUNCTIONS
  refresh() {
    this.setState({
      text: this.text,
      preview: this.autoComplete
    })
  }

  render() {
    return (
      <pre key="console-pre">
        <span>
          {this.state.text.replace(/\n/g,"\\n")}
        </span>
        <span className="preview">
          {this.state.preview}
        </span>
      </pre>
    )
  }
}

export default Console

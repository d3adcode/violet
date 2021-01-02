import { COMMON, TOPICS } from '../includes/constants'
import fetch from 'isomorphic-unfetch'
import PubSub from 'pubsub-js'
import Document from '../components/document'
import Console from '../components/console'
import VString from '../includes/vstring'

const open = {
  execute: async function(data) {
    pre: {
      data,
      data.text,
      typeof data.text === 'string'
    }

    let document = Document.getDocument()

    if (document) {
      let filename = ''

      if (data.text)
        filename = data.text
      else
        filename = '/home/dwalter/workspace/projects/node/violet/components/console.js'

      fetch(`/api/open?filename=${filename}`)
      .then((response) => {
        if (response.status !== 200) {
          console.log(response.text())
          return ""
        }
        return response.text()
      })
      .then((data) => {
        if (data) {
          document.filename = filename
          document.buffer = data.split(COMMON.NEWLINE)
          document.refresh()
        }
      })
    }
  },
  dictionary: async function() {
    let vConsole = Console.getConsole()

    let path = ""
    let partial = ""

    let text = vConsole.text.replace(Console.PROMPT,'').replace('open ','')

    if (text[0] === '/') {
      path = text.slice(0,text.lastIndexOf('/')+1)
      partial = text.slice(text.lastIndexOf('/')+1)
    }

    console.log(path)
    console.log(partial)

    let res = await fetch(`/api/list?path=${path}`)
    if (res.status !== 200) {
      console.log(await res.text())
      return []
    }
    return JSON.parse(await res.text())
  },
  autocomplete: async function() {
    let vConsole = Console.getConsole()
    let text = vConsole.text.replace(Console.PROMPT,'').replace('open ','')

    let path = text.slice(0,text.lastIndexOf('/')+1)
    let partial = text.slice(text.lastIndexOf('/')+1)

    let dictionary = await this.dictionary()
    let lastWord = partial
    if (this.lastSuggestion)
      lastWord = partial+lastSuggestion

    let suggestion = VString.autoComplete(
      partial,lastWord,dictionary
    ).substring(partial.length)

    console.log(`suggestion[${suggestion}]`)

    this.lastSuggestion = suggestion
    return suggestion
  },
  preview: false
}

export { open }

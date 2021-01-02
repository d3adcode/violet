import fetch from 'isomorphic-unfetch'
import Line from './line'
import PubSub from 'pubsub-js'
import React, { Component } from 'react'
import {TOPICS, COMMON} from '../includes/constants'
import VString from '../includes/vstring'

class Document extends Component {
  constructor() {
    super()
    this.cursor = {
      start: {
        row:    0,
        column: 0
      },
      end: {
        row:    0,
        column: 0
      }
    }

    this.preview = ""
    this.buffer = [""]

    this.filename = ""

    this.state = {
      buffer: this.buffer,
      cursor: this.cursor,
      preview: this.preview
    }

    this.subscribe()
  }

  setPreview(event,data) {
    pre: {
      data.text,
      typeof data.text === 'string'
    }
    this.preview = data.text

    this.refresh()
  }

  EVENT_getDocument(event,data) {
    pre: typeof data.value !== 'undefined'
    data.value = this
  }

  static getDocument() {
    let holder = {value: null}
    PubSub.publishSync(TOPICS.GET_DOCUMENT,holder)
    return holder.value
  }

  subscribe() {
    PubSub.subscribe(TOPICS.GET_DOCUMENT,this.EVENT_getDocument.bind(this))
  }

  unsubscribe() {
    PubSub.unsubscribe(this)
  }

  refresh() {
    console.log(`document.filename[${this.filename}]`)
    this.setState({
      buffer: this.buffer,
      cursor: this.cursor,
      preview: this.preview
    })
  }

  render() {
    let renderBuffer = []

    if (this.state.buffer.length == 0)
      this.state.buffer = [""]

    this.state.buffer.forEach( (line,index) => {
      renderBuffer.push(<Line key={`line-${index}`} text={line} cursor={this.state.cursor} index={index} preview={this.state.preview} />)
    })

    return renderBuffer
  }
}

export default Document

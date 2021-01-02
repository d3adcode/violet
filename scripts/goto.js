import PubSub from 'pubsub-js'
import VString from '../includes/vstring'
import { COMMON } from '../includes/constants'
import Document from '../components/document'

const goto = {
  execute: function(data) {
    pre: {
      data.text,
      typeof data.text === 'string'
    }

    let document = Document.getDocument()

    if (data.text === "start")
      data.text = "0:0"

    if (data.text === "end")
      data.text = (document.buffer.length-1).toString() + ":0"

    if (data.text === "lineStart")
      data.text = document.cursor.start.row.toString() + ":0"

    if (data.text === "lineEnd") {
      let column = document.buffer[document.cursor.start.row].length
      data.text = `${document.cursor.start.row.toString()}:${column.toString()}`
    }

    if (data.text.indexOf(':') === -1)
      throw("invalid goto input")

    document.cursor.start = {
      row: parseInt(data.text.split(':')[0]),
      column: parseInt(data.text.split(':')[1])
    }

    document.cursor.end = {
      row: document.cursor.start.row,
      column: document.cursor.start.column
    }

    document.refresh()
  },
  dictionary: ['end','lineStart','lineEnd','start'],
  preview: false
}

export { goto }

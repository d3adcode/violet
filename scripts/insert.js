import PubSub from 'pubsub-js'
import VString from '../includes/vstring'
import { COMMON, TOPICS } from '../includes/constants'
import Document from '../components/document'

const insert = {
  execute: function(data) {
    pre: typeof data.text === 'string'

    // get our document
    let document = Document.getDocument()

    if (document) {
      let vText = new VString(document.buffer.join(COMMON.NEWLINE))
      let index = vText.getColumnCursor(document.cursor.start.row,
                                        document.cursor.start.column)

      vText.insertAt(index,data.text)
      index += data.text.length

      document.cursor.start = vText.getRowColumnCursor(index)
      document.cursor.end = {
        row: document.cursor.start.row,
        column: document.cursor.start.column
      }

      document.buffer = vText.toString().split(COMMON.NEWLINE)

      document.preview = ""
      document.refresh()
    }
  },
  dictionary: function() {
    let document = Document.getDocument()

    if (document) {
      let docStr = document.buffer.join(COMMON.NEWLINE)
      docStr = docStr.replace(new RegExp(COMMON.NEWLINE,'g'),' ')
      let uniqueItems = new Set(docStr.split(' '))
      return [...uniqueItems]
    }

    return []
  },
  preview: function(data) {
    let document = Document.getDocument()

    if (document) {
      document.preview = data.text
      document.refresh()
    }
  }
}

export { insert }

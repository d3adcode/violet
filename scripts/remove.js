import PubSub from 'pubsub-js'
import VString from '../includes/vstring'
import { COMMON, TOPICS } from '../includes/constants'
import Document from '../components/document'

const remove = {
  execute: function(data) {
    // get our document
    let document = Document.getDocument()

    if (document) {
      let vText = new VString(document.buffer.join(COMMON.NEWLINE))
      let index = vText.getColumnCursor(document.cursor.start.row,
                                        document.cursor.start.column)

      vText.removeAt(index,data.text)
      document.buffer = vText.toString().split(COMMON.NEWLINE)

      /*index += data.text.length

      document.cursor.start = vText.getRowColumnCursor(index)
      document.cursor.end = {
        row: document.cursor.start.row,
        column: document.cursor.start.column
      }

      document.buffer = vText.toString().split(COMMON.NEWLINE)*/

      document.refresh()
    }
  },
  dictionary: [],
  preview: false
}

export { remove }

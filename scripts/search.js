import PubSub from 'pubsub-js'
import VString from '../includes/vstring'
import { COMMON, TOPICS } from '../includes/constants'
import Document from '../components/document'

const search = {
  execute: function(data) {
    pre: {
      data.text,
      typeof data.text === 'string' || data.text instanceof Array
    }

    let document = Document.getDocument()

    if (document) {
      if (!data.text[0]) {
        throw("SEARCH: No Subject specified.")
      }

      let bufferString = new VString(document.buffer.join(COMMON.NEWLINE))

      let start = bufferString.getColumnCursor(document.cursor.start.row,
                                               document.cursor.start.column)
      let end = bufferString.getColumnCursor(document.cursor.end.row,
                                             document.cursor.end.column)

      // if our end isn't initialized, set it to the end of the current word
      if (start === end) {
        let result = bufferString.matchForward(/\W/,start,true)
        if ( result !== null ) {
          end = result.index
        }
      }

      let result = null

      if (data.options && data.options.includes('--reverse')) {
        let regex = new RegExp(data.text,'gi') // case insensitive
        result = bufferString.matchBackward(regex,start,true) // overflow
      }
      else {
        let regex = new RegExp(data.text,'i') // case insensitive
        result = bufferString.matchForward(regex,end+1,true) // overflow
      }

      if (result !== null) {
        document.cursor.start = bufferString.getRowColumnCursor(result.index)
        document.cursor.end = bufferString.getRowColumnCursor(result.index +
                          result.length - 1)
      }

      // render changes
      document.refresh()
    }
  },
  dictionary: ['--reverse'],
  preview: false
}

export { search }

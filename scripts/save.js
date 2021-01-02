import { COMMON, TOPICS } from '../includes/constants'
import fetch from 'isomorphic-unfetch'
import PubSub from 'pubsub-js'
import Document from '../components/document'

const save = {
  execute: async function(data) {
    pre: {
      data,
      data.text,
      typeof data.text === 'string'
    }

    let document = Document.getDocument()

    if (document) {
      // TODO: relative path open and workspaces
      let filename = document.filename

      if (data.text)
        filename = data.text

      // DEFAULT FOR TESTING ONLY
      if (filename === 'test')
        filename = '/home/dwalter/projects/violet/src/App.js'

      if (filename) {
        let text = document.buffer.join(COMMON.NEWLINE) + COMMON.NEWLINE
        let url = encodeURI(`/api/save?filename=${filename}&text=${text}`)
        fetch(url)
        .then((response) => {
          if (response.status !== 200) {
            console.log(response.text())
          }
        })
      }
    }
  },
  // TODO: Once ls is implemented this will return a list
  // of files in the current workspace
  //dictionary: [],
  dictionary: function() {
    return []
  },
  preview: false
}

export { save }

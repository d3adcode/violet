import PubSub from 'pubsub-js'
import VString from '../includes/vstring'
import { TOPICS } from '../includes/constants'

const last = {
  execute: function(data) {
    pre: {
      data.text,
      typeof data.text === 'string'
    }

    var noun = data.text
    if (noun === 'word') {
      PubSub.publish(TOPICS.EXECUTE,{
        text: 'search \\w+',
        options: ['--reverse']
      })
    }
    else {
      throw("LAST: Unknown noud. Expected [word]")
    }
  },
  dictionary: ['word'],
  preview: false
}

export { last }

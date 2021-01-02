import {COMMON} from './constants'

class VString {
  constructor(str = "") {
    this.string = str
  }

  insertAt(index,text) {
    pre: {
      !isNaN(index),
      index > 0,
      text,
      typeof text === 'string'
    }
    this.string = this.string.slice(0,index) + text +
                  this.string.slice(index)
  }

  removeAt(index) {
    pre: {
      !isNaN(index),
      index > 0
    }
    this.string = this.string.slice(0,index) +
                  this.string.slice(index+1)
  }

  // return array of all capture groups
  findAll(regex = "") {
    pre: {
      typeof regex === 'string' || regex instanceof RegExp
    }
    return Array.from(this.string.matchAll(regex))
  }

  matchBackward(regex = "",start = 0,handleOverflow = false) {
    pre: {
      regex,
      typeof regex === 'string' || regex instanceof RegExp,
      start,
      !isNaN(start),
      start >= 0,
      typeof handleOverflow === 'boolean'
    }
    // get everything up to the start and search it
    var front = this.string.substr(0,start-1)
    var matches = Array.from(front.matchAll(regex))
    var overFlow = false
    // if no matches, try the back half
    if (!matches.length && handleOverflow) {
      matches = Array.from(this.string.substr(start).matchAll(regex))
      overFlow = true
    } 

    // if we finally have a set of matches...
    if (matches.length) {
      // fetch last match
      var match = matches[matches.length-1]
      // adjust for overflow
      if (overFlow && handleOverflow)
        match.index += start

      return {
        match: match[0],
        index: match.index,
        input: match.input,
        length: match[0].length
      }
    }
    return null
  }

  // return first capture group from start
  // w/ or w/o rollover
  matchForward(regex = "",start = 0,handleOverflow = false) {
    pre: {
      regex,
      typeof regex === 'string' || regex instanceof RegExp,
      start,
      !isNaN(start),
      start >= 0,
      typeof handleOverflow === 'boolean'
    }
    var subString = this.string.substr(start)
    var match = subString.match(regex)

    // if we found a match...
    // account for the part we cut off
    if (match !== null)
      match.index += start
    else {
      // overflow - try the part we excluded
      if (handleOverflow) {
        if (start)
          match = this.string.substr(0,start).match(regex)
      }
    }

    if (match !== null) {
      return {
        match: match[0],
        index: match.index,
        input: match.input,
        length: match[0].length
      }
    }

    return match
  }

  // return first index of match from start with rollover
  searchForward(regex = "",start = 0) {
    pre: {
      regex,
      typeof regex === 'string' || regex instanceof RegExp,
      start,
      !isNaN(start),
      start >= 0
    }
    var index = this.substr(start).search(regex)
    return (index >= 0) ? (index + start) : index
  }

  toString() {
    return this.string
  }

  getRowColumnCursor(column) {
    pre: {
      !isNaN(column),
      column >= 0
    }
    // get everything up to our cursor, then split by newline
    let text = this.string.substr(0,column).split(COMMON.NEWLINE)
    // we should be left with our cursor on the last line
    // so our row is that last line
    let row = text.length - 1
    // and our column is the length of the last line
    column = text.slice(-1)[0].length
    return {
      row: row,
      column: column
    }
  }

  getColumnCursor(row = 0, column = 0) {
    pre: {
      !isNaN(row),
      row >= 0,
      !isNaN(column),
      column >= 0
    }
    // get our split text all the way up to the row
    let text = this.string.split(COMMON.NEWLINE).slice(0,row)
    // now sum up all the lines, except the last one
    let sum = 0
    text.map( line => sum += (line.length+1) )
    // and our column just gets added to the sum
    return sum + column
  }

  static autoComplete(partialWord = "",lastCompleteWord = "",dictionary = []) {
    pre: {
      typeof partialWord === 'string',
      typeof lastCompletedWord === 'string',
      dictionary instanceof Array
    }
    let suggestions = dictionary.filter(word => word.startsWith(partialWord))
    if (suggestions.length !== 0) {
      let lastIndex = suggestions.indexOf(lastCompleteWord)
      // roll-over
      if ( (lastIndex+1) === suggestions.length)
        return suggestions[0]

      return suggestions[lastIndex+1]
    }
    return ""
  }

}

export default VString

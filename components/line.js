import React, { Component } from 'react'
import {TOPICS} from '../includes/constants'

class Line extends Component {
  constructor(props) {
    super(props)
    this.previousStart = false
    this.previousEnd = false
    this.previousSelection = false
    this.newStart = props.cursor.start.row === props.index
    this.newEnd = props.cursor.end.row === props.index
    this.newSelection = props.cursor.start.row < props.index &&
                        props.cursor.end.row > props.index
    this.startColumnUpdated = false
    this.endColumnUpdated = false
    this.textUpdated = false
    this.previewUpdated = false

    // When passing the cursor as an object this.props.cursor
    // gets updated when nextProps.cursor does, making a comparison
    // impossible, so this is a little hack to clone the previous
    // cursor
    this.previousCursor = JSON.parse(JSON.stringify(props.cursor))

    this.focusReference = React.createRef()
  }

  componentDidMount() {
    if (this.newStart)
      this.focus()
  }

  componentDidUpdate() {
    if (this.newStart)
      this.focus()
  }

  focus(event,data) {
    this.focusReference.current.focus()
  }

  shouldComponentUpdate(nextProps, nextState) {
    // were we previously a starting line for the cursor?
    this.previousStart = this.newStart
    // were we previously an ending line?
    this.previousEnd = this.newEnd
    // were we previously between the starting and ending line?
    this.previousSelection = this.newSelection

    // are we now a starting line?
    this.newStart = nextProps.cursor.start.row === nextProps.index
    // are we now an ending line?
    this.newEnd = nextProps.cursor.end.row === nextProps.index
    // are we now between the starting and ending line?
    this.newSelection = nextProps.cursor.start.row < nextProps.index &&
                        nextProps.cursor.end.row > nextProps.index

    // did the cursor columns update?
    this.startColumnUpdated = nextProps.cursor.start.column !==
                              this.previousCursor.start.column
    this.endColumnUpdated = nextProps.cursor.end.column !==
                            this.previousCursor.end.column
    // text updated?
    this.textUpdated = this.props.text !== nextProps.text

    // preview updated?
    this.previewUpdated = this.props.preview !== nextProps.preview

    // see note in constructor
    this.previousCursor = JSON.parse(JSON.stringify(nextProps.cursor))

    return (
      this.previousStart !== this.newStart ||
      this.previousEnd !== this.newEnd ||
      this.previousSelection !== this.newSelection ||
      (this.previousStart && this.newStart && this.startColumnUpdated) ||
      (this.prevousEnd && this.newEnd && this.endColumnUpdated) ||
      (this.newStart && this.previewUpdated) ||
      this.textUpdated
    )
  }

  render() {
    let preview = ""
    let preCursor = ""
    let cursorText = ""
    let selection = ""
    let rest = ""

    let text = this.props.text
    let cursor = this.props.cursor

    let columnIndex = 0

    if ( this.newStart ) {
      let selectionStart = cursor.start.column
      preCursor = text.substr(0,selectionStart)
      cursorText = text.substr(selectionStart,1)
      // can't have an empty starting cursor
      // this happens on newline characters we parsed out
      cursorText = cursorText || " "
      // TODO: add back in preview...
      columnIndex += selectionStart + 1
    }

    if ( this.newStart && !this.newEnd )
      selection = text.substr(columnIndex)

    if ( this.newEnd )
      selection = text.substr(columnIndex,cursor.end.column - (columnIndex-1))

    if ( this.newSelection )
      selection = text

    columnIndex += selection.length

    rest = text.substr(columnIndex)

    // generate elements
    if (preCursor)
      preCursor = <span className="preCursor">{preCursor}</span>

    if (cursorText)
      cursorText = <span className="cursor">{cursorText}</span>

    if (selection)
      selection = <span className="selection">{selection}</span>

    if (this.newStart)
      preview = <span className="preview">{this.props.preview}</span>

    let lineNumber = <div className="lineNumber">{this.props.index}</div>

    return (
      <div ref={this.focusReference} className="line" tabIndex="-1">
        {lineNumber}
        <pre>
          {preCursor}
          {preview}
          {cursorText}
          {selection}
          {rest}
        </pre>
      </div>
    )
  }
}

//export default React.memo(Line)
// TODO: memoizing seems to break this...
// I'm guessing because the cursor is an object and technically
// it's memory address doesn't update...
export default Line

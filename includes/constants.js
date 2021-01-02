const COMMON = Object.freeze({
  NEWLINE:  "\n",
  BASE: {
    DECIMAL:  10
  }
})

const KEYSETS = {
  LOWER_ALPHABET: "abcdefghijklmnopqrstuvwxyz".split(''),
  UPPER_ALPHABET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
  SYMBOLS:        "!@#$%^&*()_-+={}[]|\\:;\"'<>,.?/".split(''),
  NUMBERS:        "1234567890".split(''),
  COMBINATIONS:   ["shift+enter"],
  COMMAND_KEYS:   ["enter","space","backspace","tab"]
}

KEYSETS['ALL'] = 
  KEYSETS.LOWER_ALPHABET.concat(
  KEYSETS.UPPER_ALPHABET,
  KEYSETS.SYMBOLS,
  KEYSETS.NUMBERS,
  KEYSETS.COMBINATIONS,
  KEYSETS.COMMAND_KEYS
)
Object.freeze(KEYSETS)

const RESERVED_KEYS = Object.freeze({
  BACKSPACE:  "Backspace",
  ENTER:      "Enter",
  TAB:        "Tab",
  SPACE:      " ",
  BACKARROW:  "<"
})

const TOPICS = {
  FOCUS: "FOCUS",
  EXECUTE: "EXECUTE",
  GET_DOCUMENT: "GET_DOCUMENT",
  GET_CONSOLE: "GET_CONSOLE"
}

export {
  COMMON,
  KEYSETS,
  RESERVED_KEYS,
  TOPICS
}

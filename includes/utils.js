import { RESERVED_KEYS } from './constants'

const isBackspace = (key) => key === RESERVED_KEYS.BACKSPACE
const isTab = (key) => key === RESERVED_KEYS.TAB
const isBackArrow = (key) => key === RESERVED_KEYS.BACKARROW
const isReservedKey = (key) => Object.keys(RESERVED_KEYS).includes(key.toUpperCase())
const isEnter = (key) => key === RESERVED_KEYS.ENTER

export {
  isBackspace,
  isTab,
  isBackArrow,
  isReservedKey,
  isEnter
}

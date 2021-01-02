import { goto } from './goto'
import { search } from './search'
import { insert } from './insert'
import { last } from './last'
import { next } from './next'
import { open } from './open'
import { save } from './save'
import { remove } from './remove'

const SCRIPTS = Object.freeze({
  insert: insert,
  search: search,
  goto: goto,
  last: last,
  next: next,
  open: open,
  save: save,
  remove: remove
})

export default SCRIPTS

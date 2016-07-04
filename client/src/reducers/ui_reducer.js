'use strict'
import { CHECK, CHECKTED} from '../actions/index'

const initialState = {
  checked: false
}
export default (state = initialState, action) => {
  switch (action.type) {
    case CHECK:
      return {type: 'check'}
    case CHECKTED:
      debugger  
      return {type: 'checked'}
    default:
      return {}
  }
}
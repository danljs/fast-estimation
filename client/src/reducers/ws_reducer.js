'use strict'
import { RECEIVE_MESSAGE, CONNECTED} from '../actions/index'

const initialState = {
	connected: false
}
export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_MESSAGE:
        return action.message
    case CONNECTED:
    	return {connected: true}
    default:
      return {}
  }
}
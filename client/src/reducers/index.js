'use strict'
import { combineReducers } from 'redux'
import lang_reducer from './lang_reducer'

let last_action = (state=null,action) => {
	return action
}

const rootReducer = combineReducers({
	last_action: last_action,
	lang: lang_reducer
})

export default rootReducer 
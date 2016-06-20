import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'
import {connecting,connected,receive_message,POST_MESSAGE} from '../actions/index'

export default (()=>{
    const store = createStore(rootReducer, {}, applyMiddleware(thunk))
    return store
}())

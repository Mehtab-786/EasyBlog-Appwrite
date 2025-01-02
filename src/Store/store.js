import {configureStore} from '@reduxjs/toolkit'
import stateReducer from '../Store/stateSlices'

const store = configureStore({
    reducer:{
        authData:stateReducer  
    }
})


export default store;
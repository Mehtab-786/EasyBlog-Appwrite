import { createSlice } from "@reduxjs/toolkit";

const initialState = {          //initial values for store
    status:false,
    userdata: []
}

const stateSlices =createSlice({
    name:'authData',
    initialState,
    reducers:{
        login:(state) => {
            state.status = true     //user log-ind
        },
        logout:(state) => {
            state.status = false    //user logged out
            state.userdata = []     //empty userdata like liked photos
        },
        addData:(state, action) => {
            state.userdata.push(action.payload)     //adding liked photos to store
        },
        removeData:(state, action) => {
            state.userdata = state.userdata.filter(photo => photo.photoId !== action.payload.photoId);      //remove duplicate photos 

        },
    }
})

export const {addData, login, logout, removeData} = stateSlices.actions         //exporting methods

export default stateSlices.reducer              // exporting reducer for store 

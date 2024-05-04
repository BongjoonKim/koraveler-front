import {configureStore, Tuple} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {themeReducer} from "./reducers/theme.reducer";
import { composeWithDevTools } from 'redux-devtools-extension'
import { applyMiddleware, createStore } from 'redux'

export const reduxThunk : any = configureStore({
    reducer : {
        themeReducer
    },
    middleware: (getDefaultMiddleware : any) => getDefaultMiddleware().concat(thunk)
});
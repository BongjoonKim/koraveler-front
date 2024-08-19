import {configureStore} from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import {themeReducer} from "./reducers/theme.reducer";

// @ts-ignore
const reduxThunk : any = configureStore({
    reducer : {
        themeReducer
    },
    middleware: (getDefaultMiddleware : any) => getDefaultMiddleware().concat(thunk)
});

export default reduxThunk;
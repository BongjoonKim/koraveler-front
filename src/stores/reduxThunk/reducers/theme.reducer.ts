import {CHANGE_DARK, CHANGE_LIGHT} from "../action/theme.actions";

interface initialStateInf {
  [x : string] : string
}

const initialState : initialStateInf = {
  className : "light"
}

export const themeReducer = (state : initialStateInf = initialState, action: {type : string}) => {
  switch (action.type) {
    case CHANGE_DARK:
      return {className: "dark"};
      break;
    case CHANGE_LIGHT:
      return {className: "light"};
      break;
    default:
      return state;
  }
}
import { combineReducers} from "redux";
import languageReduces from "./languageReducer";
export const rootReducers=combineReducers({language:languageReduces})

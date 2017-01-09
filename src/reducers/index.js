import { combineReducers } from "redux";

import localization from "./localizationReducer";
import resource from "./resourceReducer";
import graph from "./graphReducer";
import time from "./timeReducer";
import post from "./postReducer";
import history from "./historyReducer";

export default combineReducers({
  localization,
  resource,
  graph,
  time,
  post,
  history,
});

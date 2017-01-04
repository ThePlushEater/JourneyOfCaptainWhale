import { combineReducers } from "redux";

import localization from "./localizationReducer";
import resource from "./resourceReducer";
import graph from "./graphReducer";
import time from "./timeReducer";

export default combineReducers({
  localization,
  resource,
  graph,
  time,
});

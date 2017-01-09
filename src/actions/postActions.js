import axios from "axios";

import serverConfig from "./../config/server";

export function fetchPosts() {
  return {
    type: "FETCH_POSTS",
    payload: axios.get(serverConfig.uServer + serverConfig.uPosts),
  }
}

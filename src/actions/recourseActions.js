import axios from "axios";

import serverConfig from "./../config/server";



export function fetchResources() {
  

  return {
    type: "FETCH_RESOURCES_PENDING",
    payload: axios.get(serverConfig.uServer + serverConfig.uPosts),
  }
}

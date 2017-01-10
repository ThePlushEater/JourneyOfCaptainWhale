import Immutable from 'seamless-immutable';
import store from "./../store";
import serverConfig from "./../config/server";


const defaultState = Immutable({
  router: null,
  route: "",
});

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case "SET_ROUTER": {
      // console.log(action.payload);
      return state.merge({router: action.payload});
    }
    case "PUSH_ROUTE": {
      if (action.payload == "") {
        state.router.push({pathname: ""});
        // setTimeout(function() {
        //   store.dispatch({type: "SET_SELECTED_POST_ITEM", payload: null});
        // }.bind(this), 0);
      } else {
        state.router.push({pathname: action.payload.toString()});
        // setTimeout(function() {
        //   const {allPosts} = store.getState().post;
        //   const filteredPosts = allPosts.filter((item) => {
        //     return item.title.rendered.toLowerCase().split(' ').join('-') == action.payload;
        //   });
        //   if (filteredPosts.length > 0) {
        //     store.dispatch({type: "SET_SELECTED_POST_ITEM", payload: filteredPosts[0]});
        //   }
        // }.bind(this), 0);
      }
      return state.merge({route: action.payload});
    }
    case "REFRESH_ROUTE": {
      if (state.route == "") {
        state.router.replace({pathname: ""});
        // setTimeout(function() {
        //   store.dispatch({type: "SET_SELECTED_POST_ITEM", payload: null});
        // }.bind(this), 0);
      } else {
        state.router.replace({pathname: state.route.toString()});
        // setTimeout(function() {
        //   const {allPosts} = store.getState().post;
        //   const filteredPosts = allPosts.filter((item) => {
        //     return item.title.rendered.toLowerCase().split(' ').join('-') == state.route;
        //   });
        //   if (filteredPosts.length > 0) {
        //     store.dispatch({type: "SET_SELECTED_POST_ITEM", payload: filteredPosts[0]});
        //   }
        // }.bind(this), 0);
      }
    }
  }
  return state;
};

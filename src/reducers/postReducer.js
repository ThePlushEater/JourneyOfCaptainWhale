import Immutable from 'seamless-immutable';
import store from "./../store";
import serverConfig from "./../config/server";


const defaultState = Immutable({
  fetching: false,
  fetched: false,
  error: null,
  targetPost: null,
  selectedPost: null,
  allPosts: [],
});

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case "FETCH_POSTS_PENDING": {
      return state.merge({fetching: true});
    }
    case "FETCH_POSTS_REJECTED" : {
      return state.merge({fetching: false, error: action.payload});
    }
    case "FETCH_POSTS_FULFILLED" : {
      setTimeout(function() {
        const {postTitle} = store.getState().history.router.params;
        if (postTitle) {
          const {allPosts} = store.getState().post;
          const filteredPosts = allPosts.filter((item) => {
            return item.title.rendered.toLowerCase().split(' ').join('-') == postTitle;
          });
          if (filteredPosts.length > 0) {
            store.dispatch({type: "SET_SELECTED_POST_ITEM", payload: filteredPosts[0]});
          }
        }
      }.bind(this), 0);
      return state.merge({fetching: false, fetched: true, allPosts: action.payload.data});
    }
    case "SET_SELECTED_POST_ITEM": {
      return state.merge({selectedPost: action.payload});
    }
    case "SET_TARGET_POST_ITEM": {
      return state.merge({targetPost: action.payload});
    }
  }
  return state;
};

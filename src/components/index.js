import "babel-polyfill";
require('./../utils/performance-polyfill');

import React from "react";
import ReactDom from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { Provider, connect } from "react-redux";
import store from "./../store";

import App from "./app";
import Home from "./home";

require('./index.scss');

function historyChange(nextState, replaceState) {
  setTimeout(function() {
    if (nextState.params.postTitle) {
      const {allPosts} = store.getState().post;
      const filteredPosts = allPosts.filter((item) => {
        return item.title.rendered.toLowerCase().split(' ').join('-') == nextState.params.postTitle;
      });
      if (filteredPosts.length > 0) {
        store.dispatch({type: "SET_SELECTED_POST_ITEM", payload: filteredPosts[0]});
      }
    } else {
      store.dispatch({type: "SET_SELECTED_POST_ITEM", payload: null});
    }
  }.bind(this), 0);
}

ReactDom.render(<Provider store={store}>
  <Router history={browserHistory}>
      <Route path={__DIRECTORY__ + "/"} component={App}>
        <IndexRoute
          component={Home}
          onEnter={historyChange} />
      </Route>
      <Route
        path={__DIRECTORY__ + "/:postTitle"}
        component={App}
        onEnter={historyChange} />
    </Router>
  </Provider>
, document.querySelector('#app'));

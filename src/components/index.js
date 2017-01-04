import "babel-polyfill";

import React from "react";
import ReactDom from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { Provider, connect } from "react-redux";
import store from "./../store";

import App from "./app";
import Home from "./home";

require('./index.scss');

ReactDom.render(<Provider store={store}>
  <Router history={browserHistory}>
      <Route path={__DIRECTORY__ + "/"} component={App}>
        <IndexRoute component={Home} />
      </Route>
    </Router>
  </Provider>
, document.querySelector('#app'));

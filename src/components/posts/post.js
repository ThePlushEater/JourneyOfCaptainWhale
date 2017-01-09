import React from "react";
import store from "./../../store";
import ReactDom from "react-dom";
import { connect } from "react-redux";

require('./post.scss');

@connect((store) => {
  return {
    localization: store.localization,
  }
})
export default class Post extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {

  }
  render() {
    const { localization } = this.props.localization;
    return(
      <div ref="container" className="post">

      </div>
    );
  }
}

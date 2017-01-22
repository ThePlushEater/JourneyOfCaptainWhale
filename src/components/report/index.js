import React from "react";
import store from "./../../store";
import ReactDom from "react-dom";
import { connect } from "react-redux";

import * as THREE from 'three';

require('./report.scss');

@connect((store) => {
  return {
    localization: store.localization,
  }
})
export default class Report extends React.Component {
  constructor() {
    super();
    this.state = {

    };
    this.timer = null;
  }
  componentWillMount() {

  }
  _onMouseEnter(event) {
    const {mouseInput} = store.getState().resource;
    if (mouseInput) {
      mouseInput._active = false;
    }
  }
  _onMouseLeave(event) {
    const {mouseInput} = store.getState().resource;
    if (mouseInput) {
      mouseInput._active = true;
    }
  }
  componentDidMount() {
    const {container} = this.refs;
    container.addEventListener('mouseenter', this._onMouseEnter, false);
    container.addEventListener('touchenter', this._onMouseEnter, false);
    container.addEventListener('touchmove', this._onMouseEnter, false);
    container.addEventListener('mouseleave', this._onMouseLeave, false);
    container.addEventListener('touchleave', this._onMouseLeave, false);

    const contentDOM = ReactDom.findDOMNode(this.refs['content']);
    window.addEventListener('resize', function(event) {
      const iframes = contentDOM.querySelectorAll('iframe');
      iframes.forEach((element) => {
        element.width = contentDOM.clientWidth;
        element.height = contentDOM.clientWidth * 9 / 16;
      });
    }.bind(this));
    const iframes = contentDOM.querySelectorAll('iframe');
    if (iframes && iframes.length > 0) {
      for (let i = 0; i < iframes.length; i++) {
        iframes[i].width = contentDOM.clientWidth;
        iframes[i].height = contentDOM.clientWidth * 9 / 16;
        iframes[i].src += "&rel=0&showinfo=0";
      }
    }
    const links = contentDOM.querySelectorAll('a');
    if (links && links.length > 0) {
      for (let i = 0; i < links.length; i++) {
        links[i].target = "_blank";
      }
    }
    // const images = contentDOM.querySelectorAll('img');
    // images.forEach((element) => {
    //   element.width = contentDOM.clientWidth;
    //   element.height = contentDOM.clientWidth * 9 / 16;
    // });
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // if (nextProps.post == null || this.props.post || this.props.post.id != nextProps.post.id) {
    //
    // }
  }
  componentWillUnmount() {
    this._onMouseLeave();
  }
  onBack(event) {
    this.props.dispatch({type: "PUSH_ROUTE", payload: ""});
  }
  render() {
    const {localization} = this.props.localization;
    const {post} = this.props;

    return(
      <div ref="container" className="report">
        <div className="option">
          <div>
            Journey Report
          </div>
          <div className="back" onClick={this.onBack.bind(this)}>
            Back to Sea
          </div>
        </div>
        <div className="wrapper">
          <h2 className="title">
            {post.title.rendered}
          </h2>
          <div ref="content" className="content" dangerouslySetInnerHTML={{__html: post.content.rendered}} >
          </div>
        </div>
      </div>
    );
  }
}

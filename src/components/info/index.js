import React from "react";
import store from "./../../store";
import ReactDom from "react-dom";
import { connect } from "react-redux";

import * as THREE from 'three';

import {geoCoordinateToEuler} from './../../utils/math';

require('./info.scss');

@connect((store) => {
  return {
    localization: store.localization,
    post: store.post,
    graph: store.graph,
  }
})
export default class Info extends React.Component {
  constructor() {
    super();
    this.state = {

    };
    this.timer = null;
  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  onMoveCamera(event) {

  }
  componentWillReceiveProps(nextProps) {
    if (this.state.eventControl == null) {
      const {eventControl} = store.getState().resource;
      eventControl.addEventListener('movecamera', this.onMoveCamera.bind(this));
      this.setState({
        eventControl: eventControl,
      });
    }
    const {coordinate, address} = this.props.graph;
    if (this.timer == null) {
      this.timer = setTimeout(function() {
        this.timer = null;
        this.setState({
          address: "@ " + coordinate[0].toFixed(5) + ", " + coordinate[1].toFixed(5) + " - " + address,
        })
      }.bind(this), 500);
    }
  }
  componentWillUnmount() {

  }
  onClickPost(event) {
    const {eventControl} = store.getState().resource;
    const {targetPost} = this.props.post;
    eventControl.selectPost(targetPost);
  }
  render() {
    const {localization} = this.props.localization;
    const {targetPost} = this.props.post;

    let courseToValue = "None";
    if (targetPost) {
      courseToValue = targetPost.title.rendered;
      if (targetPost.acf.summary) {
        courseToValue += " - " + targetPost.acf.summary;
      }
    }
    const width = document.querySelector('.app') ? document.querySelector('.app').clientWidth : 0;
    const height = document.querySelector('.app') ? document.querySelector('.app').clientHeight : 0;
    if (width != 0 && height != 0) {
      if ((width <= 1024 && width < height) || height < 600 ) {
        return(
          <div ref="container" className="info">
            <div className="title">
              Course To
            </div>
            <div className="content course-item" onClick={this.onClickPost.bind(this)}>
              {courseToValue}
            </div>
          </div>
        );
      } else {
        return(
          <div ref="container" className="info">
            <div className="title">
              Course To
            </div>
            <div className="content course-item" onClick={this.onClickPost.bind(this)}>
              {courseToValue}
            </div>
            <div className="title">
              Passing by
            </div>
            <div className="content">
              {this.state.address}
            </div>
          </div>
        );
      }
    }
    return null;
  }
}

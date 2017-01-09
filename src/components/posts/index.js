import React from "react";
import store from "./../../store";
import ReactDom from "react-dom";
import { connect } from "react-redux";

import * as THREE from 'three';

import {geoCoordinateToEuler} from './../../utils/math';


require('./posts.scss');

@connect((store) => {
  return {
    localization: store.localization,
    post: store.post,
  }
})
export default class Posts extends React.Component {
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
    if (this.timer) {

    } else {
      this.timer = setTimeout(function() {
        this.timer = null;
      }.bind(this), 250);
      const camDirection = event.payload;
      const {allPosts} = this.props.post;
      const sortedPosts = allPosts.asMutable().sort(function(a, b) {
        if (a.title.rendered < b.title.rendered)
          return -1;
        if (a.title.rendered > b.title.rendered)
          return 1;
        return 0;
      });

      let maxItem = 100;
      const containerHeight = ReactDom.findDOMNode(this.refs['container']) ? ReactDom.findDOMNode(this.refs['container']).clientHeight: 0;
      const postItemHeight = document.querySelector('.post-list-item') ? document.querySelector('.post-list-item').clientHeight : 0;
      if (containerHeight && postItemHeight) {
        maxItem = Math.floor(containerHeight / postItemHeight);
      }
      let curItem = 0;
      const posts = sortedPosts.map((item, index) => {
        if (curItem >= maxItem) {
          return null;
        }
        const pinDirection = new THREE.Vector3(0, 0, 1);
        pinDirection.applyEuler(geoCoordinateToEuler([item.acf.latitude, item.acf.longitude]));
        if (camDirection.angleTo(pinDirection) * 180 / Math.PI < 90) {
          curItem++;
          return <div className="post-list-item" key={"post-" + index} onClick={this.onClickPost.bind(this, item)}>{item.title.rendered}</div>
        }
        return null;
        // return <div key={"post-" + index}>{item.title.rendered}</div>;
      });


      this.setState({
        posts: posts,
      });
    }

  }
  componentWillReceiveProps(nextProps) {
    if (this.state.eventControl == null) {
      const {eventControl} = store.getState().resource;
      eventControl.addEventListener('movecamera', this.onMoveCamera.bind(this));
      this.setState({
        eventControl: eventControl,
      });
    }
  }
  componentWillUnmount() {

  }
  onClickPost(item, event) {
    const {eventControl} = store.getState().resource;
    eventControl.selectPost(item);
  }
  render() {
    const {localization} = this.props.localization;

    return(
      <div className="posts">
        <div className="title">
          Other Nearby Treasures
        </div>
        <div ref="container" className="content">
          {this.state.posts}
        </div>
      </div>
    );
  }
}

import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Pin from './pin';

import {geoCoordinateToEuler} from './../../utils/math';


export default class Pins extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      posts: [<Pin text={""} coordinate={[0, 0]} zOffset={0} zRotation={0} />],
    }
  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    const {allPosts} = store.getState().post;
    const {mouseInput, eventControl} = store.getState().resource;

    const camDirection = new THREE.Vector3(0, 0, 1);
    camDirection.applyEuler(new THREE.Euler(-0.3, -0.3, 0, "YXZ"));
    camDirection.applyEuler(eventControl._camera.rotation);

    const sortedPosts = allPosts.asMutable().sort(function(a, b) {
      const aDirection = new THREE.Vector3(0, 0, 1);
      const aEuler = geoCoordinateToEuler([a.acf.latitude, a.acf.longitude]);
      aDirection.applyEuler(new THREE.Euler(aEuler.x, aEuler.y, aEuler.z, "YXZ"));
      const bDirection = new THREE.Vector3(0, 0, 1);
      const bEuler = geoCoordinateToEuler([b.acf.latitude, b.acf.longitude]);
      bDirection.applyEuler(new THREE.Euler(bEuler.x, bEuler.y, bEuler.z, "YXZ"));

      const aDotCamera = camDirection.dot(aDirection);
      const bDotCamera = camDirection.dot(bDirection);

      const aToCameraAngle = camDirection.angleTo(aDirection);
      const bToCameraAngle = camDirection.angleTo(bDirection);

      if (aToCameraAngle < bToCameraAngle)
        return -1;
      if (aToCameraAngle > bToCameraAngle)
        return 1;
      return 0;
    });

    // console.log(allPosts);
    // if (this.state.posts.length != allPosts.length) {
    //
    // }

    const posts = allPosts.map((item, index) => {
      if (sortedPosts[0].id == item.id) {
        return <Pin key={"poist-" + index} closest={true} item={item} text={item.title.rendered} coordinate={[item.acf.latitude, item.acf.longitude]} zOffset={item.acf.zoffset} zRotation={item.acf.zrotation} />;
      }
      return <Pin key={"poist-" + index} closest={false} item={item} text={item.title.rendered} coordinate={[item.acf.latitude, item.acf.longitude]} zOffset={item.acf.zoffset} zRotation={item.acf.zrotation} />;
    });
    this.setState({
      posts: posts,
    });
  }
  componentWillUnmount() {

  }
  render() {
    const {deltaTime} = store.getState().time;
    return(
      <group>
        {this.state.posts}
      </group>
    );
  }
}

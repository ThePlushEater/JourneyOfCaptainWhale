import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Pin from './pin';

export default class Pins extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    // const {mouseInput, deltaTime} = nextProps;
    // if (mouseInput.getMouseButton(0)) {
    //   const ray = mouseInput.getCameraRay();
    //
    //   const intersection = dragPlane.intersectLine(new THREE.Line3(
    //   ray.origin,
    //   ray.origin.clone()
    //     .add(ray.direction.clone().multiplyScalar(10000))
    // ));
    //
    // }
    // if (mouseInput.getMouseButton(0)) {
    // 	var intersects = mouseInput.getIntersections();
    //   console.log(intersects);
    // 	for (let i = 0; i < intersects.length; i++) {
    // 		intersects[ i ].object.material.color.set(0xff0000);
    // 	}
    // }
  }
  componentWillUnmount() {

  }
  render() {
    const {deltaTime} = store.getState().time;
    return(
      <group>
        <Pin coordinate={[33.743145, -84.384557]} zOffset={2.01} />
        <Pin coordinate={[37.547598, 126.984737]} zOffset={2.01} />
      </group>
    );
  }
}

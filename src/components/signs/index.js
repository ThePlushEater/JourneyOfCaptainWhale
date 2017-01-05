import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Sign from './sign';

export default class Signs extends React.Component {
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
    return(
      <group>
        <Sign coordinate={[-10.803801, 176.903969]} />
        <Sign coordinate={[17.840052, -35.967125]} />
        <Sign coordinate={[-58.889128, 33.466469]} />
        <Sign coordinate={[17.169492, 144.911781]} />
        <Sign coordinate={[-72.075828, -168.202131]} />
        <Sign coordinate={[72.108805, -9.997016]} />
        <Sign coordinate={[49.797782, -33.727483]} />
        <Sign coordinate={[-11.996491, -133.689735]} />
        <Sign coordinate={[-39.457563, -12.015900]} />
      </group>
    );
  }
}

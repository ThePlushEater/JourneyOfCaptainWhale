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
        <Pin text={"About Whale"} coordinate={[-19.855589, -31.440166]} zOffset={2.0} zRotation={-0.125} />
        <Pin text={"Title 1"} coordinate={[29.797304, -57.526020]} zOffset={2.0} zRotation={0.11} />
        <Pin text={"Test Title 2"} coordinate={[16.588323, -148.932268]} zOffset={2.0} zRotation={0.1} />
        <Pin text={"Title 3"} coordinate={[-40.484951, -85.475238]} zOffset={2.0} zRotation={-0.2} />
        <Pin text={"Long Long Title 4"} coordinate={[-27.727754, 165.540388]} zOffset={2.0} zRotation={-0.15} />
        <Pin text={"Short Title 5"} coordinate={[-38.782156, 36.979226]} zOffset={2.0} zRotation={-0.15} />
        <Pin text={"Test Title 6"} coordinate={[45.916407, -19.908833]} zOffset={2.0} zRotation={0.15} />
        <Pin text={"Long Long Title 7"} coordinate={[74.002381, 62.938913]} zOffset={2.0} zRotation={0.25} />
        <Pin text={"Test Title 8"} coordinate={[12.085236, 62.984138]} zOffset={2.0} zRotation={0} />
        <Pin text={"Long Long Title 9"} coordinate={[32.586383, 158.257575]} zOffset={2.0} zRotation={0.05} />
        <Pin text={"Long Long Title 10"} coordinate={[43.103179, -131.605707]} zOffset={2.0} zRotation={0.25} />
        <Pin text={"Title 11"} coordinate={[11.224461, -109.633051]} zOffset={2.0} zRotation={0.1} />
        <Pin text={"Title 12"} coordinate={[-57.584946, -126.859612]} zOffset={2.0} zRotation={-0.2} />
        <Pin text={"Title 13"} coordinate={[-31.163236, -127.562737]} zOffset={2.0} zRotation={-0.15} />
        <Pin text={"Title 14"} coordinate={[-23.070393, 98.654963]} zOffset={2.0} zRotation={-0.025} />
        <Pin text={"Title 15"} coordinate={[-51.829504, 99.358088]} zOffset={2.0} zRotation={-0.15} />
        <Pin text={"Title 16"} coordinate={[-57.448493, -47.612040]} zOffset={2.0} zRotation={-0.15} />
        <Pin text={"Title 17"} coordinate={[-28.039011, 57.505145]} zOffset={2.0} zRotation={-0.15} />
        <Pin text={"Title 18"} coordinate={[14.555942, 157.876239]} zOffset={2.0} zRotation={0.1} />
        <Pin text={"Title 19"} coordinate={[1.882723, 107.602802]} zOffset={2.0} zRotation={0.0} />
      </group>
    );
  }
}

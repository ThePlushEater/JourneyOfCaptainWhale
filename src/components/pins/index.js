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
        <Pin text={"Title 1"} coordinate={[33.743145, -84.384557]} zOffset={2.01} zRotation={0.1} />
        <Pin text={"Test Title 2"} coordinate={[40.335944, 126.454752]} zOffset={2.01} zRotation={0.2} />
        <Pin text={"Title 3"} coordinate={[-29.202673, -69.717126]} zOffset={2.05} zRotation={-0.2} />
        <Pin text={"Long Long Title 4"} coordinate={[-27.227387, 149.869147]} zOffset={2.01} zRotation={-0.15} />
        <Pin text={"Short Title 5"} coordinate={[-32.958508, 21.837527]} zOffset={2.05} zRotation={-0.15} />
        <Pin text={"Test Title 6"} coordinate={[39.803830, -5.408566]} zOffset={2.01} zRotation={0.15} />
        <Pin text={"Long Long Title 7"} coordinate={[65.632581, 16.332285]} zOffset={2.01} zRotation={0.25} />
        <Pin text={"Test Title 8"} coordinate={[12.076305, 77.735965]} zOffset={2.025} zRotation={0} />
        <Pin text={"Long Long Title 9"} coordinate={[33.015427, 142.978189]} zOffset={2.0} zRotation={0.1} />
        <Pin text={"Long Long Title 10"} coordinate={[53.001453, -124.999789]} zOffset={2.01} zRotation={0.25} />
        <Pin text={"Title 11"} coordinate={[20.590202, -103.418970]} zOffset={2.01} zRotation={0.1} />
      </group>
    );
  }
}

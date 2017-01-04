import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import {geoCoordinateToEuler} from './../../utils/math';

export default class Pin extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      rotation: new THREE.Euler(1.57, 0, 0),
    }
  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    const {mouseInput, eventControl} = store.getState().resource;
    const {deltaTime} = store.getState().time;
    const {pin} = this.refs;

    if (mouseInput.getMouseButton(0)) {
    	var intersects = mouseInput.getIntersections(pin);
      if (intersects.length > 0) {
        eventControl.selectPin(this);
      }
    	// for (let i = 0; i < intersects.length; i++) {
    	// 	intersects[ i ].object.material.color.set(0xff0000);
    	// }
    }
    this.setState({
      position: new THREE.Vector3(0, 0, nextProps.zOffset),
    });

    // if (mouseInput.getMouseButton(0)) {
    //   const ray = mouseInput.getCameraRay();
    //
    //   // calculate objects intersecting the picking ray
    // 	var intersects = ray.intersectObjects(pin);
    //   console.log(intersects);
    // }
    // this.setState({
    //   position: new THREE.Vector3(0, 0, nextProps.zOffset),
    // });
    // // console.log(nextProps.coordinate, geoCoordinateToEuler(nextProps.coordinate));
  }
  componentWillUnmount() {

  }
  render() {
    return(
      <group rotation={geoCoordinateToEuler(this.props.coordinate)}>
        <mesh ref="pin"
          position={this.state.position}
          rotation={this.state.rotation}>
          <geometryResource
            resourceId="pinGeometry"
          />
          <materialResource
            resourceId="pinMaterial"
          />
        </mesh>
      </group>
    );
  }
}

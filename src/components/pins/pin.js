import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';
require('./../../utils/threejs-bend');

import {geoCoordinateToEuler} from './../../utils/math';

export default class Pin extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      scale: new THREE.Vector3(1.5, 1.5, 1.5),
      rotation: new THREE.Euler(1.57, 0, 0),
      rotation2: new THREE.Euler(0, 0.15, 0),
    }
    this.selected = false;
  }
  componentWillMount() {

  }
  componentDidMount() {
    this.modifier = new THREE.BendModifier();

    const {pin, text} = this.refs;
    let dir, ax, ang;
    // dir = new THREE.Vector3(0, 1, 0);
		// ax =  new THREE.Vector3(0, 0, 1);
		// ang = -Math.PI / 8;
    // this.modifier.set(dir, ax, ang).modify(text);
    dir = new THREE.Vector3(0, 0, -1);
		ax =  new THREE.Vector3(0, 1, 0);
		ang = -Math.PI / 200 * this.props.text.length;
    this.modifier.set(dir, ax, ang).modify(text);
    this.setState({
      rotation2: new THREE.Euler(0, 0.15 + this.props.text.length * 0.01, this.props.zRotation),
    });
  }
  componentWillReceiveProps(nextProps) {
    const {mouseInput, eventControl} = store.getState().resource;
    const {deltaTime} = store.getState().time;
    const {pin, text} = this.refs;

    if (mouseInput.getMouseButton(0) && !this.selected) {
    	this.selected = true;
    	// for (let i = 0; i < intersects.length; i++) {
    	// 	intersects[ i ].object.material.color.set(0xff0000);
    	// }
    } else if (!mouseInput.getMouseButton(0) && this.selected) {
      var intersects = mouseInput.getIntersections(pin);
      if (intersects.length > 0) {
        eventControl.selectPin(this);
      }
      this.selected = false;
    }
    this.setState({
      position: new THREE.Vector3(0, 0, nextProps.zOffset),
      position2: new THREE.Vector3(0.075, -0.05, 0.215),
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
          scale={this.state.scale}
          position={this.state.position}
          rotation={this.state.rotation}>
          <geometryResource
            resourceId="pinGeometry"
          />
          <materialResource
            resourceId="pinMaterial"
          />
        </mesh>
        <group
          position={this.state.position}
          rotation={this.state.rotation2}>
          <mesh
            position={this.state.position2}>
            <textGeometry ref="text"
              text={this.props.text}
              font={store.getState().resource.font}
              size={0.1}
              height={0}
              curveSegments={2} />
            <materialResource
              resourceId="pinTextMaterial"
            />
          </mesh>
        </group>
      </group>
    );
  }
}

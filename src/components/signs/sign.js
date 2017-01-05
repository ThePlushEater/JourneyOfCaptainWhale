import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import {geoCoordinateToEuler} from './../../utils/math';

export default class Sign extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      scale: new THREE.Euler(1.25, 1.25, 1.25),
      rotation: new THREE.Euler(1.57, (Math.random() - 0.5) * 2, Math.random() - 0.5),
      position: new THREE.Vector3(0, 0, 1.9),
    }
    this.selected = false;
  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {

  }
  render() {
    return(
      <group rotation={geoCoordinateToEuler(this.props.coordinate)}>
        <mesh
          scale={this.state.scale}
          rotation={this.state.rotation}
          position={this.state.position}>
          <geometryResource
            resourceId="signGeometry"
          />
          <materialResource
            resourceId="signMaterial"
          />
        </mesh>
      </group>
    );
  }
}


// <planeGeometry
//   width={1}
//   height={1} />

// <geometryResource
//   resourceId="signGeometry"
// />

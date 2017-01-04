import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import {geoCoordinateToEuler} from './../../utils/math';

export default class Node extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      rotation: new THREE.Euler(1.57, 0, 0),
      position: new THREE.Vector3(0, 0, 2.01),
    }
  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    const {mouseInput, eventControl} = store.getState().resource;
    const {deltaTime} = store.getState().time;
  }
  componentWillUnmount() {

  }
  render() {
    return(
      <group rotation={geoCoordinateToEuler(this.props.coordinate)}>
        <mesh
          position={this.state.position}>
          <textGeometry
            text={this.props.index.toString()}
            font={store.getState().resource.font}
            size={0.05}
            height={0.01} />
          <materialResource
            resourceId="nodeMaterial"
          />
        </mesh>
      </group>
    );
  }
}

// <mesh
//   position={this.state.position}
//   rotation={this.state.rotation}>
//   <geometryResource
//     resourceId="nodeGeometry"
//   />
//   <materialResource
//     resourceId="nodeMaterial"
//   />
// </mesh>

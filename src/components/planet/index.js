import React from "react";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

export default class Planet extends React.Component {
  constructor(props, context) {
    super(props, context);
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
      <group>
        <mesh>
          <geometryResource
            resourceId="planetSeaGeometry"
          />
          <materialResource
            resourceId="planetSeaMaterial"
          />
        </mesh>
        <mesh>
          <geometryResource
            resourceId="planetLandGeometry"
          />
          <materialResource
            resourceId="planetLandMaterial"
          />
        </mesh>
      </group>

    );
  }
}

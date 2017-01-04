import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import {geoCoordinateToEuler} from './../../utils/math';


export default class Ship extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
      position: new THREE.Vector3(0, 0, 2),
      curRotation: new THREE.Euler(0, 0, 0),
      targetRotations: [],
    }
  }
  componentWillMount() {

  }
  componentDidMount() {
    const {shipRoot} = this.refs;
    // if (store.getState().graph.vertices.length > 0) {
    //   this.setState({
    //     targetRotations: [],
    //   });
    // }
    // if (shipRoot) {
    //   const nextTargetRotation = new THREE.Quaternion();
    //   nextTargetRotation.setFromEuler(geoCoordinateToEuler(store.getState().graph.vertices[0].coordinate));
    //   shipRoot.setRotationFromQuaternion(nextTargetRotation);
    // }
    this.prevShipWorldPosition = new THREE.Vector3(0, 0, 0);
    this.accumulatedTime = 0;
    this.prevTargetRotation = new THREE.Quaternion();
    this.prevTargetRotation.setFromEuler(geoCoordinateToEuler([0, 0]));
    this.shipAngle = 0;
    this.shipSwindleTime = 0;
  }
  componentWillReceiveProps(nextProps) {
    const {shipRoot, ship} = this.refs;
    const {targetRotations} = this.state;
    const {deltaTime} = store.getState().time;

    if (targetRotations.length > 0) {
      const curDirection = new THREE.Vector3(0, 0, 1);
      curDirection.applyEuler(shipRoot.rotation);
      const targetDirection = new THREE.Vector3(0, 0, 1);
      targetDirection.applyEuler(targetRotations[0]);


      const currentRotation = new THREE.Quaternion();
      currentRotation.setFromEuler(shipRoot.rotation);
      const nextTargetRotation = new THREE.Quaternion();
      nextTargetRotation.setFromEuler(targetRotations[0]);

      const temp1 = new THREE.Vector3(0, 0, 1);
      const temp2 = new THREE.Vector3(0, 0, 1);
      temp1.applyQuaternion(this.prevTargetRotation);
      temp2.applyQuaternion(nextTargetRotation);

      const updatedRotation = new THREE.Quaternion();
      THREE.Quaternion.slerp(this.prevTargetRotation, nextTargetRotation, updatedRotation, this.accumulatedTime * (Math.PI * 2 - temp1.angleTo(temp2)));
      // const updatedRotation = currentRotation.slerp(nextTargetRotation, deltaTime * 0.01);
      shipRoot.setRotationFromQuaternion(updatedRotation);

      const shipWorldPosition = new THREE.Vector3();
      shipWorldPosition.setFromMatrixPosition(ship.matrixWorld);
      const shipDirection = shipWorldPosition.clone().sub(this.prevShipWorldPosition);
      shipWorldPosition.normalize();
      shipDirection.normalize();
      const downDirection = new THREE.Vector3(shipWorldPosition.x, -(-shipWorldPosition.x * shipWorldPosition.x - shipWorldPosition.z * shipWorldPosition.z) / shipWorldPosition.y, shipWorldPosition.z);


      downDirection.normalize();
      const angle = downDirection.angleTo(shipDirection);
      if (!isNaN(angle)) {
        const sign = new THREE.Vector3().crossVectors(downDirection, shipDirection).y < 0 ? -1 : 1;
        this.shipAngle = this.shipAngle + (sign * angle - this.shipAngle) * deltaTime;
      }

      if (curDirection.dot(targetDirection) > 0.999) {
        targetRotations.shift();
        this.prevTargetRotation.setFromEuler(shipRoot.rotation);
        this.accumulatedTime = 0;
          this.setState({
            targetRotations: targetRotations,
          });
      }
      this.accumulatedTime += deltaTime * 0.05;
      this.prevShipWorldPosition = new THREE.Vector3().setFromMatrixPosition(ship.matrixWorld);
    }
    ship.setRotationFromEuler(new THREE.Euler(0, 0.15 * Math.sin(this.shipSwindleTime), this.shipAngle));
    this.shipSwindleTime += deltaTime;
    if (this.shipSwindleTime > Math.PI * 2) {
      this.shipSwindleTime -= Math.PI * 2;
    }
  }
  componentWillUnmount() {

  }
  render() {
    return(
      <group ref="shipRoot">
        <group ref="ship"
          position={this.state.position}>
          <mesh
            rotation={this.state.rotation}>
            <geometryResource
              resourceId="shipBottomGeometry"
            />
            <materialResource
              resourceId="shipBottomMaterial"
            />
          </mesh>
          <mesh
            rotation={this.state.rotation}>
            <geometryResource
              resourceId="shipBodyGeometry"
            />
            <materialResource
              resourceId="shipBodyMaterial"
            />
          </mesh>
          <mesh
            rotation={this.state.rotation}>
            <geometryResource
              resourceId="shipTopGeometry"
            />
            <materialResource
              resourceId="shipTopMaterial"
            />
          </mesh>
          <mesh
            rotation={this.state.rotation}>
            <geometryResource
              resourceId="shipDecoGeometry"
            />
            <materialResource
              resourceId="shipDecoMaterial"
            />
          </mesh>
          <mesh
            rotation={this.state.rotation}>
            <geometryResource
              resourceId="shipPoleGeometry"
            />
            <materialResource
              resourceId="shipPoleMaterial"
            />
          </mesh>
        </group>
      </group>

    );
  }
}

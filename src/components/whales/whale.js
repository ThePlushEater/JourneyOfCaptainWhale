import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import {geoCoordinateToEuler, geoEulerToCoordinate} from './../../utils/math';
import {getPath} from './../../utils/pathfinder';


export default class Whale extends React.Component {
  constructor(props, context) {
    super(props, context);
    const size = (Math.random() - 0.5) * 0.1 + 0.2;
    this.state = {
      rotation: new THREE.Euler(Math.PI / 2, Math.PI, 0),
      position: new THREE.Vector3(0, 0, 2),
      scale: new THREE.Vector3(size, size, size),
      targetRotations: [],
    }
  }
  componentWillMount() {

  }
  componentDidMount() {
    const {whaleRoot} = this.refs;
    const {vertices} = store.getState().graph;
    const {index} = this.props;
    whaleRoot.setRotationFromEuler(geoCoordinateToEuler(vertices[index].coordinate));
    this.setState({
      targetRotations: [],
    })
    this.prevWhaleWorldPosition = new THREE.Vector3(0, 0, 0);
    this.pastTargetRotation = geoCoordinateToEuler(vertices[index].coordinate);
    this.prevTargetRotation = new THREE.Quaternion();
    this.prevTargetRotation.setFromEuler(geoCoordinateToEuler(vertices[index].coordinate));
    this.accumulatedTime = 0;
    this.whaleAngle = 0;
    this.whaleSwindleTime = Math.random() * Math.PI * 2;
    this.whaleSwindleTime2 = Math.random() * Math.PI * 2;
  }
  setNewPath() {
    const {whaleRoot} = this.refs;
    const {vertices, edges} = store.getState().graph;
    let startVertex = vertices[0];
    let endVertex = vertices[0];
    let startTarget = geoEulerToCoordinate(this.pastTargetRotation);
    const index = Math.floor(Math.random() * (vertices.length - 1));
    let endTarget = vertices[index].coordinate;

    let startMin = Math.pow(startVertex.coordinate[0] - startTarget[0], 2) + Math.pow(startVertex.coordinate[1] - startTarget[1], 2);
    let endMin = Math.pow(endVertex.coordinate[0] - endTarget[0], 2) + Math.pow(endVertex.coordinate[1] - endTarget[1], 2);

    vertices.forEach((item, index) => {
      let startDistance = Math.pow(item.coordinate[0] - startTarget[0], 2) + Math.pow(item.coordinate[1] - startTarget[1], 2);
      if (startDistance < startMin) {
        startMin = startDistance;
        startVertex = item;
      }

      let endDistance = Math.pow(item.coordinate[0] - endTarget[0], 2) + Math.pow(item.coordinate[1] - endTarget[1], 2);
      if (endDistance < endMin) {
        endMin = endDistance;
        endVertex = item;
      }
    });

    const path = getPath(startVertex, endVertex, vertices, edges);
    let newTargetRotations = [];
    for (let i=0; i<path.length; i++) {
      newTargetRotations.push(geoCoordinateToEuler(path[i]));
    }
    this.accumulatedTime = 0;
    this.setState({
      targetRotations: newTargetRotations,
    });
  }
  componentWillReceiveProps(nextProps) {
    const {whaleRoot, whale} = this.refs;
    const {targetRotations} = this.state;
    const {deltaTime} = store.getState().time;

    if (targetRotations.length == 0) {
      this.setNewPath();
      return;
    } else {
      const curDirection = new THREE.Vector3(0, 0, 1);
      curDirection.applyEuler(whaleRoot.rotation);
      const targetDirection = new THREE.Vector3(0, 0, 1);
      targetDirection.applyEuler(targetRotations[0]);

      const currentRotation = new THREE.Quaternion();
      currentRotation.setFromEuler(whaleRoot.rotation);
      const nextTargetRotation = new THREE.Quaternion();
      nextTargetRotation.setFromEuler(targetRotations[0]);

      const temp1 = new THREE.Vector3(0, 0, 1);
      const temp2 = new THREE.Vector3(0, 0, 1);
      temp1.applyQuaternion(this.prevTargetRotation);
      temp2.applyQuaternion(nextTargetRotation);

      let updatedRotation = new THREE.Quaternion();
      THREE.Quaternion.slerp(this.prevTargetRotation, nextTargetRotation, updatedRotation, Math.min(1, this.accumulatedTime * (Math.PI * 2 - temp1.angleTo(temp2))));
      // if (targetRotations.length > 1) {
      //   THREE.Quaternion.slerp(this.prevTargetRotation, nextTargetRotation, updatedRotation, Math.min(1, this.accumulatedTime * (Math.PI * 2 - temp1.angleTo(temp2))));
      // } else {
      //   updatedRotation = currentRotation.slerp(nextTargetRotation, deltaTime * 0.1);
      // }
      whaleRoot.setRotationFromQuaternion(updatedRotation);

      const whaleWorldPosition = new THREE.Vector3();
      whaleWorldPosition.setFromMatrixPosition(whale.matrixWorld);
      const whaleDirection = whaleWorldPosition.clone().sub(this.prevWhaleWorldPosition);
      whaleWorldPosition.normalize();
      whaleDirection.normalize();
      const downDirection = new THREE.Vector3(whaleWorldPosition.x, -(-whaleWorldPosition.x * whaleWorldPosition.x - whaleWorldPosition.z * whaleWorldPosition.z) / whaleWorldPosition.y, whaleWorldPosition.z);

      downDirection.normalize();
      const angle = downDirection.angleTo(whaleDirection);
      if (!isNaN(angle)) {
        const sign = new THREE.Vector3().crossVectors(downDirection, whaleDirection).y < 0 ? -1 : 1;
        this.whaleAngle = this.whaleAngle + (sign * angle - this.whaleAngle - Math.PI / 3) * deltaTime * 0.1;
      }

      if (curDirection.dot(targetDirection) > 0.999) {
        this.pastTargetRotation = targetRotations.shift();
        this.prevTargetRotation.setFromEuler(whaleRoot.rotation);
        this.accumulatedTime = 0;
        this.setState({
          targetRotations: targetRotations,
        });
      }
      this.accumulatedTime += deltaTime * 0.0025;
      this.prevWhaleWorldPosition = new THREE.Vector3().setFromMatrixPosition(whale.matrixWorld);
    }
    whale.setRotationFromEuler(new THREE.Euler(0.2 * Math.sin(this.whaleSwindleTime2), 0.2 * Math.sin(this.whaleSwindleTime), this.whaleAngle + 0.1 * Math.sin(this.whaleSwindleTime)));
    this.whaleSwindleTime += deltaTime;
    if (this.whaleSwindleTime > Math.PI * 2) {
      this.whaleSwindleTime -= Math.PI * 2;
    }
    this.whaleSwindleTime2 += deltaTime * 0.75;
    if (this.whaleSwindleTime2 > Math.PI * 2) {
      this.whaleSwindleTime2 -= Math.PI * 2;
    }
    this.setState({
      position: new THREE.Vector3(0, 0, 1.995 + 0.005 * Math.sin(this.whaleSwindleTime)),
    });
  }
  componentWillUnmount() {

  }
  render() {
    return(
      <group ref="whaleRoot">
        <group ref="whale"
          scale={this.state.scale}
          position={this.state.position}>
          <mesh
            rotation={this.state.rotation}>
            <geometryResource
              resourceId="whaleGeometry"
            />
            <materialResource
              resourceId="whaleMaterial"
            />
          </mesh>
        </group>
      </group>
    );
  }
}

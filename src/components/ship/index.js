import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';
// import {MeshLine} from 'three.meshline';
// var MeshLine = require( 'three.meshline' );

import {geoCoordinateToEuler, geoEulerToCoordinate} from './../../utils/math';
import {getPath} from './../../utils/pathfinder';



export default class Ship extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
      position: new THREE.Vector3(0, 0, 2.01),
      scale: new THREE.Vector3(1.5, 1.5, 1.5),
      targetRotations: [],
      lineVertices: [],
      // lineGeometry: null,
      // lineMesh: null,
    }
    this.lineDrawingCurFrame = 0;
    this.lineDrawingMaxFrame = 0.1;
    this.pathLength = 50;
  }
  componentWillMount() {
    const vector = new THREE.Vector3(0, 0, 0);
    let list = [];
    for(let i=0; i<this.pathLength; i++) {
      list.push(vector);
    }
    // const geo = new THREE.Geometry();
    // const mesh = new MeshLine();
    // mesh.setGeometry( geo );
    this.setState({
      lineVertices: list,
      // lineGeometry: geo,
      // lineMesh: mesh,
    });
  }
  componentDidMount() {
    this.prevShipWorldPosition = new THREE.Vector3(0, 0, 0);
    this.accumulatedTime = 0;
    this.prevTargetRotation = new THREE.Quaternion();
    this.prevTargetRotation.setFromEuler(geoCoordinateToEuler([0, 0]));
    this.shipAngle = 0;
    this.shipSwindleTime = 0;
    this.pastTargetRotation = new THREE.Euler();
    this.shipAddress = "South Atlantic Ocean";
  }
  onSelectPin(event) {
    const {shipRoot} = this.refs;
    const {targetRotations} = this.state;
    const {vertices, edges} = store.getState().graph;
    let startVertex = vertices[0];
    let endVertex = vertices[0];
    let startTarget;
    if (targetRotations.length >= 2) {
      startTarget = geoEulerToCoordinate(targetRotations[1]);
    } else if (targetRotations.length >= 1) {
      startTarget = geoEulerToCoordinate(targetRotations[0]);
    } else {
      startTarget = geoEulerToCoordinate(this.pastTargetRotation);
    }
    let endTarget = geoEulerToCoordinate(event.payload);

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
      let dynamicPath = path[i];
      dynamicPath[0] += (Math.random() - 0.5) * 2 * 0.01;
      dynamicPath[1] += (Math.random() - 0.5) * 2 * 0.01;
      newTargetRotations.push(geoCoordinateToEuler(dynamicPath));
    }
    this.accumulatedTime = 0;
    this.prevTargetRotation.setFromEuler(shipRoot.rotation);
    this.setState({
      targetRotations: newTargetRotations,
    });
    store.dispatch({type: "SET_SAILING", payload: true});
  }
  componentWillReceiveProps(nextProps) {
    const {shipRoot, ship, shipPath} = this.refs;
    const {targetRotations, lineVertices} = this.state;
    const {deltaTime} = store.getState().time;

    if (this.state.eventControl == null) {
      const {eventControl} = store.getState().resource;
      eventControl.addEventListener('selectpin', this.onSelectPin.bind(this));
      this.setState({
        eventControl: eventControl,
      });
    }

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

      let updatedRotation = new THREE.Quaternion();
      if (targetRotations.length > 1) {
        THREE.Quaternion.slerp(this.prevTargetRotation, nextTargetRotation, updatedRotation, Math.min(1, this.accumulatedTime * (Math.PI * 2 - temp1.angleTo(temp2))));
      } else {
        updatedRotation = currentRotation.slerp(nextTargetRotation, deltaTime);
      }
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
        this.shipAngle = this.shipAngle + (sign * angle - this.shipAngle - Math.PI / 3) * deltaTime;
      }

      if (curDirection.dot(targetDirection) > 0.999) {
        this.pastTargetRotation = targetRotations.shift();
        this.prevTargetRotation.setFromEuler(shipRoot.rotation);
        this.accumulatedTime = 0;
        this.setState({
          targetRotations: targetRotations,
        });
        if (this.state.eventControl != null && targetRotations.length == 0) {
          this.state.eventControl.finishSailing();
          store.dispatch({type: "SET_SAILING", payload: false});
        }
        const {vertices} = store.getState().graph;
        const pastTargetGeo = geoEulerToCoordinate(this.pastTargetRotation);
        let temp = vertices[0];
        let min = Math.pow(temp.coordinate[0] - pastTargetGeo[0], 2) + Math.pow(temp.coordinate[1] - pastTargetGeo[1], 2);
        vertices.forEach((item, index) => {
          let distance = Math.pow(item.coordinate[0] - pastTargetGeo[0], 2) + Math.pow(item.coordinate[1] - pastTargetGeo[1], 2);
          if (distance < min) {
            min = distance;
            temp = item;
          }
        });
        this.shipAddress = temp.address;
      }
      this.accumulatedTime += deltaTime * 0.175;
      this.prevShipWorldPosition = new THREE.Vector3().setFromMatrixPosition(ship.matrixWorld);

      if (this.lineDrawingCurFrame > this.lineDrawingMaxFrame) {
        lineVertices.push(this.prevShipWorldPosition.clone().multiplyScalar(1.01));
        if (lineVertices.length > this.pathLength) {
          lineVertices.shift();
        }
        this.setState({
          lineVertices: lineVertices,
        });
        shipPath.verticesNeedUpdate = true;
        shipPath.computeLineDistances();
        this.lineDrawingCurFrame = 0;
      } else {
        this.lineDrawingCurFrame += deltaTime;
      }
    }
    ship.setRotationFromEuler(new THREE.Euler(0.1 * Math.sin(this.shipSwindleTime), 0.2 * Math.sin(this.shipSwindleTime), this.shipAngle));
    this.shipSwindleTime += deltaTime;
    while(this.shipSwindleTime > Math.PI * 2) {
      this.shipSwindleTime -= Math.PI * 2;
    }
    const qt = new THREE.Quaternion().setFromEuler(shipRoot.rotation).normalize();
    const eu = new THREE.Euler().setFromQuaternion(qt, "YXZ");
    const geo = geoEulerToCoordinate(eu);

    store.dispatch({type: "SET_SHIP_ADDRESS", payload: {coordinate: geo, address: this.shipAddress}});

  }
  componentWillUnmount() {

  }
  render() {
    return(
      <group>
        <line>
          <geometry
            ref="shipPath"
            vertices={this.state.lineVertices}
            dynamic={true}
          />
          <materialResource
            resourceId="shipPathMaterial"
          />
        </line>
        <group ref="shipRoot">
          <group ref="ship"
            scale={this.state.scale}
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
      </group>
    );
  }
}

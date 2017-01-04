import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import {geoCoordinateToEuler} from './../../utils/math';


export default class Camera extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      position: new THREE.Vector3(0, 0, 4),
      rotateMomentum: new THREE.Vector3(0, 0, 0),
      targetRotation: null,
    }
  }
  componentWillMount() {

  }
  componentDidMount() {
    const {eventControl} = store.getState().resource;
  }
  onSelectPin(event) {
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(event.payload);
    this.setState({
      targetRotation: rotation,
    })
  }
  onUnselectPin(event) {
    this.setState({
      targetRotation: null,
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.eventControl == null) {
      const {eventControl} = store.getState().resource;
      eventControl.addEventListener('selectpin', this.onSelectPin.bind(this));
      eventControl.addEventListener('unselectpin', this.onUnselectPin.bind(this));
      this.setState({
        eventControl: eventControl,
      });
    }
    const {mouseInput} = store.getState().resource;
    const {deltaTime} = store.getState().time;
    const {cameraRoot} = this.refs;
    const {targetRotation} = this.state;


    if (mouseInput.getMouseButton(0)) {
      let cameraRootRotation = new THREE.Quaternion();

      const cameraRootUp = new THREE.Vector3(0, -1, 0).applyQuaternion(cameraRootRotation);
      const cameraRootRight = new THREE.Vector3(-1, 0, 0).applyQuaternion(cameraRootRotation);
      const rotateUpMomentum = cameraRootUp.clone().multiplyScalar(mouseInput.getAxis("Mouse X"));
      const rotateRightMomentum = cameraRootRight.clone().multiplyScalar(mouseInput.getAxis("Mouse Y"));
      const rotateMomentum =  rotateUpMomentum.clone().add(rotateRightMomentum);

      if (rotateMomentum.length() != 0) {
        cameraRoot.rotateOnAxis(rotateMomentum.clone().normalize(), rotateMomentum.length() * deltaTime * 0.025);
        this.setState({
          rotateMomentum: rotateMomentum,
        });
      } else {
        const rotateMomentum = this.state.rotateMomentum.clone().lerp(new THREE.Vector3(0, 0, 0), deltaTime * 5);
        if (rotateMomentum.length() != 0) {
          cameraRoot.rotateOnAxis(rotateMomentum.clone().normalize(), rotateMomentum.length() * deltaTime * 0.025);
        }
        this.setState({
          rotateMomentum: rotateMomentum,
        });
      }

      if (this.state.eventControl._pin) {
        const camDirection = new THREE.Vector3(0, 0, 1);
        camDirection.applyEuler(cameraRoot.rotation);
        const pinDirection = new THREE.Vector3(0, 0, 1);
        pinDirection.applyEuler(geoCoordinateToEuler(this.state.eventControl._pin.props.coordinate));

        if (camDirection.dot(pinDirection) < 0.99) {
            this.setState({
              targetRotation: null,
            });
        }
      }

    } else if (targetRotation != null) {
      const currentRotation = new THREE.Quaternion();
      currentRotation.setFromEuler(cameraRoot.rotation);
      const updatedRotation = currentRotation.slerp(targetRotation, deltaTime * 2.5);
      cameraRoot.setRotationFromQuaternion(updatedRotation);
    } else {
      const rotateMomentum = this.state.rotateMomentum.clone().lerp(new THREE.Vector3(0, 0, 0), deltaTime * 5);
      if (rotateMomentum.length() != 0) {
        cameraRoot.rotateOnAxis(rotateMomentum.clone().normalize(), rotateMomentum.length() * deltaTime * 0.025);
      }
      this.setState({
        rotateMomentum: rotateMomentum,
      });
    }
  }
  componentWillUnmount() {

  }
  render() {
    const {aspect} = this.props;
    return(
      <group ref="cameraRoot">
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={aspect}
          near={0.1}
          far={1000}
          position={this.state.position}
        />
        <pointLight
          position={new THREE.Vector3(0, 0, 10)}
          intensity={0.5}
        />
        <pointLight
          position={new THREE.Vector3(10, 10, 10)}
          intensity={0.5}
        />
      </group>
    );
  }
}

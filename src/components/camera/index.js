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
    // const rotation = new THREE.Quaternion();
    // rotation.setFromEuler(new THREE.Euler(0.2, 0.2, 0, "YXZ"));
    this.state = {
      position: new THREE.Vector3(0, 0, 4),
      rotation: new THREE.Euler(0, Math.PI * 0.1, 0),
      rotateMomentum: new THREE.Vector3(0, 0, 0),
      targetRotation: null,
      offset: [0.2, 0.2, 0],
    }
  }
  componentWillMount() {

  }
  componentDidMount() {
    const {cameraRoot} = this.refs;
    const {offset} = this.state;
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(offset[0], offset[1], offset[2], "YXZ"));
    cameraRoot.setRotationFromQuaternion(rotation);
    // const {eventControl} = store.getState().resource;
    const width = document.querySelector('.app') ? document.querySelector('.app').clientWidth : 0;
    const height = document.querySelector('.app') ? document.querySelector('.app').clientHeight : 0;
    if (width != 0 && height != 0) {
      if (width <= 1024 && width < height) {
        this.setState({
          position: new THREE.Vector3(0, 0, 0),
          rotation: new THREE.Euler(0, 0, 0),
          offset: [0.0, 0.0, 0],
        });
      } else {
        this.setState({
          position: new THREE.Vector3(0, 0, 0),
          rotation: new THREE.Euler(0, 0, 0),
          offset: [0.0, 0.0, 0],
        });
      }
    }
  }
  onSelectPin(event) {
    const {offset} = this.state;
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(event.payload.x + offset[0], event.payload.y + offset[1], event.payload.z + offset[2], "YXZ"));
    this.setState({
      targetRotation: rotation,
    });
  }
  onUnselectPin(event) {
    this.setState({
      targetRotation: null,
    })
  }
  componentWillReceiveProps(nextProps) {
    // const {eventControl} = store.getState().resource;
    const width = document.querySelector('.app') ? document.querySelector('.app').clientWidth : 0;
    const height = document.querySelector('.app') ? document.querySelector('.app').clientHeight : 0;
    if (width != 0 && height != 0) {
      if (width <= 768 && width < height) {
        this.setState({
          // position: new THREE.Vector3(0, 0, 3 * Math.max(768 / width, 1)),
          // rotation: new THREE.Euler(Math.PI * 0.15, 0, 0),
          // offset: [0.3, 0.4, -0.1],
          position: new THREE.Vector3(0, 0, 6 * Math.max(768 / width, 1)),
          rotation: new THREE.Euler(0.225, 0, 0),
          offset: [0.3, 0.3, 0],
        });
      } else {
        this.setState({
          position: new THREE.Vector3(0, 0, 9.5),
          rotation: new THREE.Euler(0.0, Math.PI * 0.05, 0),
          offset: [0.3, 0.3, 0],
        });
      }
    }

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
    const {offset} = this.state;


    if (mouseInput.getMouseButton(0)) {
      let cameraRootRotation = new THREE.Quaternion();

      const cameraRootUp = new THREE.Vector3(0, -1, 0).applyQuaternion(cameraRootRotation);
      const cameraRootRight = new THREE.Vector3(-1, 0, 0).applyQuaternion(cameraRootRotation);
      const rotateUpMomentum = cameraRootUp.clone().multiplyScalar(mouseInput.getAxis("Mouse X"));
      const rotateRightMomentum = cameraRootRight.clone().multiplyScalar(mouseInput.getAxis("Mouse Y"));
      const rotateMomentum =  rotateUpMomentum.clone().add(rotateRightMomentum);

      if (rotateMomentum.length() != 0) {
        cameraRoot.rotateOnAxis(rotateMomentum.clone().normalize(), rotateMomentum.length() * deltaTime * 0.025 * this.state.position.z / 4);
        this.setState({
          rotateMomentum: rotateMomentum,
        });
      } else {
        const rotateMomentum = this.state.rotateMomentum.clone().lerp(new THREE.Vector3(0, 0, 0), deltaTime * 1.5 * this.state.position.z / 4);
        if (rotateMomentum.length() != 0) {
          cameraRoot.rotateOnAxis(rotateMomentum.clone().normalize(), rotateMomentum.length() * deltaTime * 0.025 * this.state.position.z / 4);
        }
        this.setState({
          rotateMomentum: rotateMomentum,
        });
      }

      if (this.state.eventControl._pin && rotateMomentum.length() != 0) {
        const camDirection = new THREE.Vector3(0, 0, 1);
        camDirection.applyEuler(cameraRoot.rotation);
        const pinDirection = new THREE.Vector3(0, 0, 1);
        let temp;
        if (this.state.eventControl._pin.props) {
          temp = geoCoordinateToEuler(this.state.eventControl._pin.props.coordinate);
        } else {
          temp = geoCoordinateToEuler(this.state.eventControl._pin.coordinate);
        }
        pinDirection.applyEuler(new THREE.Euler(temp.x + offset[0], temp.y + offset[1], temp.z + offset[2], "YXZ"));

        if (camDirection.dot(pinDirection) < 0.99) {
          this.setState({
            targetRotation: null,
          });
        }
      }

    } else if (targetRotation != null) {
      const currentRotation = new THREE.Quaternion();
      currentRotation.setFromEuler(cameraRoot.rotation);
      const updatedRotation = currentRotation.slerp(targetRotation, deltaTime * 1.25);
      cameraRoot.setRotationFromQuaternion(updatedRotation);
    } else {
      const rotateMomentum = this.state.rotateMomentum.clone().lerp(new THREE.Vector3(0, 0, 0), deltaTime * 1.5 * this.state.position.z / 4);
      if (rotateMomentum.length() != 0) {
        cameraRoot.rotateOnAxis(rotateMomentum.clone().normalize(), rotateMomentum.length() * deltaTime * 0.025 * this.state.position.z / 4);
      }
      this.setState({
        rotateMomentum: rotateMomentum,
      });
    }

    if (this.state.eventControl != null) {
      this.state.eventControl.moveCamera();
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
          fov={30}
          aspect={aspect}
          near={0.1}
          far={1000}
          position={this.state.position}
          rotation={this.state.rotation}
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

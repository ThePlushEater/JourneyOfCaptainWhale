import * as THREE from 'three';

import store from "./../store";
import {geoCoordinateToEuler} from './../utils/math';
import {getNeightbors} from './../utils/pathfinder';


export default class EventControl extends THREE.EventDispatcher {
  constructor(camera) {
    super();
    this._camera = camera.refs.cameraRoot;
    // this._camera = camera.refs.cameraRoot.children[0];
    this._pin = null;
    this._prevCameraWorldPosition = new THREE.Vector3(0, 0, 0);
  }
  selectPin(pin) {
    const camDirection = new THREE.Vector3(0, 0, 1);
    camDirection.applyEuler(this._camera.rotation);
    const pinDirection = new THREE.Vector3(0, 0, 1);
    pinDirection.applyEuler(geoCoordinateToEuler(pin.props.coordinate));

    if (this._pin !== pin) {
      this._pin = pin;
      this.dispatchEvent({type: 'selectpin', payload: geoCoordinateToEuler(pin.props.coordinate)});
      // this.runPathfinding();
    } else if (camDirection.dot(pinDirection) < 0.99) {
      this.dispatchEvent({type: 'selectpin', payload: geoCoordinateToEuler(pin.props.coordinate)});
    }
  }
  selectPost(post) {
    const camDirection = new THREE.Vector3(0, 0, 1);
    camDirection.applyEuler(this._camera.rotation);
    const pinDirection = new THREE.Vector3(0, 0, 1);
    pinDirection.applyEuler(geoCoordinateToEuler([post.acf.latitude, post.acf.longitude]));

    if (this._pin !== post) {
      this._pin = post;
      this.dispatchEvent({type: 'selectpin', payload: geoCoordinateToEuler([post.acf.latitude, post.acf.longitude])});
      // this.runPathfinding();
    } else if (camDirection.dot(pinDirection) < 0.99) {
      this.dispatchEvent({type: 'selectpin', payload: geoCoordinateToEuler([post.acf.latitude, post.acf.longitude])});
    }
  }
  finishSailing() {
    if (this._pin) {
      if (this._pin.props != null) {
        store.dispatch({type: "PUSH_ROUTE", payload: this._pin.props.item.title.rendered.toLowerCase().split(' ').join('-')});
      } else {
        store.dispatch({type: "PUSH_ROUTE", payload: this._pin.title.rendered.toLowerCase().split(' ').join('-')});
      }

      // this.dispatchEvent({type: 'openreport', payload: this._pin});
    }
  }
  unselectPin() {
    this._pin = null;
    this.dispatchEvent({type: 'unselectpin'});
  }
  moveCamera() {
    const cameraWorldPosition = new THREE.Vector3();
    cameraWorldPosition.setFromMatrixPosition(this._camera.children[0].matrixWorld);
    if (cameraWorldPosition.x != this._prevCameraWorldPosition.x || cameraWorldPosition.y != this._prevCameraWorldPosition.y || cameraWorldPosition.z != this._prevCameraWorldPosition.z) {
      this.dispatchEvent({type: 'movecamera', payload: cameraWorldPosition});
      this._prevCameraWorldPosition = cameraWorldPosition;
    }
  }
}

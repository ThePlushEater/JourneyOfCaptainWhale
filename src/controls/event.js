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
  }
  selectPin(pin) {
    const camDirection = new THREE.Vector3(0, 0, 1);
    camDirection.applyEuler(this._camera.rotation);
    const pinDirection = new THREE.Vector3(0, 0, 1);
    pinDirection.applyEuler(geoCoordinateToEuler(pin.props.coordinate));

    if (this._pin !== pin) {
      this._pin = pin;
      this.dispatchEvent({type: 'selectpin', payload: geoCoordinateToEuler(pin.props.coordinate)});
      this.runPathfinding();
    } else if (camDirection.dot(pinDirection) < 0.99) {
      this.dispatchEvent({type: 'selectpin', payload: geoCoordinateToEuler(pin.props.coordinate)});
    }
  }
  unselectPin() {
    this._pin = null;
    this.dispatchEvent({type: 'unselectpin'});
  }
  runPathfinding() {
    const {vertices, edges} = store.getState().graph;
    // const vertex = vertices[1];
    // console.log(getNeightbors(vertex, vertices, edges));
  }
}

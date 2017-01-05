import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Module from 'react-three-renderer/lib/Module';

export default class MouseInput extends Module {
  constructor() {
    super();
    this._isReady = false;
    this._maxAxisSampling = 3;
    this._curAxisSampling = 0;
    this._leftMouseDown =  false;
    this._active = true;
  }
  isReady() {
    return this._isReady;
  }
  ready(scene, container, camera) {
    this._isReady = true;

    this._scene = scene;
    this._container = container;
    this._camera = camera.refs.cameraRoot.children[0];

    this._raycaster = new THREE.Raycaster();

    this._curMouse = new THREE.Vector2();
    this._prevMouse = new THREE.Vector2();


    this._onMouseMove = (event) => {
      this._curMouse.set(event.clientX, event.clientY);
    };
    this._onTouchMove = (event) => {
      this._curMouse.set(event.touches[0].clientX, event.touches[0].clientY);
    };
    container.addEventListener('mousemove', this._onMouseMove, false);
    container.addEventListener('touchmove', this._onTouchMove, false);

    this._onMouseDown = (event) => {
      this._leftMouseDown =  true;
    };
    this._onTouchDown = (event) => {
      this._leftMouseDown =  true;
      this._curMouse.set(event.touches[0].clientX, event.touches[0].clientY);
      this._prevMouse.set(event.touches[0].clientX, event.touches[0].clientY);
    };
    container.addEventListener('mousedown', this._onMouseDown, true);
    container.addEventListener('touchstart', this._onTouchDown, true);

    this._onMouseUp = (event) => {
      this._leftMouseDown =  false;
    };
    this._onTouchUp = (event) => {
      this._leftMouseDown =  false;
    };
    container.addEventListener('mouseup', this._onMouseUp, true);
    container.addEventListener('touchend', this._onTouchUp, true);
  }
  getAxis(type) {
    if (this._active == false) {
      return null;
    }
    switch(type) {
      case "Mouse X": {
        return this._curMouse.x - this._prevMouse.x;
      }
      case "Mouse Y": {
        return this._curMouse.y - this._prevMouse.y;
      }
    }
    return null;
  }
  getMouseButton(index) {
    if (this._active == false) {
      return null;
    }
    switch(index) {
      case 0: {
        return this._leftMouseDown;
      }
    }
    return null;
  }
  getCameraRay() {
    const relativeMouseCoords = new THREE.Vector2();
    relativeMouseCoords.x = ( this._curMouse.x / this._container.clientWidth ) * 2 - 1;
    relativeMouseCoords.y = - ( this._curMouse.y / this._container.clientHeight ) * 2 + 1;

    const originalRay = this._raycaster.ray.clone();
    this._raycaster.setFromCamera(relativeMouseCoords, this._camera);
    const resultRay = this._raycaster.ray.clone();
    this._raycaster.ray.copy(originalRay);

    return resultRay;
  }
  getIntersections(parent) {
    const relativeMouseCoords = new THREE.Vector2();
    relativeMouseCoords.x = ( this._curMouse.x / this._container.clientWidth ) * 2 - 1;
    relativeMouseCoords.y = - ( this._curMouse.y / this._container.clientHeight ) * 2 + 1;

    this._raycaster.setFromCamera(relativeMouseCoords, this._camera);
    if (parent != null) {
      return this._raycaster.intersectObject(parent, true);
    } else {
      return this._raycaster.intersectObject(this._scene, true);
    }
  }

  update() {
    if (this._isReady) {
      if (this._curAxisSampling == this._maxAxisSampling) {
        this._prevMouse.copy(this._curMouse);
        this._curAxisSampling = 0;
      } else {
        this._curAxisSampling++;
      }
    }
  }
}

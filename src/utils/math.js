import * as THREE from 'three';


export function geoCoordinateToEuler(coordinate) {
  return new THREE.Euler(-coordinate[0] * Math.PI / 180, coordinate[1] * Math.PI / 180, 0, "YXZ");
}

export function geoEulerToCoordinate(euler) {
  return [-euler.x * 180 / Math.PI, euler.y * 180 / Math.PI];
}

import * as THREE from 'three';


export function geoCoordinateToEuler(coordinate) {
  return new THREE.Euler(-coordinate[0] * Math.PI / 180, coordinate[1] * Math.PI / 180, 0, "YXZ");
}

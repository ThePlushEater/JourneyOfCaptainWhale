import Immutable from 'seamless-immutable';
import store from "./../store";
import * as THREE from 'three';

const defaultState = {
  fetching: false,
  fetched: false,
  error: null,
  deltaTime: 0,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case "SET_DELTA_TIME": {
      return { ...state, deltaTime: action.payload };
    }
  }
  return state;
};

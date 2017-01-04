import Immutable from 'seamless-immutable';
import store from "./../store";
import * as THREE from 'three';

const defaultState = {
  fetching: false,
  fetched: false,
  error: null,
  manager: null,
  mouseInput: null,
  eventControl: null,
  loaded: false,
  resources: [],
  font: null,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case "SET_3D_FONT": {
      return { ...state, font: action.payload };
    }
    case "SET_RESOURCE_LOAD_MANAGER": {
      return { ...state, manager: action.payload };
    }
    case "SET_MOUSE_INPUT_MANAGER": {
      return { ...state, mouseInput: action.payload };
    }
    case "SET_EVENT_CONTROL": {
      return { ...state, eventControl: action.payload };
    }
    case "FETCH_RESOURCES_PENDING": {
      return { ...state, fetching: true };
    }
    case "FETCH_RESOURCES_REJECTED": {
      return { ...state, fetching: false, error: action.payload};
    }
    case "FETCH_RESOURCES_FULFILLED": {
      return { ...state, fetching: false, fetched: true, loaded: true};
    }
  }
  return state;
};

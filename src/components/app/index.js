import React from "react";
import ReactDom from "react-dom";
import store from "./../../store";
import { connect } from "react-redux";
import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Planet from './../planet';
import Ship from './../ship';
import Camera from './../camera';
import Pins from './../pins';
import Nodes from './../nodes';

import MouseInput from './../../inputs/mouse';
import EventControl from './../../controls/event';
import Stats from 'stats-js';

require('./app.scss');

@connect((store) => {
  return {
    localization: store.localization,
    resource: store.resource,
  }
})
export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.time = new THREE.Clock();

    this.state = {

    };

    this._stats = new Stats();
    this._stats.setMode(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this._stats.domElement);

    this._onAnimate = () => {
      this._stats.begin();

      const {resource} = this.props;
      const {mouseInput, camera} = this.refs;
      if (!mouseInput.isReady()) {
        const {
          scene,
          container,
        } = this.refs;

        mouseInput.ready(scene, container, camera);
        this.props.dispatch({type: "SET_MOUSE_INPUT_MANAGER", payload: mouseInput});
        this.props.dispatch({type: "SET_EVENT_CONTROL", payload: new EventControl(camera)});
      }

      this.setState({
        // deltaTime: this.time.getDelta(),
      });
      this.props.dispatch({type: "SET_DELTA_TIME", payload: this.time.getDelta()});

      this._stats.end();
    };
  }
  componentWillMount() {

  }
  componentDidMount() {
    const manager = new THREE.LoadingManager();
    this.props.dispatch({type: "SET_RESOURCE_LOAD_MANAGER", payload: manager});

    manager.onStart = function(url, itemsLoaded, itemsTotal) {
      this.props.dispatch({type: "FETCH_RESOURCES_PENDING"});
    }.bind(this);
    manager.onLoad = function() {
      this.props.dispatch({type: "FETCH_RESOURCES_FULFILLED"});
    }.bind(this);
    manager.onProgress = function(url, itemsLoaded, itemsTotal) {
      // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    }.bind(this);
    manager.onError = function(url) {
      this.props.dispatch({type: "FETCH_RESOURCES_REJECTED", payload: 'There was an error loading ' + url });
    }.bind(this);

    const planetSeaLoader = new THREE.JSONLoader(manager);
    planetSeaLoader.load('assets/planet_sea.json', function(geometry) {
      this.setState({
        planetSeaGeometry: <geometry
          resourceId="planetSeaGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        planetSeaMaterial: <meshLambertMaterial
          resourceId="planetSeaMaterial"
          color={0x5A98C0}
        />
      });
    }.bind(this));

    const planetLandLoader = new THREE.JSONLoader(manager);
    planetSeaLoader.load('assets/planet_land.json', function(geometry) {
      this.setState({
        planetLandGeometry: <geometry
          resourceId="planetLandGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        planetLandMaterial: <meshLambertMaterial
          resourceId="planetLandMaterial"
          color={0x6BDB83}
        />
      });
    }.bind(this));

    const pinLoader = new THREE.JSONLoader(manager);
    pinLoader.load('assets/pin.json', function(geometry) {
      this.setState({
        pinGeometry: <geometry
          resourceId="pinGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        pinMaterial: <meshLambertMaterial
          resourceId="pinMaterial"
          color={0xE76666}
        />
      });
    }.bind(this));

    const shipBottomLoader = new THREE.JSONLoader(manager);
    shipBottomLoader.load('assets/ship_bottom.json', function(geometry) {
      this.setState({
        shipBottomGeometry: <geometry
          resourceId="shipBottomGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        shipBottomMaterial: <meshLambertMaterial
          resourceId="shipBottomMaterial"
          color={0x533929}
        />
      });
    }.bind(this));

    const shipBodyLoader = new THREE.JSONLoader(manager);
    shipBodyLoader.load('assets/ship_body.json', function(geometry) {
      this.setState({
        shipBodyGeometry: <geometry
          resourceId="shipBodyGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        shipBodyMaterial: <meshLambertMaterial
          resourceId="shipBodyMaterial"
          color={0xB17A5A}
        />
      });
    }.bind(this));

    const shipTopLoader = new THREE.JSONLoader(manager);
    shipTopLoader.load('assets/ship_top.json', function(geometry) {
      this.setState({
        shipTopGeometry: <geometry
          resourceId="shipTopGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        shipTopMaterial: <meshLambertMaterial
          resourceId="shipTopMaterial"
          color={0xD85B50}
        />
      });
    }.bind(this));

    const shipDecoLoader = new THREE.JSONLoader(manager);
    shipDecoLoader.load('assets/ship_deco.json', function(geometry) {
      this.setState({
        shipDecoGeometry: <geometry
          resourceId="shipDecoGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        shipDecoMaterial: <meshLambertMaterial
          resourceId="shipDecoMaterial"
          color={0xA38052}
        />
      });
    }.bind(this));

    const shipPoleLoader = new THREE.JSONLoader(manager);
    shipPoleLoader.load('assets/ship_pole.json', function(geometry) {
      this.setState({
        shipPoleGeometry: <geometry
          resourceId="shipPoleGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        shipPoleMaterial: <meshLambertMaterial
          resourceId="shipPoleMaterial"
          color={0xFCDDC9}
        />
      });
    }.bind(this));


    const fontLoader = new THREE.FontLoader(manager);
    fontLoader.load("assets/helvetiker_regular.typeface.json",function(font){
      this.props.dispatch({type: "SET_3D_FONT", payload: font});
    }.bind(this));


  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {

  }
  render() {
    const {localization} = this.props.localization;
    const {resource} = this.props;
    const {deltaTime} = store.getState().time;

    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    const loader = <div className="loader">
      <div>
        Loading...
      </div>
    </div>;

    if (resource.loaded) {
      return(
        <div ref="container" className="app loaded">
          {loader}
          <React3
            mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
            width={width}
            height={height}
            alpha={true}
            clearAlpha={0}
            antialias={true}
            onAnimate={this._onAnimate}>
            <resources>
              {this.state.planetSeaGeometry}
              {this.state.planetSeaMaterial}
              {this.state.planetLandGeometry}
              {this.state.planetLandMaterial}
              {this.state.pinGeometry}
              {this.state.pinMaterial}
              {this.state.shipBottomGeometry}
              {this.state.shipBottomMaterial}
              {this.state.shipBodyGeometry}
              {this.state.shipBodyMaterial}
              {this.state.shipTopGeometry}
              {this.state.shipTopMaterial}
              {this.state.shipDecoGeometry}
              {this.state.shipDecoMaterial}
              {this.state.shipPoleGeometry}
              {this.state.shipPoleMaterial}
              <boxGeometry
                width={0.05}
                height={0.05}
                depth={0.05}
                resourceId="nodeGeometry"
              />
              <meshLambertMaterial
                resourceId="nodeMaterial"
                color={0xFFE75D}
              />
            </resources>
            <module
              ref="mouseInput"
              descriptor={MouseInput}
            />
            <scene ref="scene">
              <Camera ref="camera" aspect={width / height} />
              <Pins />
              <Nodes />
              <ambientLight
                intensity={0.25}
              />
              <Planet />
              <Ship />
            </scene>
          </React3>
          {this.props.children}
        </div>
      );
    }
    return <div className="app loading">
      {loader}
    </div>;
  }
}

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
import Signs from './../signs';
import Whales from './../whales';

import MouseInput from './../../inputs/mouse';
import EventControl from './../../controls/event';
import Stats from 'stats-js';

import { Textfit } from 'react-textfit';

import {fetchPosts} from './../../actions/postActions';
import Posts from './../posts';
import Info from './../info';
import Report from './../report';

require('./app.scss');

@connect((store) => {
  return {
    localization: store.localization,
    resource: store.resource,
    post: store.post,
  }
})
export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.time = new THREE.Clock();

    this.state = {

    };

    if (process.env.NODE_ENV !== "production") {
      this._stats = new Stats();
      this._stats.setMode(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this._stats.domElement);
    }


    this._onAnimate = () => {
      if (process.env.NODE_ENV !== "production") {
        this._stats.begin();
      }

      const {resource} = this.props;
      const {mouseInput, camera} = this.refs;
      if (!mouseInput.isReady()) {
        const {scene, container, ship} = this.refs;

        mouseInput.ready(scene, container, camera, ship);
        this.props.dispatch({type: "SET_MOUSE_INPUT_MANAGER", payload: mouseInput});
        this.props.dispatch({type: "SET_EVENT_CONTROL", payload: new EventControl(camera)});
      }

      this.setState({
        // deltaTime: this.time.getDelta(),
      });
      this.props.dispatch({type: "SET_DELTA_TIME", payload: this.time.getDelta()});

      if (process.env.NODE_ENV !== "production") {
        this._stats.end();
      }
    };
    this.startTime = new Date().valueOf();
  }
  componentWillMount() {

  }
  componentDidMount() {
    window.addEventListener('focus', function() {
      this.time.start();
    }.bind(this));
    window.addEventListener('blur', function() {
      this.time.stop();
    }.bind(this));

    this.props.dispatch({type: "SET_ROUTER", payload: this.props.router});
    this.props.dispatch({type: "PUSH_ROUTE", payload: this.props.location.pathname});

    this.props.dispatch(fetchPosts());
    const manager = new THREE.LoadingManager();
    this.props.dispatch({type: "SET_RESOURCE_LOAD_MANAGER", payload: manager});

    manager.onStart = function(url, itemsLoaded, itemsTotal) {
      this.props.dispatch({type: "FETCH_RESOURCES_PENDING"});
    }.bind(this);
    manager.onLoad = function() {
      const endTime = new Date().valueOf();
      setTimeout(function() {
        this.props.dispatch({type: "FETCH_RESOURCES_FULFILLED"});
      }.bind(this), Math.max(endTime - this.startTime, 2500));
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
          color={0x33587C}
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
          color={0x52A865}
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

    const signLoader = new THREE.JSONLoader(manager);
    signLoader.load('assets/sign.json', function(geometry) {
      this.setState({
        signGeometry: <geometry
          resourceId="signGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
          faceVertexUvs={geometry.faceVertexUvs}
        />,
        signMaterial: <meshLambertMaterial
          resourceId="signMaterial"
          color={0xFFFFFF}
        >
          <texture
            url={'assets/sign.png'} />
        </meshLambertMaterial>
      });
    }.bind(this));

    const whaleLoader = new THREE.JSONLoader(manager);
    whaleLoader.load('assets/whale.json', function(geometry) {
      this.setState({
        whaleGeometry: <geometry
          resourceId="whaleGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        whaleMaterial: <meshLambertMaterial
          resourceId="whaleMaterial"
          color={0xFFD25B}
        />
      });
    }.bind(this));

    const arrowLoader = new THREE.JSONLoader(manager);
    arrowLoader.load('assets/arrow.json', function(geometry) {
      this.setState({
        arrowGeometry: <geometry
          resourceId="arrowGeometry"
          vertices={geometry.vertices}
          faces={geometry.faces}
        />,
        arrowMaterial: <meshLambertMaterial
          resourceId="arrowMaterial"
          color={0xE76666}
        />
      });
    }.bind(this));


    const fontLoader = new THREE.FontLoader(manager);
    fontLoader.load("assets/droid_sans_bold.typeface.json",function(font){
      this.props.dispatch({type: "SET_3D_FONT", payload: font});
    }.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    // if (this.props.location.pathname.replace("/", "") != nextProps.location.pathname.replace("/", "")) {
    //   nextProps.dispatch({type: "PUSH_ROUTE", payload: this.props.location.pathname.replace("/", "")});
    // }
  }
  componentWillUnmount() {

  }
  render() {
    const update = Math.random();
    const {localization} = this.props.localization;
    const {resource} = this.props;
    const {deltaTime} = store.getState().time;
    const {sailing} = store.getState().graph;
    const {selectedPost} = this.props.post;

    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    const loader = <div className="loader">
      <div className="container">
        <img className="image" src="./loading.png" />
        <div className="text">
          Loading the world...
        </div>
      </div>
    </div>;

    let processing;
    if (sailing) {
      processing = <div className="processing">
        <div className="wrapper">
          Sailing...
        </div>
      </div>;
    }

    let report;
    if (selectedPost) {
      report = <Report post={selectedPost} />;
    }


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
            pixelRatio={window.devicePixelRatio}
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
              {this.state.signGeometry}
              {this.state.signMaterial}
              {this.state.whaleGeometry}
              {this.state.whaleMaterial}
              {this.state.arrowGeometry}
              {this.state.arrowMaterial}
              <meshPhongMaterial
                resourceId="pinTextMaterial"
                emissive={0xf0f8ff}
                color={0xf0f8ff}
              />
              <meshLambertMaterial
                resourceId="nodeMaterial"
                color={0xFFD25B}
              />
              <lineDashedMaterial
                resourceId="shipPathMaterial"
                color={0xf0f8ff}
                scale={1}
                linewidth={2}
              />
            </resources>
            <module
              ref="mouseInput"
              descriptor={MouseInput}
            />
            <scene ref="scene">
              <Camera ref="camera" aspect={width / height} />
              <ambientLight
                intensity={0.25}
              />
              <Pins />
              <Signs />
              <Planet />
              <Ship ref="ship" />
              <Whales />
            </scene>
          </React3>

          <div className="ui-container">
            <div className="title">
              <img src="./title.png" />
            </div>
            <div className="content">
              <Info update={update} />
              <Posts update={update} />
            </div>
          </div>
          {report}
          {processing}
          <div className="copyright">
            © 2017 CaptainWhale.
          </div>
        </div>
      );
    }
    return <div className="app loading">
      {loader}
      <div className="copyright">
        © 2017 CaptainWhale.
      </div>
    </div>;
  }
}

import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Node from './node';

export default class Nodes extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {

  }
  render() {
    const nodes = store.getState().graph.vertices.map((item, index) => {
      return <Node key={"node-" + index} index={index} coordinate={item.coordinate} />;
    });

    return(
      <group>
        {nodes}
      </group>
    );
  }
}

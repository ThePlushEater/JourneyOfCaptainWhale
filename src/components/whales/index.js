import React from "react";
import store from "./../../store";
// import ReactDom from "react-dom";
// import { connect } from "react-redux";
// import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Whale from './whale';

export default class Whales extends React.Component {
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
    return(
      <group>
        <Whale index={19} />
        <Whale index={5} />
        <Whale index={8} />
        <Whale index={15} />
        <Whale index={23} />
        <Whale index={28} />
        <Whale index={35} />
        <Whale index={39} />
        <Whale index={41} />
        <Whale index={44} />
      </group>
    );
  }
}

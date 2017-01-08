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
        <Whale index={3} />
        <Whale index={28} />
        <Whale index={44} />
        <Whale index={13} />
        <Whale index={23} />
        <Whale index={22} />
        <Whale index={40} />
      </group>
    );
  }
}

import React from "react";
import store from "./../../store";
import ReactDom from "react-dom";
import { connect } from "react-redux";

require('./home.scss');

@connect((store) => {
  return {
    localization: store.localization,
  }
})
export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }
  handleAssetsLoaded() {
    this.setState({

    });
  }
  componentWillMount() {

  }
  _onMouseEnter(event) {
    const {mouseInput} = store.getState().resource;
    if (mouseInput) {
      mouseInput._active = false;
    }
  }
  _onMouseLeave(event) {
    const {mouseInput} = store.getState().resource;
    if (mouseInput) {
      mouseInput._active = true;
    }
  }
  componentDidMount() {
    const {container} = this.refs;
    container.addEventListener('mouseenter', this._onMouseEnter, false);
    container.addEventListener('touchenter', this._onMouseEnter, false);
    container.addEventListener('mouseleave', this._onMouseLeave, false);
    container.addEventListener('touchleave', this._onMouseLeave, false);
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {

  }
  render() {
    const { localization } = this.props.localization;
    return(
      <div ref="container" className="home">
        HOME
      </div>
    );
  }
}

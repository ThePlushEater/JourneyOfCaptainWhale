import React from "react";
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
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {

  }
  render() {
    const { localization } = this.props.localization;
    return(
      <div className="home">
        HOME
      </div>
    );
  }
}

import React, { Component } from 'react';
import $ from 'jquery';
import { Row, Col, Autocomplete } from 'react-materialize';
import VesselContainer from './VesselContainer';
import VesselMap from './VesselMap';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      searchValue: '',
      searchSuggestions: [],
      selectedVessel: '',
      selectedVesselCoordinates: {lat: 47.540384, lng: -122.042061},
      mapZoom: 8,
      errorCondition: false,
      launchCondition: true,
    }

    this.changeSearchValue = this.changeSearchValue.bind(this);
    this.changeSearchSuggestions = this.changeSearchSuggestions.bind(this);
    this.changeSelectedVessel = this.changeSelectedVessel.bind(this);
    this.getSelectedVesselCoordinates = this.getSelectedVesselCoordinates.bind(this);
    this.toggleErrorCondition = this.toggleErrorCondition.bind(this);
    this.toggleLaunchCondition = this.toggleLaunchCondition.bind(this);
  }

  changeSearchValue(value){
    if(value) {
      this.setState({searchValue: value});
    }
  }

  changeSearchSuggestions(suggestions) {
    if(suggestions){
      this.setState({searchSuggestions: suggestions});
    }
  }

  changeSelectedVessel(vessel){
    if(this.state.errorCondition) {
      this.toggleErrorCondition();
    }

    if(vessel) {
      this.setState({ selectedVessel: vessel });
    }
  }

  getSelectedVesselCoordinates(mmsi){
    let self = this;

    // call Meteor method on the server (like REST or RPC call)
    Meteor.call('getLocationFromMMSI',
      mmsi,
      (err, res) => {
        if(err) {
          self.toggleErrorCondition();
          return;
        }

        if(this.state.launchCondition) {
          this.toggleLaunchCondition();
        }

        if (typeof res !== "undefined") {
          if (res.lat !== '' && res.lng !== '') {
            self.setState({
              selectedVesselCoordinates: {
                lat: parseFloat(res.lat),
                lng: parseFloat(res.lng),
              },
            });
          }
        } else {
          self.toggleErrorCondition()
          return;
        }
      }
    )
  }

  toggleErrorCondition() {
    this.setState({errorCondition: !this.state.errorCondition});
  }

  toggleLaunchCondition() {
    if(this.state.launchCondition) {
      this.setState({launchCondition: !this.state.launchCondition});
    }
  }

  componentWillUpdate(nextProps, nextState){
    // check to see if the selected vessel will change and go get the coordinates
    if (nextState.selectedVessel._id !== this.state.selectedVessel._id){
      // call method to get coordinates
      this.getSelectedVesselCoordinates(nextState.selectedVessel.mmsi);
    }
  }

  render() {
    return (
      <div>
        <div className="vessel-map">
          <VesselMap
            selectedVessel={this.state.selectedVessel}
            selectedVesselCoordinates={this.state.selectedVesselCoordinates}
            mapZoom={this.state.mapZoom}
            launchCondition={this.state.launchCondition}
          />
        </div>
        <Row>
          <Col s={12} l={6} offset={'l3'}>
            <VesselContainer
              searchValue={this.state.searchValue}
              searchSuggestions={this.state.searchSuggestions}
              selectedVessel={this.state.selectedVessel}
              changeSearchValue={this.changeSearchValue}
              changeSearchSuggestions={this.changeSearchSuggestions}
              changeSelectedVessel={this.changeSelectedVessel}
              toggleLaunchCondition={this.toggleLaunchCondition}
            />
          </Col>
        </Row>
        <div className="error-container z-depth-1" style={{display: this.state.errorCondition ? 'block': 'none'}}>
          <div className="error-message center-align">
            <p>An error has occurred locating information for this vessel.</p>
            <p>Please try again or select another vessel.</p>
          </div>
        </div>
        <div className="launch-container z-depth-1" style={{display: this.state.launchCondition ? 'block': 'none'}}>
          <div className="launch-message center-align">
            <p>Welcome!</p>
            <p>Enter a ship name above to find it on the map.</p>
          </div>
        </div>
      </div>
    );
  }
}
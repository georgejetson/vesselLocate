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
    }

    this.changeSearchValue = this.changeSearchValue.bind(this);
    this.changeSearchSuggestions = this.changeSearchSuggestions.bind(this);
    this.changeSelectedVessel = this.changeSelectedVessel.bind(this);
    this.getSelectedVesselCoordinates = this.getSelectedVesselCoordinates.bind(this);
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
          console.log(err.message);
          return;
        }

        if(res.lat !== '' && res.lng !== '') {
          self.setState({selectedVesselCoordinates: {lat: parseFloat(res.lat), lng: parseFloat(res.lng)}});
        }
      }
    )
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
            />
          </Col>
        </Row>
      </div>
    );
  }
}
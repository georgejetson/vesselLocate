import React from 'react';
import { Component } from 'react';
import { Row, Autocomplete } from 'react-materialize';

export default class VesselUI extends Component {
  constructor() {
    super();
    this.renderVessels = this.renderVessels.bind(this);
    this.transformVesselData = this.transformVesselData.bind(this);
    this.handleVesselChange = this.handleVesselChange.bind(this);
  }
  renderVessels () {
    return this.props.searchSuggestions.map((vessel) => (
      <Vessel key={vessel._id} vessel={vessel}/>
    ));
  }
  transformVesselData() {
    let _vesselAutocomplete = {};

    this.props.searchSuggestions.map((vessel) => {
      _vesselAutocomplete[vessel.name] = vessel._id;
    });

    return _vesselAutocomplete;
  }

  handleContentChange = (event, value ) => {
    event.target.value = value.toUpperCase();
  }

  handleVesselChange = (selectedOption) => {
    this.props.changeSelectedVessel(this.props.searchSuggestions.find( vessel => vessel.name === selectedOption ));
  }

  componentDidMount(){
    // Workaround //
    // npm package materialize-css is mistakenly applying the .col class.  Removing it to restore ui functionality
    $('.input-field').removeClass('col').addClass('z-depth-5');
  }

  render () {
    return (
      <Autocomplete
        title='Vessels'
        data={this.transformVesselData()}
        placeholder={'Enter a vessel name'}
        onAutocomplete={this.handleVesselChange}
      />
    )
  }
}
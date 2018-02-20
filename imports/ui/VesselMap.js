import React from 'react';
import { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Icon } from 'react-materialize';

const VesselMarker = ({ text, style }) => (
  <div className="vessel-marker center-text" style={style}>
    <Icon small>directions_boat</Icon>
    <span>{text}</span>
  </div>
);

export default class VesselMap extends Component {
  constructor () {
    super();
  }

  render() {
    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDkujZdxnle7jnBhmMHmn2wm3OoyEAA834' }}
        defaultZoom={this.props.mapZoom}
        center={this.props.selectedVesselCoordinates}
      >
        <VesselMarker
          lat={this.props.selectedVesselCoordinates.lat}
          lng={this.props.selectedVesselCoordinates.lng}
          text={this.props.selectedVessel.name}
          style={{display: this.props.launchCondition ? 'none' : 'block'}}
        />
      </GoogleMapReact>
    )
  }
}
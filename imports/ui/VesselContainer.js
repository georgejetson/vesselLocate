import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Vessels } from '../api/collections/vesselCollection';
import VesselUI  from './Vessels';

export default VesselContainer = withTracker(props => {
 const vesselsCollectionHandle = Meteor.subscribe('vessels.public');
 const loading = !vesselsCollectionHandle.ready();
 let _searchValue = props.searchValue !== '' ? {name: { $regex: new RegExp(props.searchValue, 'i')}} : {};
 const vessels = Vessels.find(_searchValue).fetch();
 const vesselsExist = !loading && !!vessels;

 return {
   loading,
   vesselsExist,
   // vesselList: vesselsExist ? vessels : [],
   searchValue: props.searchValue,
   searchSuggestions: vesselsExist ? vessels : [],
   selectedVessel: props.selectedVessel,
   toggleLaunchCondition: props.toggleLaunchCondition,
 }
})(VesselUI)
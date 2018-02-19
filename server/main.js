import { Meteor } from 'meteor/meteor';
import { Vessels } from '../imports/api/collections/vesselCollection';
import seedVessels from '../imports/data/seedVessels.json';
import '../imports/api/locationData.js';


Meteor.startup(() => {
  // on server setart seed the database with vessel data if not present
  if(seedVessels && Meteor.isServer) {
    if(Vessels.find().count() === 0) {
      seedVessels.forEach((vessel) => {
        Vessels.insert({
          type: vessel.Type,
          name: vessel.Name,
          imo: vessel.IMO,
          cs: vessel.CS,
          mmsi: vessel.MMSI,
          length: {
            length: vessel.Length.split('x')[0],
            width: vessel.Length.split('x')[1]
          }
        });
      })
    }
  }
});

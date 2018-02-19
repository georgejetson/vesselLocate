import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';

const getLocationServiceURI = (mmsi) => {
  return 'https://api.aprs.fi/api/get?name=' + mmsi + '&what=loc&apikey=109676.BrVSr9i6TpbMbBe&format=json'
}

if(Meteor.isServer) {
  Meteor.methods({
    getLocationFromMMSI: function (mmsi) {
      check(mmsi, Number);
      this.unblock();

      try {
        const locationServiceRes = HTTP.call('GET', getLocationServiceURI(mmsi), {});
        return locationServiceRes.data.entries[0];
      }
      catch (error) {
        throw new Meteor.Error('vessel-not-found', "Not able to find vessel data");
      }
    }
  });
}
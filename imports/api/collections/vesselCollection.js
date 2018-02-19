import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Vessels = new Mongo.Collection('vessels');

if(Meteor.isServer) {
  Meteor.publish('vessels.public', function(){
    return Vessels.find();
  });
}
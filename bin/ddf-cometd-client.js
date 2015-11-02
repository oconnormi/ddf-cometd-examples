#!/usr/bin/env node
/*
use strict
*/
var fs   = require('fs'),
    faye = require('faye'),
    uuid = require('node-uuid');

var endpoint = 'http://localhost:8181/cometd';
var notificationSubscription = '/ddf/notifications/**';
var queryChannel = '/service/query';
var activitiesSubscription = '/ddf/activities/**';
// var activitiesSubscription = '/ddf/activities/**';
var guid = uuid.v4();
var guidChannel = '/' + guid;

console.info('Starting faye client at: ' + endpoint)
var client = new faye.Client(endpoint);
client.disable('websocket');

client.on('transport:down', function() {
  console.error('Cometd Connection failure');
});

client.on('transport:up', function() {
  console.info('Cometd connection active');
});

console.info('Subscribing to notifications: ' + notificationSubscription);
client.subscribe(notificationSubscription, function(message) {
  console.info('Recieved notification from: ' + this.channel);
  console.info('Contents: ' + JSON.stringify(message));
});

console.info('Subscribing to query response: ' + guidChannel);
client.subscribe(guidChannel, function(message) {
  console.info('Query response: ' + JSON.stringify(message));
});

queryMessage = {
                  "id":guid,
                  "cql":"anyText LIKE '*'"
                };

console.info('Subscribing to activities: ' + activitiesSubscription);
client.subscribe(activitiesSubscription, function(message) {
  console.info('Activity observed: ' + JSON.stringify(message));
});

console.info('Publishing query: ' + JSON.stringify(queryMessage));
setTimeout(function() { client.publish(queryChannel, queryMessage) }, 500);

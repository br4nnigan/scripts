#!/usr/bin/env nodejs
var server = require("./credentials.json");

var TeamSpeakClient = require("node-teamspeak"),
	util = require("util");

var isReachable = require('is-reachable');
var isPortReachable = require('is-port-reachable');
var serverReachable = (async () => {
	await isReachable(server.address);
})();
var serverPortReachable = (async () => {
	await isPortReachable(10011, {host: server.address});
})();

var cl = new TeamSpeakClient(server.address);
var dialog = require('dialog');

if ( !serverReachable ) {
	dialog.info( "Server not reachable", server.address + " - error", process.exit);
} else if ( !serverPortReachable ) {
	dialog.info( "Server port not reachable", server.address + " - error", process.exit);
} else {
	console.log("sending..");
	try {
		cl.send("login", {client_login_name: server.login, client_login_password: server.password}, onServerResponse);
	} catch (e) {
		dialog.info( "send login failed", e, process.exit);
	}

}


function onServerResponse(err, response, rawResponse){
console.log("login", err);

	if ( err && err.msg ) {
		return dialog.info( err.msg + "\n\n" + err.extra_msg, server.address + " - error", process.exit);
	}

	cl.send("use", {sid: 1}, function(err, response, rawResponse){
// console.log("use", err);
		cl.send("clientlist", ["groups", "away"], function(err, response, rawResponse){
// console.log("clientlist", err, response);
			if ( !response ) {
				return dialog.info( "no response on clientlist", server.address + " - error", process.exit);
			}
			var list = getFormattedList( response );
// console.log("list:",list);
			if ( Object.keys(list).length )
				getChannelNames( list, cl, onQueriesFinished );
			else
				onQueriesFinished( list );
		});

	});
}


function onQueriesFinished ( list, channelnames ) {

// console.log("onQueriesFinished", list);
	var listWithNames = {};
	for (channel in list) {

		if (list.hasOwnProperty(channel)) {

			var channelname = channelnames[ channel ];

			listWithNames[ channelname ] = list[ channel ];
		}
	}
	// prettyPrintList(listWithNames);
	dialog.info( getPrettyString(listWithNames), server.address, function () {
		process.exit();
	});
}

function getPrettyString ( listWithNames ) {

	var str = "";

	for (channel in listWithNames) {

		if (listWithNames.hasOwnProperty(channel)) {

			str += "\n"+channel+"";
			for (var i = 0, user; i < listWithNames[channel].length; i++) {
				user = listWithNames[channel][i];

				str += "\n  " + user;
			}
			str += "\n";
		}
	}
	return str || "keiner da!";
}

function prettyPrintList ( listWithNames ) {

	for (channel in listWithNames) {

		if (listWithNames.hasOwnProperty(channel)) {

			console.log(  "["+channel+"]" );

			for (var i = 0, user; i < listWithNames[channel].length; i++) {
				user = listWithNames[channel][i];

				console.log( "  " + user);
			}
		}
	}
}

function getChannelNames ( list, cl, cb ) {
	// console.log("getChannelNames", list);
	var channelnames = {};
	var waiting = 0;

	for (channel in list) {

		if (list.hasOwnProperty(channel)) {

			if ( !(channel in channelnames) ) {

				(function (channel) {

					waiting++;
					//console.log("send "+channel);

					cl.send("channelinfo", {cid: channel}, function(err, response, rawResponse){
						if ( err ) console.log("channelinfo ", err);
						channelnames[ channel ] = response[ "channel_name" ];
						waiting--;
						if ( waiting === 0 ){

							cb( list, channelnames );
						}
					});

				})(channel);
			}
		}
	}
}



function getFormattedList ( response ) {
	var channels = {};
	for (var i = 0; i < response.length; i++) {

		if ( response[i]["client_type"] === 0 ) {

			var channel = response[i]["client_channel_group_inherited_channel_id"];

			if ( !(channel in channels) ){
				channels[ channel ] = [];
			}
			channels[ channel ].push( response[i]["client_nickname"] + ((response[i]["client_away"] ? " (away)" : "")));
		}
	}
	return channels;
}

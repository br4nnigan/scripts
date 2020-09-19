var TeamSpeakClient = require("node-teamspeak"),
	util = require("util");

var serverAddress = "ch33ks.org";
var cl = new TeamSpeakClient(serverAddress);
var dialog = require('dialog');
 


cl.send("login", {client_login_name: "sqtest", client_login_password: "96U0wSyq"}, function(err, response, rawResponse){

	cl.send("use", {sid: 1}, function(err, response, rawResponse){

		cl.send("servernotifyregister ", {event: "server"}, function(err, response, rawResponse){

			if ( response ){

				console.log("server event\n");
				try{
					var r = JSON.stringify( response, null, 2 )
					dialog.info( r );

				} catch (e){

					console.log(util.inspect(response));
				}
			} else {
				console.log("empty: ", rawResponse);
			}
		});

		cl.send("servernotifyregister ", {event: "channel"}, function(err, response, rawResponse){

			if ( response ){

				console.log("channel event\n");
				try{
					var r = JSON.stringify( response, null, 2 )
					dialog.info( r );

				} catch (e){

					console.log(util.inspect(response));
				}
			} else {
				console.log("empty: ", rawResponse);
			}
		});
		
	});
});

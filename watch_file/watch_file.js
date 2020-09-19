/* globals process */

var fs = require("fs");
var lastLine = require('last-line');

var file = process.argv[2];

process.stdout.write("Watching last line of " + file + " ...\n");

fs.watch(process.argv[2], { encoding: 'utf-8' }, (eventType) => {
	if (eventType == "change") {

		lastLine(process.argv[2], function (err, res) {
			if ( !err && res ) {
				process.stdout.write(res + "\n");
			}
		});
	}
});

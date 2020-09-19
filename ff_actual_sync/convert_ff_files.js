#!/usr/bin/env nodejs
"use strict"
const fs = require("fs");

const pathProfileWindows = "D:\\AppData\\Waterfox\\q4805j1x.shared";
const pathProfileLinux = "/mnt/0795E2813560F3AD/AppData/Waterfox/q4805j1x.shared";

const pathBrowserWindows = "D:\\Waterfox\\browser";
const pathBrowserLinux = "/usr/lib/waterfox/browser";

const os = process.platform;

let pathProfile = "";

switch ( os ) {
	case "win32": pathProfile = pathProfileWindows; break;
	case "linux": pathProfile = pathProfileLinux;
}

if ( pathProfile ) {

	fs.readFile(pathProfile + "/extensions.json", (err, data) => {
		if (err) throw err;
		console.log('The file has been read!');

		if ( data ) {
			let extensions = JSON.parse(data);

			for (var i = 0; i < extensions.addons.length; i++) {

				var addon = extensions.addons[i];

				addon.syncGUID = null;

				if ( addon.id == "ubufox@ubuntu.com" && os != "linux" ) {

					addon.userDisabled = true;
					addon.active = false;
				} else {
					addon.active = true;
					addon.seen = true;
					addon.userDisabled = false;

					if ( addon.path ) {
						addon.path = convertPath(addon.path, os);
					}
				}

			}

			data = JSON.stringify(extensions);

			fs.writeFile(pathProfile + "/extensions.json", data, function (err) {
				if (err) throw err;
				console.log('The file has been saved!');
			});
		}
	});
}

function convertPath( path, os ) {

	let pathConverted = path;

	switch ( os ) {
	case "win32":
		pathConverted = pathConverted.replace(pathBrowserLinux, pathBrowserWindows);
		pathConverted = pathConverted.replace(pathProfileLinux, pathProfileWindows);
		pathConverted = pathConverted.replace(/\//g, "\\");
		break;
	case "linux":
		pathConverted = pathConverted.replace(pathBrowserWindows, pathBrowserLinux);
		pathConverted = pathConverted.replace(pathProfileWindows, pathProfileLinux);
		pathConverted = pathConverted.replace(/\\/g, "/");
	}
	if ( path != pathConverted ) {
		console.log("convertPath " + path + " to " + pathConverted);
	} else {
		console.log(path + " not converted for os " + os );
	}

	return pathConverted;
}
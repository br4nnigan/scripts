/* globals process */

var fs = require("fs");
var format = require("dateformat");

var whitelist = [".jpg", ".mp4", ".mov", ".avi"];
var blacklist = [];
var formatStr = "dddd, d.mmmm yyyy";
var formatRE = /\w+, \d{1,2}\.[a-zA-Zäöü]+ \d{4}/;

format.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
	]
};

console.log("reading "+ process.cwd(), process.argv);

var reset = process.argv.length > 2 && process.argv[2] == "-reset" ? true : false;

fs.readdir( process.cwd(), function (err, list) {

	for (var i = 0, j, filename, filepath, file, date, newname, hasNiceName, extention, stats, copy; i < list.length; i++) {

		filename = list[i];
		extention = filename.substr(filename.lastIndexOf("."));
		filepath = process.cwd()+"/"+filename;
		file = fs.openSync(filepath, 0);
		stats = fs.fstatSync(file);
		hasNiceName = formatRE.test(filename);

		if ( whitelist.length && whitelist.indexOf(extention.toLowerCase()) == -1 || blacklist.indexOf(extention.toLowerCase()) != -1 ) continue;

		if ( stats.isFile() && (!hasNiceName || reset) ){

			date = new Date(stats.mtime);
			newname = reset ? "file" : format(date, formatStr);

			j = 0;
			copy = "";
			while ( fs.existsSync(process.cwd()+"/"+newname+copy+extention) ){
				j++;
				copy = " ("+j+")";
			}
			fs.renameSync( filepath, process.cwd()+"/"+newname+copy+extention );

			console.log( "renamed "+ filename + " -> " + newname+copy+extention );
		}
	}
});
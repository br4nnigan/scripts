/* globals process */

var fs = require("file-system");
// var format = require("dateformat");


console.log("reading "+ process.cwd(), process.argv);

// var reset = process.argv.length > 2 && process.argv[2] == "-reset" ? true : false;


if (!fs.existsSync("./filtered")){
	fs.mkdirSync("./filtered");
}

var games = {};

fs.recurseSync(process.cwd(), function(filepath, relative, filename) {

	if ( !filename ) return;

	var lang, matches, gameversion, romversion;

// fs.readdir( process.cwd(), function (err, list) {



// 	var games = {};

// 	for (var i = 0, matches, lang, gameversion, romversion, gamename, filename; i < list.length; i++) {

// 		filename = list[i];
// console.log(filename);
	var gamename = filename.replace(/\s?\(.*\).*/, '');


	if ( !games[gamename] ) {
		games[gamename] = {};
	}

	lang = 'none';
	matches =  filename.match(/\((\w{1,2})\)/);
	if ( matches ) {
		lang = matches[1];
	}
	if ( !games[gamename][lang] ) {
		games[gamename][lang] = {};
	}

	gameversion = 'none';
	matches =  filename.match(/\((V\S+)\)/);
	if ( matches ) {
		gameversion = matches[1];
	}
	if ( !games[gamename][lang][gameversion] ) {
		games[gamename][lang][gameversion] = {};
	}

	romversion = 'none';
	matches =  filename.match(/\[(\S+)\]/);
	if ( matches ) {
		romversion = matches[1];
	}
	if ( !games[gamename][lang][gameversion][romversion] ) {
		games[gamename][lang][gameversion][romversion] = filename;
	}
	// console.log(gamename, filename);

});

// console.log(JSON.stringify(games, null, 2));


for (var prop in games) {

	var game = games[prop];
	var lang = game["E"] || game["U"] || game["J"] || game["none"] || game[Object.keys(game)[Object.keys(game).length - 1]];
	var gameversion = lang[Object.keys(lang)[Object.keys(lang).length - 1]];
	var romversion = gameversion["!"] || gameversion["none"] || gameversion[Object.keys(gameversion)[Object.keys(gameversion).length - 1]];

	fs.copyFileSync(romversion, 'filtered/'+romversion);
	console.log("copied "+romversion);
}
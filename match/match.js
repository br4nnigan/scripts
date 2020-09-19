if ( process.argv.length > 1 ) {

	var str = process.argv[process.argv.length - 2];
	var re = new RegExp( process.argv[process.argv.length - 1] );

	if ( str && re ) {

		var result = str.match(re);
		if ( result ) {
			process.stdout.write(result[ result.length - 1 ]);
		}
	}

}
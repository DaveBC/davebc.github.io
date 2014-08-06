function hours(time) {
	var patt = new RegExp(":");
	if(patt.test(time)) {
		if(time.match(/:/g).length < 2) {
			return 0;
		}
		else {
			return time.substr(0, time.indexOf(':'));
		}
	}
	else {
		return 0;
	}
}
	
function minutes(time) {
	var patt = new RegExp(":");
	var match = 0;
	if(patt.test(time)) {
		match = time.match(/:/g).length;
	}
	if(match == 1) {
		return time.substr(0, time.indexOf(':'));
	}
	else if(match == 2) {
		return time.substr(time.indexOf(':')+1, time.indexOf(':')+1);
	}
	else {
		return 0;
	}
}
		
function seconds(time) {
	var patt = new RegExp(":");
	var match = 0;
	if(patt.test(time)) {
		match = time.match(/:/g).length;
	}
	if(match == 0) {
		var matchB = 0;
		patt = /\./g;
		if(patt.test(time)) {
			return time.substr(0, time.indexOf('.'));
		}
		else {
			return 0;
		}
	}
	else if(match == 1) {
		patt = new RegExp(".");
		var matchB = 0;
		if(patt.test(time)) {
			matchB = time.match(/./g).length;
		}
		if(matchB == 0) {
			return time.substr(time.indexOf(':')+1, time.length);
		}
		else {
			return time.substr(time.indexOf(':')+1, time.indexOf('.')-2);
		}
	}
	else {
		return time.substr(time.indexOf(':')+1, time.length);
	}
}
		
function milliseconds(time) {
	var patt = new RegExp(":");
	var match = 0;
	if(patt.test(time)) {
		match = time.match(/./g);
	}		
	if(match == 0) {
		return 0;
	}
	else {
		var mil = time.substr(time.indexOf('.')+1,time.length);
		if(mil.length == 1) {
			return mil.concat("00");
		}
		else {
			return mil.concat("0");
		}
	}
}
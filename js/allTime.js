//
//  allTime.js
//  Power Of 10 Progression Chart Generator
//
//  Created by David Banwell-Clode on 01/08/2014.
//  Copyright (c) 2014 David Banwell-Clode. All rights reserved.
//

var AT_RESULTS = [];
var AT_EVENT = '800';
var AT_tableData;
var AT_ATHLETE_NAME;
var SB = false;
var cType = "line";
var AT_Retry = 0;
var AT_PROFILE = 0;
 
// Construct query
var query = "select * from html where url='thepowerof10.info/athletes/profile.aspx?athleteid=78185' limit 1";
 
// Define callback
var callback = function(data) {
	var divNum = 0;
	// No results returned. Retry 3 times and then give up.
	if(data.query.results == null) {
		if(AT_Retry == 3) {
			$('#loader').hide();
			AT_Retry = 0;
			displayErrorAT();
		}
		else {
			AT_Retry++;
			var msg = "";
			msg = msg.concat('ERROR: No results received... Attempting retry (',AT_Retry, ' of 3)');
			console.log(msg);
			generateAllTime();
		}
	}
	else {
		var post;
		try {
			post = data.query.results.body.form.div.table.tr.td.div.div.div[1].div.table.tr.td[0].table[1].tr.td.div;
		}
		catch (e) {
			var errmsg = ""
			errmsg = errmsg.concat("ERROR: Profile with ID ", AT_PROFILE, " not found!");
			$('#errorMessageText').text(errmsg);
			console.log(errmsg);
			console.log(e);
			$('#loader').hide();
			return;
		}
		
		AT_ATHLETE_NAME = data.query.results.body.form.div.table.tr.td.div.div.div[1].div.table.tr.td[0].table[0].tr.td[0].h2;
		var firstName = AT_ATHLETE_NAME.substring(0,AT_ATHLETE_NAME.indexOf(' '));
		var secondName = AT_ATHLETE_NAME.substring(AT_ATHLETE_NAME.indexOf(' '),AT_ATHLETE_NAME.length).toUpperCase();
		AT_ATHLETE_NAME = firstName + secondName;
		
		for(k = 0; k <Object.keys(post).length; k++) {
			if(post[k].id == 'ctl00_cphBody_pnlPerformances') {
				divNum = k;
				post = data.query.results.body.form.div.table.tr.td.div.div.div[1].div.table.tr.td[0].table[1].tr.td.div[k].table[1].tr;
				break;
			}
		}

		var numPerfs = Object.keys(post).length;
		var loopCounter = 0;
		var currentYear = 2014;
		var mostRecentPerf = 1;
		
		for (i = 0; i < numPerfs; i++) { 
			loopCounter++;
			var performance;
			post = data.query.results.body.form.div.table.tr.td.div.div.div[1].div.table.tr.td[0].table[1].tr.td.div[divNum].table[1].tr[i];
			if(post.style == 'background-color:LightGrey;' || post.style == 'background-color:DarkGray;') {
				continue;
			}
			else {
				if(post.td[1].p == 'DQ') {
					continue;
				}
				if(post.td[1].p == 'DNF') {
					continue;
				}
				if(post.td[0].p == AT_EVENT) {
					if(Object.keys(post.td[9])[0] == 'a') {
						var reg = /\-/g;
						var perfDate = post.td[11].p;
						if(reg.test(perfDate)) {
							var string = perfDate;
							perfDate = string.substring(string.indexOf('-')+1,string.length);
						} 
						performance = {
							time:post.td[1].p,
							date:perfDate,
							location:post.td[9].a.content,
						};
					} 
					else {
						var reg = /\-/g;
						var perfDate = post.td[11].p;
						if(reg.test(perfDate)) {
							var string = perfDate;
							perfDate = string.substring(string.indexOf('-')+1,string.length);
						} 
						performance = {
							time:post.td[1].p,
							date:perfDate,
							location:post.td[9].p,
						};
					}
					if(SB) {
						var resDate = new Date(performance.date);
						if(Boolean(mostRecentPerf)) {
							mostRecentPerf = 0;
							currentYear = resDate.getFullYear();
						}
						if(resDate.getFullYear() == currentYear) {
							AT_RESULTS[AT_RESULTS.length] = performance;
							currentYear--;
						}
						else if(resDate.getFullYear() < currentYear) {
							AT_RESULTS[AT_RESULTS.length] = performance;
							currentYear = resDate.getFullYear()-1;
						}	
					}
					else {
						AT_RESULTS[AT_RESULTS.length] = performance;
					}
				}
			}
			if(loopCounter == numPerfs) {
				drawVisualization();
			}
		}
	}
};
 
// Create and populate the data table.
function drawVisualization() {
	// Create new data table.
	AT_tableData = new google.visualization.DataTable();

	// Create columns to contain the date, time and tooltip.
	AT_tableData.addColumn('date', 'Date');
	AT_tableData.addColumn('timeofday', 'Time 2014');
	AT_tableData.addColumn({type:'string', role:'tooltip', 'p': {'html': true}});
		  
	if(AT_RESULTS.length == 0) {
		console.log("No results found.");
		drawVisual();
	}
	
	for(i = 0; i < AT_RESULTS.length; i++) {
		// The following may have been made redundant by doing this check above.
		var reg = /\-/g;
		if(reg.test(AT_RESULTS[i].date)) {
			var string = AT_RESULTS[i].date;
			AT_RESULTS[i].date = string.substring(string.indexOf('-')+1,string.length);
		}  
		// End comment.
		AT_tableData.addRows([
			[new Date(AT_RESULTS[i].date), 
			[parseInt(hours(AT_RESULTS[i].time)),
			parseInt(minutes(AT_RESULTS[i].time)),
			parseInt(seconds(AT_RESULTS[i].time)),
			parseInt(milliseconds(AT_RESULTS[i].time))],
			createCustomHTMLContent(AT_RESULTS[i].date, AT_RESULTS[i].time, AT_RESULTS[i].location)]
		]);
		if (i == AT_RESULTS.length-1) {
			AT_tableData.sort([{column: 0, desc:true}]);
			drawVisual();
		}
	}
};
		
function drawVisual() {
	// Define chart options.
	var options = {
		curveType: cType,
		pointSize: 2,
		vAxis: {gridlines: {count: 20}, format: 'HH:mm:ss.SS'},
		hAxis: {gridlines: {count: -1}},
		legend: {position: 'none'},
		tooltip: {isHtml: true},
		animation : {duration : 5000,
							easing: 'out'},
		title: AT_ATHLETE_NAME + ' - ' + AT_EVENT + 'm Progression (All Time)',
		chartArea: {
			left: 100,
			width: $('#visualization').width()*0.825,
			height: $('#visualization').height()*0.8,
		},
	};
		
	// Create and draw the visualization with the specified data and options.
	new google.visualization.LineChart(document.getElementById('visualization')).draw(AT_tableData, options);
	// Hide the loading icon.
	$('#loader').hide();
	AT_Retry = 0;
}
      
// Generate HTML for tooltip.
function createCustomHTMLContent(date, time, location) {
	return '<div style="padding:5px 5px 5px 5px;">' +
			'<table id="medals_layout">' + '<tr>' +
			'<td><b>' + date + '</b></td>' + '</tr>' + '<tr>' +
			'<td>Time: <b>' + time + '</b></td>' + '</tr>' + '<tr>' +
			'<td>Location: <b>' + location + '</b></td>' + '</tr>' + '</table>' + '</div>';
}
	  
// Parse PowerOf10. YQL is used to get around the same-origin policy.
function YQLQuery(query, callback) {
	this.query = query;
	this.callback = callback || function(){};
	
	this.fetch = function() { 
		if (!this.query || !this.callback) {
			throw new Error('YQLQuery.fetch(): Parameters may be undefined');
		}
	 
		var scriptEl = document.createElement('script'),
			uid = 'yql' + +new Date(),
			encodedQuery = encodeURIComponent(this.query.toLowerCase()),
			instance = this;
	 
		YQLQuery[uid] = function(json) {
			instance.callback(json);
			delete YQLQuery[uid];
			document.head.removeChild(scriptEl);
		};
	 
		scriptEl.src = 'https://query.yahooapis.com/v1/public/yql?q=' + encodedQuery + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=YQLQuery.' + uid;
		console.log(scriptEl.src);
		document.head.appendChild(scriptEl);
	};
};

function displayErrorAT() {
	var plink = "";
	plink = plink.concat('http://thepowerof10.info/athletes/profile.aspx?athleteid=',AT_PROFILE);
	$('#errorLinkA').attr("href",plink);
	$('.errorMessage').css({"visibility":"visible"});
	return;
};
		
	  
function generateAllTime() {
	$('.errorMessage').css({"visibility":"hidden"});
	$('#loader').show();
	$('#visualization').html('<div id="errorMSG" class="errorMessage"><span id="errorMessageText"></span><span id="errorLink"></span></div>');
	AT_RESULTS = [];
	AT_EVENT = $('#eventPicker').val();
	AT_ATHLETE_NAME ='';
	AT_PROFILE = $('#p10ID').val();
	query =  "select * from html where url='www.thepowerof10.info/athletes/profile.aspx?athleteid=" + AT_PROFILE + "' limit 1";
	SB = document.getElementById('SB').checked;
	if(SB) {
		cType = "function";
	}
	else {
		cType = "line";
	}
	var allTimeData = new YQLQuery(query, callback);
	google.setOnLoadCallback(allTimeData.fetch());
};

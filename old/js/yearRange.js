//
//  yearRange.js
//  Power Of 10 Progression Chart Generator
//
//  Created by David Banwell-Clode on 26/07/2014.
//  Copyright (c) 2014 David Banwell-Clode. All rights reserved.
//

var YR_RESULTS = [];
var YR_EVENT = '800';
var START = 2009;
var END = 2016;
var RANGE = 5;
var minTime = [99,99,99,999];
var YR_tableData;
var YR_ATHLETE_NAME;
var YR_PROFILE;
var YR_Retry = 0;

// Construct query
var YR_query = "select * from html where url='thepowerof10.info/athletes/profile.aspx?athleteid=78185' limit 1";
 
// Define callback
var YR_callback = function(data) {
	var divNum = 0;
			
	if(data.query.results == null) {
		if(YR_Retry == 3) {
			$('#loader').hide();
			YR_Retry = 0;
			displayErrorYR();
		}
		else {
			YR_Retry++;
			var msg = "";
			msg = msg.concat('ERROR: No results recieved... Attempting retry (',YR_Retry, ' of 3)');
			$('#errorMessageText').text(msg);
			console.log(msg);
			generateYearRange();
		}
	}
	else {
		var post;
		try {
			post = data.query.results.body.form.div[1].div.table.tbody.tr.td[0].table[1].tbody.tr.td.div;
		}
		catch (e) {
			var errmsg = ""
			errmsg = errmsg.concat("ERROR: Profile with ID ", YR_PROFILE, " not found!");
			$('#errorMessageText').text(errmsg);
			displayErrorYR();
			console.log(errmsg);
			console.log(e);
			$('#loader').hide();
			return;
		}
		
		YR_ATHLETE_NAME = data.query.results.body.form.div[1].div.table.tbody.tr.td[0].table[0].tbody.tr.td[0].h2;
		var firstName = YR_ATHLETE_NAME.substring(0,YR_ATHLETE_NAME.indexOf(' '));
		var secondName = YR_ATHLETE_NAME.substring(YR_ATHLETE_NAME.indexOf(' '),YR_ATHLETE_NAME.length).toUpperCase();
		YR_ATHLETE_NAME = firstName + secondName;
		
		for(k = 0; k <Object.keys(post).length; k++) {
			if(post[k].id == 'cphBody_pnlPerformances') {
				divNum = k;
				post = data.query.results.body.form.div[1].div.table.tbody.tr.td[0].table[1].tbody.tr.td.div[k].table[1].tbody.tr;
				break;
			}
		}
			
		var numPerfs = Object.keys(post).length;
		var loopCounter = 0;
		
		console.log(numPerfs + " performances found.");
			
		for (i = 0; i < numPerfs; i++) { 
			loopCounter++;
			post = data.query.results.body.form.div[1].div.table.tbody.tr.td[0].table[1].tbody.tr.td.div[divNum].table[1].tbody.tr[i];
			if(post.style == 'background-color:LightGrey;' || post.style == 'background-color:DarkGray;') {
				continue;
			}
			else {
				if(post.td[1] == 'DQ') {
					continue;
				}
				if(post.td[1] == 'DNF') {
					continue;
				}
				if(post.td[0] == YR_EVENT) {
					if(Object.keys(post.td[9])[0] == 'a') {
						var performance = {
							time:post.td[1],
							date:post.td[11].content,
							location:post.td[9].a.content,
						};
					} 
					else {
						var performance = {
							time:post.td[1],
							date:post.td[11].content,
							location:post.td[9],
						};
					}
					YR_RESULTS[YR_RESULTS.length] = performance;
				}
			}
			if(loopCounter == numPerfs) {
				YR_drawVisualization();
			}
		}
	}
};
 
// Create and populate the data table.			
function YR_drawVisualization() {
	// Create new data table.
	YR_tableData = new google.visualization.DataTable();

	// Create columns to contain the date, time and tooltip.
	YR_tableData.addColumn('date', 'Date');
	YR_tableData.addColumn('timeofday', END);
	YR_tableData.addColumn({type:'string', role:'tooltip', 'p': {'html': true}});
		  
	for(j = 1; j <= RANGE; j++) {
		YR_tableData.addColumn('timeofday', END-j);
		YR_tableData.addColumn({type:'string', role:'tooltip', 'p': {'html': true}});
	}
        
	for(i = 0; i < YR_RESULTS.length; i++) {
		var resDate = new Date(YR_RESULTS[i].date);
		switch(RANGE) {
			case 0 :	var timeHour = parseInt(hours(YR_RESULTS[i].time));
					var timeMinute = parseInt(minutes(YR_RESULTS[i].time));
					var timeSecond = parseInt(seconds(YR_RESULTS[i].time));
					var timeMilSecond = parseInt(milliseconds(YR_RESULTS[i].time));
					if(resDate.getFullYear()-END == 0) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
								[timeHour,
									timeMinute,
										timeSecond,
											timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location)]
						]);
					}
					if(minTime[0] > timeHour) {
						minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
					}
					else if(minTime[0] < timeHour) {
						break;
					}
					else {
						if(minTime[1] > timeMinute) {
							minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];;
						}
						else if(minTime[1] < timeMinute) {
							break;
						}
						else {
							if(minTime[2] > timeSecond) {
								minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
							}
							else if(minTime[2] < timeSecond) {
								break;
							}
							else {
								if(minTime[3] > timeMilSecond) {
									minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
								}
								else {
									break;
								}
							}
						}
					}
					break;
			case 1 :	var timeHour = parseInt(hours(YR_RESULTS[i].time));
					var timeMinute = parseInt(minutes(YR_RESULTS[i].time));
					var timeSecond = parseInt(seconds(YR_RESULTS[i].time));
					var timeMilSecond = parseInt(milliseconds(YR_RESULTS[i].time));
					if(resDate.getFullYear()-END == 0) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
								[timeHour,
									timeMinute,
										timeSecond,
											timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null]
						]);
					}
					if(resDate.getFullYear()-END == -1) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location)]
						]);
					}
					if(minTime[0] > timeHour) {
						minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
					}
					else if(minTime[0] < timeHour) {
						break;
					}
					else {
						if(minTime[1] > timeMinute) {
							minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];;
						}
						else if(minTime[1] < timeMinute) {
							break;
						}
						else {
							if(minTime[2] > timeSecond) {
								minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
							}
							else if(minTime[2] < timeSecond) {
								break;
							}
							else {
								if(minTime[3] > timeMilSecond) {
									minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
								}
								else {
									break;
								}
							}
						}
					}
					break;
			case 2 : var timeHour = parseInt(hours(YR_RESULTS[i].time));
					var timeMinute = parseInt(minutes(YR_RESULTS[i].time));
					var timeSecond = parseInt(seconds(YR_RESULTS[i].time));
					var timeMilSecond = parseInt(milliseconds(YR_RESULTS[i].time));
					if(resDate.getFullYear()-END == 0) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null]
						]);
					}
					if(resDate.getFullYear()-END == -1) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null]
						]);
					}
					if(resDate.getFullYear()-END == -2) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location)]
						]);
					}
					if(minTime[0] > timeHour) {
						minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
					}
					else if(minTime[0] < timeHour) {
						break;
					}
					else {
						if(minTime[1] > timeMinute) {
								minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];;
						}
						else if(minTime[1] < timeMinute) {
							break;
						}
						else {
							if(minTime[2] > timeSecond) {
								minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
							}
							else if(minTime[2] < timeSecond) {
								break;
							}
							else {
								if(minTime[3] > timeMilSecond) {
									minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
								}
								else {
									break;
								}
							}
						}
					}
					break;
					
			case 3 : var timeHour = parseInt(hours(YR_RESULTS[i].time));
					var timeMinute = parseInt(minutes(YR_RESULTS[i].time));
					var timeSecond = parseInt(seconds(YR_RESULTS[i].time));
					var timeMilSecond = parseInt(milliseconds(YR_RESULTS[i].time));
					if(resDate.getFullYear()-END == 0) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null, null, null]
						]);
					}
					if(resDate.getFullYear()-END == -1) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null]
							]);
						}
					if(resDate.getFullYear()-END == -2) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null,
								[timeHour,
									timeMinute,
										timeSecond,
											timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null]
						]);
					}
					if(resDate.getFullYear()-END == -3) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null, null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location)]
						]);
					}
					if(minTime[0] > timeHour) {
						minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
					}
					else if(minTime[0] < timeHour) {
						break;
					}
					else {
						if(minTime[1] > timeMinute) {
							minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];;
						}
						else if(minTime[1] < timeMinute) {
							break;
						}
						else {
							if(minTime[2] > timeSecond) {
								minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
							}
							else if(minTime[2] < timeSecond) {
								break;
							}
							else {
								if(minTime[3] > timeMilSecond) {
									minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
								}
								else {
									break;
								}
							}
						}
					}
					break;
					
			case 4 : var timeHour = parseInt(hours(YR_RESULTS[i].time));
					var timeMinute = parseInt(minutes(YR_RESULTS[i].time));
					var timeSecond = parseInt(seconds(YR_RESULTS[i].time));
					var timeMilSecond = parseInt(milliseconds(YR_RESULTS[i].time));
					if(resDate.getFullYear()-END == 0) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null, null, null, null, null]
						]);
					}
					if(resDate.getFullYear()-END == -1) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null, null, null]
						]);
					}
					if(resDate.getFullYear()-END == -2) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null]
						]);
					}
					if(resDate.getFullYear()-END == -3) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null, null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null]
						]);
					}
					if(resDate.getFullYear()-END == -4) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null, null, null, null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location)]
						]);
					}
					if(minTime[0] > timeHour) {
						minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
					}
					else if(minTime[0] < timeHour) {
						break;
					}
					else {
						if(minTime[1] > timeMinute) {
							minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];;
						}
						else if(minTime[1] < timeMinute) {
							break;
						}
						else {
							if(minTime[2] > timeSecond) {
								minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
							}
							else if(minTime[2] < timeSecond) {
								break;
							}
							else {
								if(minTime[3] > timeMilSecond) {
									minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
								}
								else {
									break;
								}
							}
						}
					}
					break;
					
			case 5 : var timeHour = parseInt(hours(YR_RESULTS[i].time));
					var timeMinute = parseInt(minutes(YR_RESULTS[i].time));
					var timeSecond = parseInt(seconds(YR_RESULTS[i].time));
					var timeMilSecond = parseInt(milliseconds(YR_RESULTS[i].time));
					if(resDate.getFullYear()-END == 0) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null, null, null, null, null, null, null]
						]);
					}
					if(resDate.getFullYear()-END == -1) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null, null, null, null, null]
						]);
					}
					if(resDate.getFullYear()-END == -2) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null, null, null]
						]);
					}
					if(resDate.getFullYear()-END == -3) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null, null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null, null, null]
						]);
					}
					if(resDate.getFullYear()-END == -4) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null, null, null, null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location),
							null, null]
						]);
					}
					if(resDate.getFullYear()-END == -5) {
						YR_tableData.addRows([
							[new Date(0,resDate.getMonth(),resDate.getDate(),0,0,0,0), 
							null, null, null, null, null, null, null, null, null, null,
							[timeHour,
								timeMinute,
									timeSecond,
										timeMilSecond],
							YR_createCustomHTMLContent(YR_RESULTS[i].date, YR_RESULTS[i].time, YR_RESULTS[i].location)]
						]);
					}
					if(minTime[0] > timeHour) {
						minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
					}
					else if(minTime[0] < timeHour) {
						break;
					}
					else {
						if(minTime[1] > timeMinute) {
							minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];;
						}
						else if(minTime[1] < timeMinute) {
							break;
						}
						else {
							if(minTime[2] > timeSecond) {
								minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
							}
							else if(minTime[2] < timeSecond) {
								break;
							}
							else {
								if(minTime[3] > timeMilSecond) {
									minTime = [timeHour, timeMinute, timeSecond, timeMilSecond];
								}
								else {
									break;
								}
							}
						}
					}
					break;
		}
							
		if (i == YR_RESULTS.length-1) {
			YR_tableData.sort([{column: 0, desc:true}]);
			YR_drawVisual();
		}
	}
};
	
function YR_drawVisual() {
	var options = {
		curveType: "line",
		vAxis: {gridlines: {count: 20}, format: 'HH:mm:ss.SS', minValue: [minTime[0],minTime[1],minTime[2]-1,minTime[3]]},
		hAxis: {format: 'MMMM', gridlines: {count: 12}},
		legend: {position: 'right'},
		series: {0: { color: '#44546a' }, 1: { color: '#dbacab' }, 2: { color: '#e5ddc6' }, 3: { color: '#b6c7bb' }, 4: { color: '#9e9aae' },5: { color : '#f4dcd7' }},
		tooltip: {isHtml: true},
		animation : {duration : 5000},
		interpolateNulls: true,
		pointSize: 2,
		title: YR_ATHLETE_NAME + ' - ' + YR_EVENT + 'm Progression (' + START + ' - ' + END + ')',
		titleTextStyle: {color: '#44546a'},
		chartArea: {
			left: 100,
			width: $('#visualization').width()*0.8125,
			height: $('#visualization').height()*0.8,
		},
		backgroundColor: 'transparent',
	};
			
	// Create and draw the visualization with the specified data and options.	
	new google.visualization.LineChart(document.getElementById('visualization')).
	draw(YR_tableData, options);
	$('#loader').hide();
}
      
// Generate HTML
function YR_createCustomHTMLContent(date, time, location) {
	return '<div style="padding:5px 5px 5px 5px;">' +
		'<table id="info_layout">' + '<tr>' +
			'<td><b>' + date + '</b></td>' + '</tr>' + '<tr>' +
				'<td>Time: <b>' + time + '</b></td>' + '</tr>' + '<tr>' +
					'<td>Location: <b>' + location + '</b></td>' + '</tr>' + '</table>' + '</div>';
}
	  
// Parse PowerOf10. YQL is used to get around the same-origin policy.
function YR_YQLQuery(query, callback) {
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
	 
		scriptEl.src = 'http://query.yahooapis.com/v1/public/yql?q=' + encodedQuery + '&format=json&callback=YQLQuery.' + uid; 
		document.head.appendChild(scriptEl);
	 
	};
};	

function displayErrorYR() {
	var plink = "";
	plink = plink.concat('http://thepowerof10.info/athletes/profile.aspx?athleteid=',YR_PROFILE);
	$('#errorLinkA').attr("href",plink);
	$('.errorMessage').css({"visibility":"visible"});
	return;
};

function generateYearRange() {
	$('.errorMessage').css({"visibility":"hidden"});
	$('#loader').show();
	$('#visualization').html('<div id="errorMSG" class="errorMessage"><span id="errorMessageText"></span><span id="errorLink"></span></div>');
	YR_RESULTS = [];
	YR_EVENT = $('#eventPicker').val();
	START = $('#start').val();
	END = $('#end').val();
	RANGE = parseInt(END) - parseInt(START);
	YR_ATHLETE_NAME ='';
	YR_PROFILE = $('#p10ID').val();
	minTime = [99,99,99,999];
	YR_query =  "select * from html where url='thepowerof10.info/athletes/profile.aspx?athleteid=" + YR_PROFILE + "' limit 1";
	var yearRangeData = new YR_YQLQuery(YR_query, YR_callback);
	google.setOnLoadCallback(yearRangeData.fetch());
};

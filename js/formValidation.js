//
//  formValidation.js
//  Power Of 10 Progression Chart Generator
//
//  Created by David Banwell-Clode on 28/07/2014.
//  Copyright (c) 2014 David Banwell-Clode. All rights reserved.
//

$(document).ready(function () {
	$('#clickMe').attr('disabled', true);	
	if($('#period').val() == "AT") {
		$('#start').hide();
		$('#from').hide();
		$('#end').hide();
		$('#to').hide();
	}
	
	if($('#start').val() == "2016") {
		$("#end option[value='2015']").remove();
		$("#end option[value='2014']").remove();
		$("#end option[value='2013']").remove();
		$("#end option[value='2012']").remove();
		$("#end option[value='2011']").remove();
		$("#end option[value='2010']").remove();
		$("#end option[value='2009']").remove();
		$("#end option[value='2008']").remove();
		$("#end option[value='2007']").remove();
		$("#end option[value='2006']").remove();
		$("#end option[value='2005']").remove();
		$("#end option[value='2004']").remove();
		$("#end option[value='2003']").remove();
		$("#end option[value='2002']").remove();
		$("#end option[value='2001']").remove();
		$("#end option[value='2000']").remove();
	}
	
	$("#athleteInfo").bind("keypress", function(e) {
		if (e.keyCode == 13) {
			return false;
		}
	});
});	

$(window).load(function() {
	
	$(document).on('change','#start',function(){
		var year = parseInt($('#start').val());
		
		// Remove years in the past.
		switch(year) {
			case 2016 : $("#end option[value='2015']").remove();
			case 2015 : $("#end option[value='2014']").remove();
			case 2014 : $("#end option[value='2013']").remove();
			case 2013 : $("#end option[value='2012']").remove();
			case 2012 : $("#end option[value='2011']").remove();
			case 2011 : $("#end option[value='2010']").remove();
			case 2010 : $("#end option[value='2009']").remove();
			case 2009 : $("#end option[value='2008']").remove();
			case 2008 : $("#end option[value='2007']").remove();
			case 2007 : $("#end option[value='2006']").remove();
			case 2006 : $("#end option[value='2005']").remove();
			case 2005 : $("#end option[value='2004']").remove();
			case 2004 : $("#end option[value='2003']").remove();
			case 2003 : $("#end option[value='2002']").remove();
			case 2002 : $("#end option[value='2001']").remove();
			case 2001 : $("#end option[value='2000']").remove();
			default : break;//do nothing.
		}
		
		// Remove years more than 5 years in the future.
		switch(year) {
			case 2000 : $("#end option[value='2006']").remove();
			case 2001 : $("#end option[value='2007']").remove();
			case 2002 : $("#end option[value='2008']").remove();
			case 2003 : $("#end option[value='2009']").remove();
			case 2004 : $("#end option[value='2010']").remove();
			case 2005 : $("#end option[value='2011']").remove();
			case 2006 : $("#end option[value='2012']").remove();
			case 2007 : $("#end option[value='2013']").remove();
			case 2008 : $("#end option[value='2014']").remove();
			case 2009 : $("#end option[value='2015']").remove();
			case 2010 : $("#end option[value='2016']").remove();
			default : break;//do nothing.
		}
		
		var count = 0;
		
		switch(year) {
			case 2000 : count++;
						if($("#end option[value='2000']").length < 1) {
							$("#end").append('<option value="2000">2000</option>');
						}
						if(count > 5) {
							break;
						}
			case 2001 : count++;
						if($("#end option[value='2001']").length < 1) {
							if($("#end option[value='2000']").length < 1) {
								$("#end").append('<option value="2001">2001</option>');
							}
							else {
								$("#end option[value='2000']").before($('<option value="2000">2000</option>').val('2001').html('2001'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2002 : count++;
						if($("#end option[value='2002']").length < 1) {
							if($("#end option[value='2001']").length < 1) {
								$("#end").append('<option value="2002">2002</option>');
							}
							else {
								$("#end option[value='2001']").before($('<option value="2001">2001</option>').val('2002').html('2002'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2003 : count++;
						if($("#end option[value='2003']").length < 1) {
							if($("#end option[value='2002']").length < 1) {
								$("#end").append('<option value="2003">2003</option>');
							}
							else {
								$("#end option[value='2002']").before($('<option value="2002">2002</option>').val('2003').html('2003'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2004 : count++;
						if($("#end option[value='2004']").length < 1) {
							if($("#end option[value='2003']").length < 1) {
								$("#end").append('<option value="2004">2004</option>');
							}
							else {
								$("#end option[value='2003']").before($('<option value="2003">2003</option>').val('2004').html('2004'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2005 : count++;
						if($("#end option[value='2005']").length < 1) {
							if($("#end option[value='2004']").length < 1) {
								$("#end").append('<option value="2005">2005</option>');
							}
							else {
								$("#end option[value='2004']").before($('<option value="2004">2004</option>').val('2005').html('2005'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2006 : count++;
						if($("#end option[value='2006']").length < 1) {
							if($("#end option[value='2005']").length < 1) {
								$("#end").append('<option value="2006">2006</option>');
							}
							else {
								$("#end option[value='2005']").before($('<option value="2005">2005</option>').val('2006').html('2006'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2007 : count++;
						if($("#end option[value='2007']").length < 1) {
							if($("#end option[value='2006']").length < 1) {
								$("#end").append('<option value="2007">2007</option>');
							}
							else {
								$("#end option[value='2006']").before($('<option value="2006">2006</option>').val('2007').html('2007'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2008 : count++;
						if($("#end option[value='2008']").length < 1) {
							if($("#end option[value='2007']").length < 1) {
								$("#end").append('<option value="2008">2008</option>');
							}
							else {
								$("#end option[value='2007']").before($('<option value="2007">2007</option>').val('2008').html('2008'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2009 : count++;
						if($("#end option[value='2009']").length < 1) {
							if($("#end option[value='2008']").length < 1) {
								$("#end").append('<option value="2009">2009</option>');
							}
							else {
								$("#end option[value='2008']").before($('<option value="2008">2008</option>').val('2009').html('2009'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2010 : count++;
						if($("#end option[value='2010']").length < 1) {
							if($("#end option[value='2009']").length < 1) {
								$("#end").append('<option value="2010">2010</option>');
							}
							else {
								$("#end option[value='2009']").before($('<option value="2009">2009</option>').val('2010').html('2010'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2011 : count++;
						if($("#end option[value='2011']").length < 1) {
							if($("#end option[value='2010']").length < 1) {
								$("#end").append('<option value="2011">2011</option>');
							}
							else {
								$("#end option[value='2010']").before($('<option value="2010">2010</option>').val('2011').html('2011'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2012 : count++;
						if($("#end option[value='2012']").length < 1) {
							if($("#end option[value='2011']").length < 1) {
								$("#end").append('<option value="2012">2012</option>');
							}
							else {
								$("#end option[value='2011']").before($('<option value="2011">2011</option>').val('2012').html('2012'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2013 : count++;
						if($("#end option[value='2013']").length < 1) {
							if($("#end option[value='2012']").length < 1) {
								$("#end").append('<option value="2013">2013</option>');
							}
							else {
								$("#end option[value='2012']").before($('<option value="2012">2012</option>').val('2013').html('2013'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2014 : count++;
						if($("#end option[value='2014']").length < 1) {
							if($("#end option[value='2013']").length < 1) {
								$("#end").append('<option value="2014">2014</option>');
							}
							else {
								$("#end option[value='2013']").before($('<option value="2013">2013</option>').val('2014').html('2014'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2015 : count++;
						if($("#end option[value='2015']").length < 1) {
							if($("#end option[value='2014']").length < 1) {
								$("#end").append('<option value="2015">2015</option>');
							}
							else {
								$("#end option[value='2014']").before($('<option value="2014">2014</option>').val('2015').html('2015'));
							}
						}
						if(count > 5) {
							break;
						}
			case 2016 : count++;
						if($("#end option[value='2016']").length < 1) {
							if($("#end option[value='2015']").length < 1) {
								$("#end").append('<option value="2016">2016</option>');
							}
							else {
								$("#end option[value='2015']").before($('<option value="2015">2015</option>').val('2016').html('2016'));
							}
						}
						if(count > 5) {
							break;
						}
			default : break;
		}
	});
	
	$(document).on('change','#period',function(){
		if($('#period').val() == "AT") {
			$('#start').hide();
			$('#from').hide();
			$('#end').hide();
			$('#to').hide();
			$('#clickMe').attr('onClick', 'generateAllTime()');
			$('#SB').show(0,"linear",null);
			$('#seasonText').show(0,"linear",null);
		}
		else {
			$('#start').show(0,"linear",null);
			$('#from').show(0,"linear",null);
			$('#end').show(0,"linear",null);
			$('#to').show(0,"linear",null);
			$('#clickMe').attr('onClick', 'generateYearRange()');
			$('#SB').hide();
			$('#seasonText').hide();
		}
	});
	
	$('#p10ID').keyup(function() { 
		var patt = /^\d+$/;
		
		if(patt.test($('#p10ID').val())) {
			$('#clickMe').attr('disabled', false);
		}
		else {
			$('#clickMe').attr('disabled', true);
		}
	});
});
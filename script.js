var Timer_UdpateMesures;
var tab_pane;


/*
google.charts.load('current', {
  packages: ['corechart', 'line', 'bar', 'gauge']
});
google.charts.setOnLoadCallback(drawChart);
*/

//drawChart "représentation graphiques"
/*
function drawChart() {
	// https://developers.google.com/chart/interactive/docs/reference?csw=1#datatable-class
	var options1 = {
		title: 'Température et humidité - DHT22',
		legend: 'bottom',
		series: {
			// Gives each series an axis name that matches the Y-axis below.
			0: {
				axis: 'temperature'
			},
			1: {
				axis: 'humidite'
			}
		},
		axes: {
			// Adds labels to each axis; they don't have to match the axis names.
			y: {
				temperature: {
					label: 'Température (°C)'
				},
				humidite: {
					label: 'Humidité (%)'
				}
			}
		}
	}
	
	var options2 = {
		title: 'Pression Atmosphérique - BMP180',
		legend: {
			position: 'none'
		},
	}
	
	var optionsGauge = {
		redFrom: 960,
		redTo: 990,

		yellowFrom: 990,
		yellowTo: 1030,

		greenFrom: 1030,
		greenTo: 1080,

		minorTicks: 10,

		min: 960,
		max: 1080,

		animation: {
			duration: 400,
			easing: 'out',
		},
	};
	
	// Objets graphiques - Charts objects
	
	var chartTemp = new google.visualization.AreaChart(document.getElementById('chartTemp'));
	var barTemp = new google.charts.Bar(document.getElementById('barTemp'));
	//var chartPA = new google.visualization.AreaChart(document.getElementById('chartPA'));
	//var gaugePA = new google.visualization.Gauge(document.getElementById('gaugePA'));
	// Données - Data
	//dataGaugePA = new google.visualization.DataTable();
	dataChartTemp = new google.visualization.DataTable();
	dataBarTemp = new google.visualization.DataTable();
	//dataChartPA = new google.visualization.DataTable();

	// Gauge Pression Atmospherique - Gauge Atmosph. pressure
	//dataGaugePA.addColumn('string', 'Label');
	//dataGaugePA.addColumn('number', 'Value');
	//dataGaugePA.addRows(1);

	// Line chart temp/humidity
	dataChartTemp.addColumn('timeofday', 'Temps');
	dataChartTemp.addColumn('number', 'Température');
	dataChartTemp.addColumn('number', 'Humidité');

	// Bar temp/humidity
	dataBarTemp.addColumn('string', 'Moyennes');
	dataBarTemp.addColumn('number', 'Température');
	dataBarTemp.addColumn('number', 'Humidité');

	// Line Chart PA
	//dataChartPA.addColumn('timeofday', 'Temps');
	//dataChartPA.addColumn('number', 'Pression Atmosphérique');

	// Force l'actualisation du graphique au 1er lancement - Force chart update first launch
	var firstStart = true;
	
	
	updateGraphs();
	// Actualise à intervalle régulier les graphiques - auto-update charts 
	setInterval(updateGraphs, 10000); //60000 MS == 1 minutes

	function updateGraphs() {
		// Uniquement si le panneau des graphs est actif - only if chart panel is active
		if (tab_pane == '#tab_graphs' | firstStart) {
			firstStart = false;
			$.getJSON('/graph_temp.json', function (json) {
				//console.log("Mesures envoyees : " + JSON.stringify(data) + "|" + data.t + "|" + data.h + "|" + data.pa) ;
				var _dataT = [];
				var _dataPA = [];
				var _dataBarTemp = [];
				var _dataBarPA = [];

				// Data line chart  
				for (var i = 0; i < json.timestamp.length; i++) {
					var d = new Date(json.timestamp[i] * 1000);
					_dataT.push(
                  [
                    [d.getHours(), d.getMinutes(), d.getSeconds()],
                    json.t[i],
                    json.h[i]
                  ]
					)
					_dataPA.push(
                  [
                    [d.getHours(), d.getMinutes(), d.getSeconds()],
                    json.pa[i]
                  ]
					)
				}
				for (var i = 0; i < json.bart.length; i++) {
					_dataBarTemp.push(
                  [
                   i - 7 + "h",
                   json.bart[i],
                   json.barh[i]
                  ]
					)
				}

				//dataGaugePA.setValue(0, 0, 'mbar');
				//dataGaugePA.setValue(0, 1, json.pa[0]);
				dataChartTemp.addRows(_dataT);
				//dataChartPA.addRows(_dataPA);
				dataBarTemp.addRows(_dataBarTemp);

				// Efface les anciennes valeurs - Erase old data
				var nbRec = dataChartTemp.getNumberOfRows() - json.timestamp.length;
				if (dataChartTemp.getNumberOfRows() > json.timestamp.length) {
					dataChartTemp.removeRows(0, nbRec);
					//dataChartPA.removeRows(0, nbRec);
				}
				nbRec = dataBarTemp.getNumberOfRows() - json.bart.length;
				if (dataBarTemp.getNumberOfRows() > json.bart.length) {
					dataBarTemp.removeRows(0, nbRec);
				}
				// Masque ou affiche l'histogramme - hide or sho bar graph
				if (dataBarTemp.getNumberOfRows() == 0) {
					$("#zeroDataTemp").show();
					$("#barTemp").hide();
				} else {
					$("#zeroDataTemp").hide();
					$("#barTemp").show();
				}
				// Affiche les graphiques - display charts
				//gaugePA.draw(dataGaugePA, optionsGauge);
				chartTemp.draw(dataChartTemp, options1);
				barTemp.draw(dataBarTemp, options1);
				//chartPA.draw(dataChartPA, options2);
			}).fail(function (err) {
				console.log("err getJSON graph_temp.json " + JSON.stringify(err));
			});
		}
	}
	
}
*/

$('a[data-toggle=\"tab\"]').on('shown.bs.tab', function (e) {
	//On supprime tous les timers lorsqu'on change d'onglet
	clearTimeout(Timer_UdpateMesures);
	tab_pane = $(e.target).attr("href");
	console.log('activated ' + tab_pane);

	// IE10, Firefox, Chrome, etc.
	if (history.pushState)
		window.history.pushState(null, null, tab_pane);
	else
		window.location.hash = tab_pane;

	if (tab_pane == '#tab_mesures') {
		$('#table_mesures').bootstrapTable('refresh', {
			silent: true,
			url: '/tabmesures.json'
		});
	}
	if (tab_pane == '#tab_configuration') {
		//getSchedule();
		refreshSchedule();
	}
});

// Créé un timer qui actualise les données régulièrement - Create a timer than update data every n secondes
$('#tab_mesures').on('load-success.bs.table', function (e, data) {
	console.log("tab_mesures loaded");
	if ($('.nav-tabs .active > a').attr('href') == '#tab_mesures') {
		Timer_UdpateMesures = setTimeout(function () {
			$('#table_mesures').bootstrapTable('refresh', {
				silent: true,
				showLoading: false,
				url: '/tabmesures.json'
			});
			updateMesures();
		}, 10000);
	}
});

function updateMesures() {
	$.getJSON('/mesures.json', function (data) {
		//console.log("Mesures envoyees : " + JSON.stringify(data) + "|" + data.t + "|" + data.h + "|" + data.pa) ;
		$('#temperature').html(data.t);
		$('#humidite').html(data.h);
		//$('#pa').html(data.pa);
	}).fail(function (err) {
		console.log("err getJSON mesures.json " + JSON.stringify(err));
	});
}

function labelFormatter(value, row) {
	//console.log("labelFormatter");
	//console.log(value);
	//console.log(row);
	var label = "";
	if (value === "Température") {
		label = value + "<span class='glyphicon " + row.glyph + " pull-left'></span>";
		$("#labelTemp").html("&nbsp;" + value + "&nbsp;" + "<span class='badge'> " + row.valeur + row.unite + "</span><span class='glyphicon " + row.glyph + " pull-left'></span>");
	} else if (value === "Humidité") {
		label = value + "<span class='glyphicon " + row.glyph + " pull-left'></span>";
		$("#labelHumi").html("&nbsp;" + value + "&nbsp;" + "<span class='badge'> " + row.valeur + row.unite + "</span><span class='glyphicon " + row.glyph + " pull-left'></span>");
	} else if (value === "Pression Atmosphérique") {
		label = value + "<span class='glyphicon " + row.glyph + " pull-left'></span>";
		$("#labelPa").html("&nbsp;" + value + "&nbsp;" + "<span class='badge'> " + row.valeur + row.unite + "</span><span class='glyphicon " + row.glyph + " pull-left'></span>");
	} else {
		label = value;
	}
	return label;
}

function valueFormatter(value, row) {
	//console.log("valueFormatter");
	var label = "";
	if (row.valeur > row.precedente) {
		label = value + row.unite + "<span class='glyphicon glyphicon-chevron-up pull-right'></span>";
	} else {
		label = value + row.unite + "<span class='glyphicon glyphicon-chevron-down pull-right'></span>";
	}
	return label;
}

function vpFormatter(value, row) {
	//console.log("valueFormatter");
	var label = "";
	if (row.valeur > row.precedente) {
		label = value + row.unite;
	} else {
		label = value + row.unite;
	}
	return label;
}

/*
// Commandes sur le GPIO - GPIO change
$('#D5_On').click(function () {
	setBouton('D5', '1');
});
$('#D5_Off').click(function () {
	setBouton('D5', '0');
});
$('#D6_On').click(function () {
	setBouton('D6', '1');
});
$('#D6_Off').click(function () {
	setBouton('D6', '0');
});
$('#D7_On').click(function () {
	setBouton('D7', '1');
});
$('#D7_Off').click(function () {
	setBouton('D7', '0');
});
$('#D8_On').click(function () {
	setBouton('D8', '1');
});
$('#D8_Off').click(function () {
	setBouton('D8', '0');
});


function setBouton(id, etat) {
	$.post("gpio?id=" + id + "&etat=" + etat).done(function (data) {
		//console.log("Retour setBouton " + JSON.stringify(data)); 
		var id_gpio = "#" + id + "_etat";
		//console.log(data);
		if (data.success === "1" | data.success === 1) {
			if (data.etat === "1") {
				$(id_gpio).html("ON");
			} else {
				$(id_gpio).html("OFF");
			}
		} else {
			$(id_gpio).html('!');
		}
	}).fail(function (err) {
		console.log("err setButton " + JSON.stringify(err));
	});
}
*/


// Changement du theme - Change current theme
// Adapté de - Adapted from : https://wdtz.org/bootswatch-theme-selector.html
var supports_storage = supports_html5_storage();
if (supports_storage) {
	var theme = localStorage.theme;
	console.log("Recharge le theme " + theme);
	if (theme) {
		set_theme(get_themeUrl(theme));
	}
}

// Nouveau theme sélectionne - New theme selected
jQuery(function ($) {
	$('body').on('click', '.change-style-menu-item', function () {
		var theme_name = $(this).attr('rel');
		console.log("Change theme " + theme_name);
		var theme_url = get_themeUrl(theme_name);
		console.log("URL theme : " + theme_url);
		set_theme(theme_url);
	});
});
// Recupere l'adresse du theme - Get theme URL
function get_themeUrl(theme_name) {
	$('#labelTheme').html("Th&egrave;me : " + theme_name);
	var url_theme = "";
	if (theme_name === "bootstrap") {
		url_theme = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
	} else {
		url_theme = "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/" + theme_name + "/bootstrap.min.css";
	}
	if (supports_storage) {
		// Enregistre le theme sélectionné en local - save into the local database the selected theme
		localStorage.theme = theme_name;
	}
	return url_theme;
}
// Applique le thème - Apply theme
function set_theme(theme_url) {
	$('link[title="main"]').attr('href', theme_url);
}
// Stockage local disponible ? - local storage available ?
function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}


//------------------------------------------------------------------------------------
//------------------------------THERMOSTAT--------------------------------------------
//------------------------------------------------------------------------------------

var now = (new Date());
	var timenow = now.getHours() + (now.getMinutes() / 60);
	var days = {
		0: 'sun',
		1: 'mon',
		2: 'tue',
		3: 'wed',
		4: 'thu',
		5: 'fri',
		6: 'sat',
		7: 'sun'
	};
	var today = days[now.getDay()];

	//=================================================
	// DATA
	//=================================================
	var nodes = {};
	var room_temperature = 0;
	var setpoint = 18.0;

	// Mode chauffage initial -> ici schedule
	var heating = {
		state: 1,
		manualsetpoint: 18,
		mode: 'schedule'
	};

	var schedule = {};

	//On crée une journée type
	var day1 = [
		{
			start: 0,
			end: 6,
			setpoint: 8
		},
		{
			start: 6,
			end: 9,
			setpoint: 18
		},
		{
			start: 9,
			end: 17,
			setpoint: 12
		},
		{
			start: 17,
			end: 22,
			setpoint: 18
		},
		{
			start: 22,
			end: 24,
			setpoint: 8
		}
	];
	
	//On applique la journée type à toute la semaine
	schedule['mon'] = JSON.parse(JSON.stringify(day1));
	schedule['tue'] = JSON.parse(JSON.stringify(day1));
	schedule['wed'] = JSON.parse(JSON.stringify(day1));
	schedule['thu'] = JSON.parse(JSON.stringify(day1));
	schedule['fri'] = JSON.parse(JSON.stringify(day1));
	schedule['sat'] = JSON.parse(JSON.stringify(day1));
	schedule['sun'] = JSON.parse(JSON.stringify(day1));
	//console.log(schedule);
	

	// On récupère le planning du json dans la mémoire spiffs 
	getSchedule();
	// On récupère le mode actuel "schedule" ou "manual"
	getHeating();
	

	//BTY//schedule = server_get("app/heating/schedule");
	//BTY//heating.state = server_get("app/heating/state");

	var maxc = 25;
	var minc = 15;
	// ================================================
	// State variables
	// ================================================
	var editmode = 'move';
	$("#mode-move").css("background-color", "#00bc8c");
	var key = 1;
	var day = "mon";
	var mousedown = 0;
	var slider_width = $(".slider").width();
	var slider_height = $(".slider").height();
	var changed = 0;
	if (heating.mode == "schedule"){
		$("#scheduled_heating").css("background-color", "#00bc8c");
	} else {
		$("#manual_heating").css("background-color", "#00bc8c");
	}
	

	$(".zone-setpoint").html(setpoint.toFixed(1) + "&deg;C");
	update();
	updateclock();
	setInterval(update, 5000);
	setInterval(updateclock, 1000);


	function getSchedule(){
		$.getJSON('/schedule.json', function (json) {
			//console.log("Planning récupéré : ") ;
			//console.log(JSON.stringify(json));
		schedule = json;
	}).fail(function (err) {
		console.log("err getJSON schedule " + JSON.stringify(err));
	});
	}

	function getHeating(){
		$.getJSON('/heating.json', function (data) {
		//console.log("Heating Node recu : " + JSON.stringify(data) + "|" + data.state + "|" + data.manualsetpoint + "|" + data.mode) ;
		heating = data;
		checkHeating();
	}).fail(function (err) {
		console.log("err getJSON heating node pour MAJ état chauffage " + JSON.stringify(err));
	});
	}

	function checkHeating(){
		if (heating.state == 1) {
			$("#toggle").html("ON");
			$("#toggle").css("background-color", "#00bc8c");
		}
		if (heating.state === 0) {
			$("#toggle").html("OFF");
			$("#toggle").css("background-color", "#555");
		}
	}

	function updateclock() {
		now = (new Date());
		timenow = now.getHours() + (now.getMinutes() / 60);
		today = days[now.getDay()];


		$("#datetime").html(today.toUpperCase() + " " + format_time(timenow));

		var current_key = 0;
		for (var z in schedule[today]) {
			if (schedule[today][z].start <= timenow && schedule[today][z].end > timenow) {
				if (heating.mode == "schedule") {
					setpoint = schedule[today][z].setpoint * 1;
					heating.manualsetpoint = setpoint;
					$(".zone-setpoint").html(setpoint.toFixed(1) + "&deg;C");
					current_key = z;
				}
			}

		}

		var sx = $(".slider[day=" + today + "]")[0].offsetLeft;
		var y = $(".slider[day=" + today + "]")[0].offsetTop;
		var x1 = sx + slider_width * (timenow / 24.0);
		var x2 = sx + slider_width * (schedule[today][current_key].start / 24.0);

		x2 = sx;
		$("#timemarker").css('top', y + "px");
		$("#timemarker").css('left', x2 + "px");
		$("#timemarker").css('width', (x1 - x2) + "px");
	}

	// Toutes les 5s on récupère on update...
	function update() {
		//BTY//room_temperature = server_get("rx/room/temperature");
		
		// ... on récupère les infos état,mode et setpoint
		getHeating();
		
		// ...on update la température
		$.getJSON('/mesures.json', function (data) {
		//console.log("Mesures envoyees : " + JSON.stringify(data) + "|" + data.t + "|" + data.h + "|" + data.pa) ;
		$(".zone-temperature").html(data.t + "&deg;C");

	}).fail(function (err) {
		console.log("err getJSON mesures.json pour MAJ température thermostat " + JSON.stringify(err));
	});

		
	}

	$("#toggle").click(function() {
		heating.state++;
		if (heating.state > 1) heating.state = 0;
		checkHeating();
		//save("tx/heating", heating.state + "," + parseInt(setpoint * 100));
		//save("app/heating/state", heating.state);
	});

	$("#zone-setpoint-dec").click(function() {
		
		if(heating.mode == "schedule") {
			$(".heatingmode").css("background-color", "#555");
			$("#manual_heating").css("background-color", "#00bc8c");
			heating.mode = "manual";
			ajaxPost("/api/app/heating/mode", heating.mode,
				function (reponse) {
					// Le film est affiché dans la console en cas de succès
					console.log("mode manuel envoyé");
				},
				true // Valeur du paramètre isJson
			);
			
		}
		heating.manualsetpoint -= 0.1;
		setpoint -= 0.1;
		$(".zone-setpoint").html(heating.manualsetpoint.toFixed(1) + "&deg;C");

		//save("tx/heating", heating.state + "," + parseInt(setpoint * 100));
		//save("app/heating/mode", heating.mode);
		
		//save("app/heating/manualsetpoint", heating.manualsetpoint);
	});

	$("#zone-setpoint-inc").click(function() {
		
		if(heating.mode == "schedule") {
			$(".heatingmode").css("background-color", "#555");
			$("#manual_heating").css("background-color", "#00bc8c");
			heating.mode = "manual";
			ajaxPost("/api/app/heating/mode", heating.mode,
				function (reponse) {
					// Le film est affiché dans la console en cas de succès
					console.log("mode manuel envoyé");
				},
				true // Valeur du paramètre isJson
			);
			
		}
		heating.manualsetpoint += 0.1;
		setpoint += 0.1;
		$(".zone-setpoint").html(heating.manualsetpoint.toFixed(1) + "&deg;C");

		//save("tx/heating", heating.state + "," + parseInt(setpoint * 100));
		//save("app/heating/mode", heating.mode);
		//save("app/heating/manualsetpoint", heating.manualsetpoint);
	});

	// ============================================
	// SCHEDULER
	
	//On dessine le planning à l'ouverture de la page web
	//for (day in schedule) draw_day_slider(day);

	//Fonction qui permet de redessiner le planning
	function refreshSchedule(){
		for (day in schedule) draw_day_slider(day);
	}
	
	

	function draw_day_slider(day) {
		var out = "";
		var key = 0;
		for (var z in schedule[day]) {
			var left = (schedule[day][z].start / 24.0) * 100;
			var width = ((schedule[day][z].end - schedule[day][z].start) / 24.0) * 100;
			var color = color_map(schedule[day][z].setpoint);

			out += "<div class='slider-segment' style='left:" + left + "%; width:" + width + "%; background-color:" + color + "' key=" + key + " title='" + schedule[day][z].setpoint + "&deg;C'></div>";

			if (key > 0) {
				out += "<div class='slider-button' style='left:" + left + "%;' key=" + key + "></div>";
			}
			key++;
		}
		out += "<div class='slider-label'>" + day.toUpperCase() + "</div>";
		$(".slider[day=" + day + "]").html(out);
	}
	$("#average_temperature").html(calc_average_schedule_temperature().toFixed(1));

	$("body").on("mousedown", ".slider-button", function(e) {
		mousedown = 1;
		key = $(this).attr('key');
	});
	$("body").mouseup(function(e) {
		mousedown = 0;
		if (changed) {
			//save("app/heating/schedule", JSON.stringify(schedule));
			changed = 0;
		}
	});

	$("body").on("mousemove", ".slider", function(e) {
		if (mousedown && editmode == 'move') {
			day = $(this).attr('day');
			slider_update(e);
		}
	});

	$("body").on("touchstart", ".slider-button", function(e) {
		mousedown = 1;
		key = $(this).attr('key');
	});
	$("body").on("touchend", "body", function(e) {
		mousedown = 0;
		if (changed) {
			//save("app/heating/schedule", JSON.stringify(schedule));
			changed = 0;
		}
	});

	$("body").on("touchmove", ".slider", function(e) {

		var event = window.event;
		e.pageX = event.touches[0].pageX;
		if (mousedown && editmode == 'move') {
			day = $(this).attr('day');
			slider_update(e);
		}
	});

	// MERGE
	$("body").on("click", ".slider-button", function() {
		if (editmode == 'merge') {
			day = $(this).parent().attr("day");
			key = parseInt($(this).attr("key"));
			schedule[day][key - 1].end = schedule[day][key].end;
			schedule[day].splice(key, 1);
			draw_day_slider(day);
			//editmode = 'move';
			//save("app/heating/schedule", JSON.stringify(schedule));
		}
	});

	$("body").on("click", ".slider-segment", function(e) {

		day = $(this).parent().attr("day");
		key = parseInt($(this).attr("key"));

		if (editmode == 'split') {
			var x = e.pageX - $(this).parent()[0].offsetLeft;
			var prc = x / slider_width;
			var hour = prc * 24.0;
			hour = Math.round(hour / 0.5) * 0.5;

			if (hour > schedule[day][key].start + 0.5 && hour < schedule[day][key].end - 0.5) {
				var end = parseFloat(schedule[day][key].end);
				schedule[day][key].end = hour;

				schedule[day].splice(key + 1, 0, {
					start: hour,
					end: end,
					setpoint: schedule[day][key].setpoint
				});

				draw_day_slider(day);
				$("#average_temperature").html(calc_average_schedule_temperature().toFixed(1));
				//save("app/heating/schedule", JSON.stringify(schedule));
			}
			//editmode = 'move';
		} else if (editmode == 'move') {
			$("#slider-segment-temperature").val((schedule[day][key].setpoint * 1).toFixed(1));
			$("#slider-segment-start").val(format_time(schedule[day][key].start));
			$("#slider-segment-end").val(format_time(schedule[day][key].end));

			$("#slider-segment-block").show();
			$("#slider-segment-block-movepos").hide();
		}
	});

	function slider_update(e) {
		$("#slider-segment-block-movepos").show();
		$("#slider-segment-block").hide();

		if (key !== undefined) {
			var x = e.pageX - $(".slider[day=" + day + "]")[0].offsetLeft;

			var prc = x / slider_width;
			var hour = prc * 24.0;
			hour = Math.round(hour / 0.5) * 0.5;

			if (hour > schedule[day][key - 1].start && hour < schedule[day][key].end) {
				schedule[day][key - 1].end = hour;
				schedule[day][key].start = hour;
				update_slider_ui(day, key);
				changed = 1;
			}
			$("#slider-segment-time").val(format_time(schedule[day][key].start));
		}
		// $("#average_temperature").html(calc_average_schedule_temperature().toFixed(1));


	}

	$("body").on("click", "#slider-segment-ok", function() {

		schedule[day][key].setpoint = $("#slider-segment-temperature").val();
		var color = color_map(schedule[day][key].setpoint);
		$(".slider[day=" + day + "]").find(".slider-segment[key=" + key + "]").css("background-color", color);

		var time = decode_time($("#slider-segment-start").val());
		if (time != -1 && key > 0 && key < schedule[day].length) {
			if (time >= (schedule[day][key - 1].start + 0.5) && time <= (schedule[day][key].end - 0.5)) {
				schedule[day][key - 1].end = time;
				schedule[day][key].start = time;
			}
		}
		$("#slider-segment-start").val(format_time(schedule[day][key].start));
		update_slider_ui(day, key);

		time = decode_time($("#slider-segment-end").val());
		if (time != -1 && key > 0 && key < (schedule[day].length - 1)) {
			if (time >= (schedule[day][key].start + 0.5) && time <= (schedule[day][key + 1].end - 0.5)) {
				schedule[day][key].end = time;
				schedule[day][key + 1].start = time;
			}
		}
		$("#slider-segment-end").val(format_time(schedule[day][key].end));
		update_slider_ui(day, key + 1);
		//save("app/heating/schedule", JSON.stringify(schedule));
		updateclock();

	});

	$("#slider-segment-movepos-ok").click(function() {

		var time = decode_time($("#slider-segment-time").val());
		if (time != -1 && key > 0) {
			if (time >= (schedule[day][key - 1].start + 0.5) && time <= (schedule[day][key].end - 0.5)) {
				schedule[day][key - 1].end = time;
				schedule[day][key].start = time;
			}
		}
		$("#slider-segment-time").val(format_time(schedule[day][key].start));
		update_slider_ui(day, key);
		//save("app/heating/schedule", JSON.stringify(schedule));
	});

	$("#mode-split").click(function() {
		editmode = 'split';
		$(".editmode").css("background-color", "#555");
		$(this).css("background-color", "#00bc8c");
		console.log("Mode Split");
	});


	$("#mode-move").click(function() {
		editmode = 'move';
		$(".editmode").css("background-color", "#555");
		$(this).css("background-color", "#00bc8c");
	});

	$("#mode-merge").click(function() {
		editmode = 'merge';
		$(".editmode").css("background-color", "#555");
		$(this).css("background-color", "#00bc8c");
	});

	$("#manual_heating").click(function() {
		$(".heatingmode").css("background-color", "#555");
		$(this).css("background-color", "#00bc8c");
		heating.mode = "manual";
		
		//save("app/heating/mode", heating.mode);
		updateclock();
	});

	$("#scheduled_heating").click(function() {
		$(".heatingmode").css("background-color", "#555");
		$(this).css("background-color", "#00bc8c");
		heating.mode = "schedule";
		
		//save("/", heating.mode);
		updateclock();
	});

	function color_map(temperature) {
		/*
		// http://www.particleincell.com/blog/2014/colormap/
		// rainbow short
		var a=(1-f)/0.25;	//invert and group
		var X=Math.floor(a);	//this is the integer part
		var Y=Math.floor(255*(a-X)); //fractional part from 0 to 255
		switch(X)
		{
		    case 0: r=255;g=Y;b=0;break;
		    case 1: r=255-Y;g=255;b=0;break;
		    case 2: r=0;g=255;b=Y;break;
		    case 3: r=0;g=255-Y;b=255;break;
		    case 3: r=0;g=255-Y;b=255;break;
		    case 4: r=0;g=0;b=255;break;
		}*/

		var f = (temperature - minc) / (maxc - minc);
		var a = (1 - f);
		var Y = Math.floor(255 * a);
		// Couleur froid -> chaud = jaune->orange->rouge
		var r = 255;
		var g = Y;
		var b = 0;
		// Couleur froid -> chaud = bleu ->violet->rouge
		//r = 255- Y;
		//g = 0;
		//b = Y;
		return "rgb(" + r + "," + g + "," + b + ")";
	}

	function update_slider_ui(day, key) {
		if (schedule[day] !== undefined && key < schedule[day].length) {
			var slider = $(".slider[day=" + day + "]");
			if (key > 0) {
				var width = ((schedule[day][key - 1].end - schedule[day][key - 1].start) / 24.0) * 100;
				slider.find(".slider-segment[key=" + (key - 1) + "]").css("width", width + "%");
			}

			var left = (schedule[day][key].start / 24.0) * 100;
			var width = ((schedule[day][key].end - schedule[day][key].start) / 24.0) * 100;
			slider.find(".slider-segment[key=" + key + "]").css("width", width + "%");
			slider.find(".slider-segment[key=" + key + "]").css("left", left + "%");
			slider.find(".slider-button[key=" + key + "]").css("left", left + "%");
		}
	}

	function format_time(time) {
		var hour = Math.floor(time);
		var mins = Math.round((time - hour) * 60);
		if (mins < 10) mins = "0" + mins;
		return hour + ":" + mins;
	}

	function decode_time(timestring) {
		var time = -1;
		if (timestring.indexOf(":") != -1) {
			var parts = timestring.split(":");
			var hour = parseInt(parts[0]);
			var mins = parseInt(parts[1]);

			if (mins >= 0 && mins < 60 && hour >= 0 && hour < 25) {
				if (hour == 24 && mins !== 0) {} else {
					time = hour + (mins / 60);
				}
			}
		}
		return time;
	}

	function calc_average_schedule_temperature() {
		var sum = 0;
		for (var d in schedule) {
			for (var z in schedule[d]) {
				var hours = (schedule[d][z].end - schedule[d][z].start);
				sum += (schedule[d][z].setpoint * hours);
			}
		}
		return sum / (24 * 7.0);
	}

	function save(topic, payload) {
		$.ajax({
			type: 'POST',
			url: "/api/" + topic,
			data: payload,
			async: true
		});
	}

	function server_get(topic) {
		var output = {};
		$.ajax({
			url: "api/" + topic,
			dataType: 'json',
			async: false,
			success: function(data) {
				if (data.length !== 0) output = data;
			}
		});
		return output;
	}



// ------------------------------------------------------------



$("#save-schedule").click(function() {
	console.log("bouton save");

	//console.log("Schedule :  " + JSON.stringify(schedule));
	// Envoi de l'objet au serveur
	ajaxPost("/save_schedule", schedule,
		function (reponse) {
			// Le film est affiché dans la console en cas de succès
			console.log("Le planning a été envoyé au serveur");
		},
		true // Valeur du paramètre isJson
	);
});

// Exécute un appel AJAX POST
// Prend en paramètres l'URL cible, la donnée à envoyer et la fonction callback appelée en cas de succès
// Le paramètre isJson permet d'indiquer si l'envoi concerne des données JSON
function ajaxPost(url, data, callback, isJson) {
    var req = new XMLHttpRequest();
    req.open("POST", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    if (isJson) {
        // Définit le contenu de la requête comme étant du JSON
        req.setRequestHeader("Content-Type", "application/json");
        // Transforme la donnée du format JSON vers le format texte avant l'envoi
        data = JSON.stringify(data);
    }
    req.send(data);
}
$(document).ready(function() {
	document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady() {
	
	//Get current date
	getDate();

	$('#showMoreLocation').click(function(e) {
		e.preventDefault();
		getMoreLocation();
	});

	$('#clearInfo').click(function(e) {
		e.preventDefault();
		$('.navbar-toggle').click();
		$('#moreLocationDisplay').slideUp('slow');
		$('#moreWeatherDisplay').slideUp('slow');
	});

	$('#otherLocation').click(function(e) {
		e.preventDefault();
		getOtherLocation();
	})

	//Get user's location
	getLocation();

	//Get local weather
	getWeather();
}

function getDate() {
	var currentDate = new Date();
	var dateTime = currentDate.getDate() + "/" 
					+ (currentDate.getMonth() + 1) + "/"
					+ currentDate.getFullYear() + " @ "
					+ currentDate.getHours() + ":"
					+ currentDate.getMinutes() + ":"
					+ currentDate.getSeconds()
	$('#datetimeDisplay').html(dateTime);
}

function getLocation() {
	console.log('Getting users location...');
	navigator.geolocation.getCurrentPosition(function(position) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var city = "";
		var state = "";
		var html = "";

		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon,
			dataType: 'json',
			success: function(response) {
				city = response.results[0].address_components[2].long_name;
				state = response.results[0].address_components[4].short_name;
				
				html = "<h1>" + city + ", " + state + "</h1>";
				$('#myLocation').html(html);

				getWeather(city, state);

				$('#showMoreWeather').click(function(e) {
					e.preventDefault();
					getMoreWeather(city, state);
				});
			}
		});

	});
}

//Get some extra location info
function getMoreLocation() {
	var html = '';

	$('.navbar-toggle').click();

	navigator.geolocation.getCurrentPosition(function(position) {
		html = '<ul id="moreLocationList" class="list-group">' +
				'<li class="list-group-item"><strong>Latitude: </strong>'+ position.coords.latitude +'</li>' +
				'<li class="list-group-item"><strong>Longitude: </strong>'+ position.coords.longitude +'</li>' +
				'<li class="list-group-item"><strong>Altitude: </strong>'+ position.coords.altitude +'</li>' +
				'<li class="list-group-item"><strong>Accuracy: </strong>'+ position.coords.accuracy +'</li>' +
				'</ul>';
		$('#moreLocationDisplay').hide();
		$('#moreLocationDisplay').html(html);
		$('#moreLocationDisplay').slideDown('slow');
	});
}

function getWeather(city, state) {

	var html = "";

	$.ajax({
		url: 'http://api.wunderground.com/api/31219fea7481c3a2/conditions/q/' + state + '/' + city + '.json',
		dataType: 'jsonp',
		success: function(response) {
			var weather = response.current_observation.weather;
			var feelslike = response.current_observation.feelslike_string;
			var icon_url = response.current_observation.icon_url;
			
			html = '<h1 class="text-center"><img src="' + icon_url + '">&nbsp;' + weather + '</h1>' + '<h2 class="text-center">' + feelslike + '</h2>';
			$('#weather').html(html);
		}
	});

}

function getMoreWeather(city, state) {
	
	var html = '';

	$('.navbar-toggle').click();

	$.ajax({
		url: 'http://api.wunderground.com/api/31219fea7481c3a2/conditions/q/' + state + '/' + city + '.json',
		dataType: 'jsonp',
		success: function(response) {
			var wind = response.current_observation.wind_string;
			
			html = '<h2 class="text-center">Wind: ' + wind + '</h2>';
			$('#moreWeatherDisplay').html(html);
			$('#moreWeatherDisplay').slideDown('slow');
				
		}
	});

}

function getOtherLocation() {
	var html = '';
	var city = '';
	var state = '';

	city = $('#city').val();
	state = $('#state').val();

	html = '<h1>'+ city + ', ' + state +'</h1>'

	$('#myLocation').html(html);

	getWeather(city, state);

	$('#city').val('');
	$('#state').val('');
}
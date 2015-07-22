$(document).ready(function() {
	document.addEventListener('deviceready', function() {
		getRepos();
	})

	$('#searchBtn').click(function(e) {
		e.preventDefault();

		var search_html = '';
		var user_html = '';
		var username = $('#searchText').val();

		console.log('Search user ' + username);

		var userurl = 'https://api.github.com/users/' + username;
		var repourl = 'https://api.github.com/users/' + username +  '/repos';

		$.ajax({
			url: userurl,
			dataType: 'jsonp',
			success: function(response) {
				user_html = '<h3><img src="'+ response.data.avatar_url +'">' +
							'<a target="_blank" href="' + response.data.html_url + '">' + response.data.login + '</a></h3>';

				$('#userInfo').html(user_html);
			}
		});

		$.ajax({
			url: repourl,
			dataType: 'jsonp',
			success: function(response) {
				$.each(response.data, function(i, item) {
					search_html = '<li>' +
									'<h1><a target="_blank" href="'+ item.html_url +'">'+ item.name + '</a></h1>' +
									'<p>By ' + item.owner.login + '</p>' + 
									'<span class="ui-li-count">' + item.forks_count + '</p>' + 
									'</li>';
					$('#searchList').append(search_html);
					$('#searchList').listview('refresh');
				});
			}
		});

	});

});


//Get repos for home screen
function getRepos() {
	var html = "";

	$.ajax({
		url: "https://api.github.com/repositories", 
		dataType: "jsonp",
		success: function(response) {
			$.each(response.data, function(i, item) {
				if (i < 10) {
					html = '<li>' + 
							'<img src="' + item.owner.avatar_url + '">' +
							'<h1><a target="_blank" href="' + item.html_url + '">' + item.name + '</a></h1>'+
							'<p>By ' + item.owner.login + '</p>'+
							'</li>';
					$('#repolist').append(html);
					$('#repolist').listview('refresh');
				}
			});
		}
	});
}
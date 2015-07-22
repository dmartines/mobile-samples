
$(document).ready(function() {
	document.addEventListener('deviceready', onDeviceReady, false)
});

function onDeviceReady() {

	var channel = 'sixpackshortcuts';

	//Check channel in local storage
	if (localStorage.channel == null || localStorage.channel == '') {
		//Ask user for a channel
		$('#popupdialog').popup('open');
	} else {
		channel = localStorage.getItem('channel');
		getPlayList(channel);
		localStorage.removeItem('channel');
	}

	$(document).on('click','#vidlist li', function() {
		showVideo($(this).attr('videoid'));
	});

	$(document).on('click','#channelBtnGo', function() {
		channel = $('#channelname').val();
		localStorage.setItem('channel',channel);
		getPlayList(channel);
	});


}

function getPlayList(channel) {
	$('#vidlist').html();
	$.get(
		'https://www.googleapis.com/youtube/v3/channels',
		{
			part: 'contentDetails',
			forUsername: channel,
			key: 'AIzaSyDyOEGLtKpKB9EQzcO4t-vYhcywlmfikBs'
		},
		function(data) {
			//console.log(data);
			$.each(data.items, function(i, item) {
				//console.log(item);
				playListId = item.contentDetails.relatedPlaylists.uploads;
				getVideos(playListId, 10);
			});
		}
		);
}

function getVideos(playlistId, maxResults) {
	$.get(
		'https://www.googleapis.com/youtube/v3/playlistItems?',
		{
			part: 'snippet',
			maxResults: maxResults,
			playlistId: playlistId,
			key: 'AIzaSyDyOEGLtKpKB9EQzcO4t-vYhcywlmfikBs'
		},
		function(data) {
			//console.log(data);
			var output;
			$.each(data.items, function(i, item) {
				id = item.snippet.resourceId.videoId;
				title = item.snippet.title;
				thumb = item.snippet.thumbnails.default.url;
				$('#vidlist').append('<li videoid="' + id + '"><img src="' + thumb + '"><h3>' + title + '</h3>')
				$('#vidlist').listview('refresh');
			})
		}
		);
}

function showVideo(videoId) {
	console.log('Showing video ' + videoId);
	$('#logo').hide();
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+ videoId +'" frameborder="0" allowfullscreen></iframe>';
	$('#showvideo').html(output);
}
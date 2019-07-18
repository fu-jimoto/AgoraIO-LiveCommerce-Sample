var client, publisherId, remoteStream;
var muted  = false;
var width  = window.innerWidth;
var height = window.innerHeight;

AgoraRTC.Logger.enableLogUpload();

function join(){
    client = AgoraRTC.createClient({mode: 'live', codec:'vp8'});
    client.init(appId, function () {
        client.join(null, channelName, null, function(uid) {

            $.ajax(COUNT_UP_URL+"?type="+countTypeList.view+"&live_id="+liveId,
            {
                type: 'get'
            })
            .done(function(data){
            })
            .fail(function() {
            });

        }, function(err) {
            console.log("Join channel failed", err);
        });
    }, function (err) {
        console.log("AgoraRTC client init failed", err);
    });

    client.on('stream-added', function (evt) {
        var stream = evt.stream;
        client.subscribe(stream, function (err) {
        });
    });

    client.on('stream-subscribed', function (evt) {
        var playButton = document.querySelector("#playButton");
        playButton.style.display = "block";
        remoteStream = evt.stream;
    });

    client.on('stream-removed', function (evt) {
        $('#agora_remote' + remoteStream.getId()).remove();
        var playButton = document.querySelector("#playButton");
        playButton.style.display = "none";
    });
    
    client.on('peer-leave', function (evt) {
        if (remoteStream) {
            $('#agora_remote' + remoteStream.getId()).remove();
        }
        var playButton = document.querySelector("#playButton");
        playButton.style.display = "none";
    });
}

function playStream(){
    var playButton = document.querySelector("#playButton");
    playButton.style.display = "none";
    $('div#video').append('<div id="agora_remote'+remoteStream.getId()+'" style="float:left; width:'+video.style.width+';height:'+video.style.height+';display:inline-block;"></div>');
    remoteStream.play('agora_remote'+remoteStream.getId());
    publisherId = remoteStream.getId();
    removeControls(remoteStream.getId());
}

function removeControls(streamId){
    var videoDiv = $("#video"+streamId);
    if (videoDiv && videoDiv.length > 0) {
        var tmpVideoDiv = videoDiv.get(0);
        tmpVideoDiv.removeAttribute("controls");
    }
}

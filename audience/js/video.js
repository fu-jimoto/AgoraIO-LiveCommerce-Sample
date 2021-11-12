var client, publisherId, remoteStream, remoteStreamType;
var playing = false;
var width   = window.innerWidth;
var height  = window.innerHeight;

AgoraRTC.enableLogUpload();

async function join(){
    client = AgoraRTC.createClient({mode: 'live', codec:'vp8'});

    [ uid ] = await Promise.all([
        client.join(appId, channelName, null)
    ]);
    $.ajax(COUNT_UP_URL+"?type="+countTypeList.view+"&live_id="+liveId,
    {
        type: 'get'
    })
    .done(function(data){
    })
    .fail(function() {
    });

    client.on("user-published", async function (user, mediaType) {
        if(playing===false){
            var playButton = document.querySelector("#playButton");
            playButton.style.display = "block";
            remoteStream = user;
            remoteStreamType = mediaType;    
        }else{
            await client.subscribe(user, mediaType);
            if(mediaType === 'video'){
                user.videoTrack.play('agora_remote'+remoteStream.uid);
            }
            if (mediaType === 'audio') {
                user.audioTrack.play();
            }
        }
    });
}

async function playStream(){
    await client.subscribe(remoteStream, "video");
    await client.subscribe(remoteStream, "audio");
    var playButton = document.querySelector("#playButton");
    playButton.style.display = "none";
    $('div#video').append('<div id="agora_remote'+remoteStream.uid+'" style="float:left; width:'+video.style.width+';height:'+video.style.height+';display:inline-block;"></div>');
    remoteStream.videoTrack.play('agora_remote'+remoteStream.uid);
    remoteStream.audioTrack.play();
    publisherId = remoteStream.uid;
    playing = true;
}



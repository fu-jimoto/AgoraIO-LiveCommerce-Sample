var videoEnable  = true;
var audioEnable  = true;
var client,camera, microphone;
var audioSelect, videoSelect;
var localTracks = {
    audioTrack: null,
    videoTrack: null
};

AgoraRTC.enableLogUpload();

async function join() {

    client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    client.setClientRole("host");

    camera      = videoSource.value;
    microphone  = audioSource.value;

    [ uid, localTracks.audioTrack, localTracks.videoTrack ] = await Promise.all([
        client.join(appId, channelName, null, gUid),
        AgoraRTC.createMicrophoneAudioTrack({microphoneId: microphone}),
        AgoraRTC.createCameraVideoTrack({cameraId: camera,encoderConfig:videoProfile})
    ]);
    localTracks.videoTrack.play('agora_local',{fit: 'cover'});
}

function getDevices() {
    AgoraRTC.getDevices().then(devices => {
        for (var i = 0; i !== devices.length; ++i) {
            var device = devices[i];
            var option = document.createElement('option');
            option.value = device.deviceId;
            if (device.kind === 'audioinput') {
                option.text = device.label || 'microphone ' + (audioSelect.length + 1);
                audioSelect.appendChild(option);
            } else if (device.kind === 'videoinput') {
                option.text = device.label || 'camera ' + (videoSelect.length + 1);
                videoSelect.appendChild(option);
            } else {
                console.log('Some other kind of source/device: ', device);
            }
        }
    });
}

async function publish(){
    await client.publish(Object.values(localTracks));
    console.log("Publish local stream successfully");
    viewControl(ON_LINE);
    $.ajax(STATUS_CHANGE_URL+"?live_id="+liveId+"&status="+liveStatusList.open,
    {
        type: 'get',
    }).done(function(data){
    }
    ).fail(function() {
    });
}

function leave() {

    client.leave(function () {
        console.log("Leavel channel successfully");
        $.ajax(STATUS_CHANGE_URL+"?live_id="+liveId+"&status="+liveStatusList.close,
        {
            type: 'get'
        }
        ).done(function(data){
            location.href = "end.html";
        }
        ).fail(function() {
        });
    }, function (err) {
        console.log("Leave channel failed");
    });
}

function videoMute() {
    if(videoEnable == true){
        localTracks.videoTrack.setMuted(true);
        $("#video_mute").text("Video OFF");
        videoEnable = false;
    }else{
        localTracks.videoTrack.setMuted(false);
        $("#video_mute").text("Video ON");
        videoEnable = true;
    }
}

function audioMute() {
    if(audioEnable == true){
        localTracks.audioTrack.setMuted(true);
        $("#audio_mute").text("Audio OFF");
        audioEnable = false;
    }else{
        localTracks.audioTrack.setMuted(false);
        $("#audio_mute").text("Audio ON");
        audioEnable = true;
    }
}

async function changeDevice(){
    audioSelect = document.querySelector('select#audioSource');
    videoSelect = document.querySelector('select#videoSource');
    camera     = videoSource.value;
    microphone = audioSource.value;
    await client.unpublish(Object.values(localTracks));
    await localTracks.videoTrack.stop();
    await localTracks.videoTrack.close();

    [ localTracks.audioTrack, localTracks.videoTrack ] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack({microphoneId: microphone}),
        AgoraRTC.createCameraVideoTrack({cameraId: camera,encoderConfig:videoProfile})
    ]);
    localTracks.videoTrack.play('agora_local',{fit: 'cover'});
    
    await client.publish(Object.values(localTracks));
    console.log("publish success");

}
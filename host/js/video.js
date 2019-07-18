var videoEnable  = true;
var audioEnable  = true;
var client, localStream, camera, microphone;
var audioSelect, videoSelect;

AgoraRTC.Logger.enableLogUpload();

function join() {
    var channel_key = null;
    client = AgoraRTC.createClient({mode: 'live', codec:'vp8'});
    client.init(appId, function () {
      client.join(channel_key, channelName, gUid, function(uid) {
          console.log("User " + uid + " join channel successfully");
          camera      = videoSource.value;
          microphone  = audioSource.value;
          localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: camera, microphoneId: microphone, video: true, screen: false});
          localStream.setVideoProfile(videoProfile);
          localStream.on("accessAllowed", function() {
              console.log("accessAllowed");
          });
          localStream.on("accessDenied", function() {
            console.log("accessDenied");
          });
          localStream.init(function() {
            console.log("getUserMedia successfully");
            localStream.play('agora_local',{fit: 'cover'});
          }, function (err) {
            console.log("getUserMedia failed", err);
          });
        
      }, function(err) {
        console.log("Join channel failed", err);
      });
    }, function (err) {
      console.log("AgoraRTC client init failed", err);
    });
    channelKey = "";
    client.on('error', function(err) {
      console.log("Got error msg:", err.reason);
    });
    client.on('peer-leave', function (evt) {
      console.log(evt.uid + " leaved from this channel");
    });
}

function getDevices() {
    AgoraRTC.getDevices(function (devices) {
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

function publish(){
    client.publish(localStream, function (err) {
      console.log("Publish local stream error: " + err);
    });
    client.on('stream-published', function (evt) {
        console.log("Publish local stream successfully");
        viewControl(ON_LINE);
        $.ajax(STATUS_CHANGE_URL+"?live_id="+liveId+"&status="+liveStatusList.open,
        {
            type: 'get',
        }).done(function(data){
        }
        ).fail(function() {
        });
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
        localStream.disableVideo();
        $("#video_mute").text("Video OFF");
        videoEnable = false;
    }else{
        localStream.enableVideo();
        $("#video_mute").text("Video ON");
        videoEnable = true;
    }
}

function audioMute() {
    if(audioEnable == true){
        localStream.disableAudio();
        $("#audio_mute").text("Audio OFF");
        audioEnable = false;
    }else{
        localStream.enableAudio();
        $("#audio_mute").text("Audio ON");
        audioEnable = true;
    }
}

function changeDevice(){
    audioSelect = document.querySelector('select#audioSource');
    videoSelect = document.querySelector('select#videoSource');
    camera     = videoSource.value;
    microphone = audioSource.value;
    var localStream2 = AgoraRTC.createStream({streamID: gUid, audio: true, cameraId: camera, microphoneId: microphone, video: true, screen: false});
    localStream2.setVideoProfile(videoProfile);
    localStream2.init(function(){
        var newVideoTrack = localStream2.getVideoTrack();
        localStream.replaceTrack(newVideoTrack);
    });
}
function loadSetting(){
    liveId = getParam('id');
    $.ajax(GET_COUNT_URL+"?live_id="+liveId,
    {
        type: 'get',
        dataType: 'json'
    })
    .done(function(data){
        if(data.status==liveStatusList.close){
            location.href = "end.html";
        }
        channelName = baseChannelName+liveId;
        getLiveInformation();
        setInterval(getLiveInformation, getCountInfoInt);
        setInterval(putLiveCount,putCountInfoInt);
        audioSelect = document.querySelector('select#audioSource');
        videoSelect = document.querySelector('select#videoSource');

        viewControl(OFF_LINE);
        join();
        getDevices();
        loginToSignaling();
    })
    .fail(function() {
    });
}

function viewControl(status){
    switch(status){
        case ON_LINE:
            document.getElementById("publish").disabled    = true;
            document.getElementById("leave").disabled      = false;
            document.getElementById("video_mute").disabled = false;
            document.getElementById("audio_mute").disabled = false;
            break;
        case OFF_LINE:
            document.getElementById("publish").disabled      = false;
            document.getElementById("leave").disabled        = true;
            document.getElementById("video_mute").disabled   = true;
            document.getElementById("audio_mute").disabled   = true;
            document.getElementById("changeDevice").disabled = false;
            break;
    }
}

var getLiveInformation = function(){
    liveId = getParam('id');
    $.ajax(GET_COUNT_URL+"?live_id="+liveId,
    {
        type: 'get',
        dataType: 'json'
    })
    .done(function(data){
        if(data.status==liveStatusList.close){
            location.href = "end.html";
        }
        var str = "[ Heart : "+data.heart_count+" | View : "+data.view_count+" ]";
        document.getElementById("count_information").innerHTML = str;
    })
    .fail(function() {
    });
}

var putLiveCount = function(){
    liveId = getParam('id');
    $.ajax(COUNT_UP_URL+"?live_id="+liveId+"&type="+countTypeList.session,
    {
        type: 'get',
        dataType: 'json'
    })
    .done(function(data){
    })
    .fail(function() {
    });
}

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
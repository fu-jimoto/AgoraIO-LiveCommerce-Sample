var getDevice = (function(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'sp';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return 'tab';
    }else{
        return 'other';
    }
})();

function loadSetting(init=false){

    nickName = localStorage.getItem("nickName");
    var enableChatView = document.querySelector("#enableChatView");
    var disabeleChatView = document.querySelector("#disabeleChatView");
    if(nickName){
        enableChatView.style.display   = "block";
        disabeleChatView.style.display = "none";
    }else{
        enableChatView.style.display   = "none";
        disabeleChatView.style.display = "block";
    }

    if(init){

        liveId = getParam('id');
        $.ajax(GET_COUNT_URL+"?live_id="+liveId,
        {
            type: 'get',
            dataType: 'json'
        })
        .done(function(data){
            console.log(logTag+":%o",data);
            if(data.status == liveStatusList.close){
                location.href = "end.html";
            }
            channelName = baseChannelName+liveId;
            getLiveInformation();
            setInterval(getLiveInformation, getCountInfoInt);
            join();
            loginToSignaling();
        })
        .fail(function() {
        });
    }
}

function setNickName(){
    if($('#nickName').val() && $('#nickName').val().length <= 20){
        nickName = escapeHTML($('#nickName').val());
        localStorage.setItem("nickName",nickName);
        loadSetting();
    }
}

function editNickName(){
    localStorage.setItem("nickName","");
    loadSetting();
}

function sendHeart(){

    $.ajax(COUNT_UP_URL+"?type="+countTypeList.heart+"&live_id="+liveId,
    {
        type: 'get'
    })
    .done(function(data){
    })
    .fail(function() {
    });

    $("#heart").fadeOut(3000,dispHeart).animate({
        'top': '-500px'
    },{
        duration: 2000,
        queue: false
    });
}

function dispHeart(){
    $("#heart").css('top','0px');
    $("#heart").fadeIn(1000);
}

var getLiveInformation = function(){
    $.ajax(GET_COUNT_URL+"?live_id="+liveId,
    {
        type: 'get',
        dataType: 'json'
    }
    )
    .done(function(data){
        console.log(logTag+":%o",data);
        if(data.status == liveStatusList.close){
            location.href = "end.html";
        }
        var str="View :"+data.view_count+"<br />Heart:"+data.heart_count;
        document.getElementById("infomationPannelChild").innerHTML = str;
    })
    .fail(function() {
    });
}

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
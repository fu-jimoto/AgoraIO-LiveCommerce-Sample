var signal = Signal(appId);
var session, channel, call, g_uid;

function loginToSignaling() {
    var account = createRandomString();
    session = signal.login(account,"_no_need_token");
    session.onLoginSuccess = function(uid){
        console.log("login success");
        channel = session.channelJoin(channelName);
        channel.onMessageChannelReceive = function(account, uid, msg){
            var data = JSON.parse(msg);
            $('div#chatBox').append('<div class="comment">'+data.nickName+':'+data.message+'</div>');
            $('div#chatBox').animate({scrollTop: $('div#chatBox')[0].scrollHeight}, 'fast');
        }
    };
    session.onLoginFailed = function(ecode){
        console.log('login failed ' + ecode);
    };
}

function createRandomString(){
    var l = 8;
    var c = "abcdefghijklmnopqrstuvwxyz";
    var cl = c.length;
    var r = "";
    for(var i=0; i<l; i++){
        r += c[Math.floor(Math.random()*cl)];
    }
    return r;
}

function sendMessage(){
    if($('#message').val() && $('#message').val().length <= 100 && nickName){
        var str = escapeHTML($('#message').val());
        var data = JSON.stringify({"nickName":nickName, "message":str});
        channel.messageChannelSend(data, function(){});
        postChat(nickName, str);
        $('#message').val("");            
    }
}

function escapeHTML(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#39;');
    return str;
 }

 function postChat(nickName,message){

    $.ajax({
        url: POST_CHAT_URL,
        type: 'post', 
        dataType: 'json',
        data: {
            live_id: liveId,
            name: nickName,
            comment: message,
            is_audience: 1
        },
    })
    .done(function (response) {
    })
    .fail(function () {
    });
}
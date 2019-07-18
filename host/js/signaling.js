var signal = Signal(appId);
var session, channel, call;


function loginToSignaling(){
    session = signal.login(sigHostAccount,"_no_need_token");
    session.dbg = sigDebug;
    session.onLoginSuccess = function(uid){
        console.log('login success ' + uid);
        channel = session.channelJoin(channelName);
        channel.onMessageChannelReceive = function(account, uid, msg){
            var data = JSON.parse(msg);
            $('div#chatBox').append('<div class="comment">'+data.nickName+':'+data.message+'</div>');
            $('#chatBox').animate({scrollTop: $('#chatBox')[0].scrollHeight}, 'fast');
        }
    };
    session.onLoginFailed = function(ecode){
        console.log('login failed ' + ecode);
    };
}

function sendMessage(){
    if($('#message').val() && $('#message').val().length <= 100){
      var str = escapeHTML($('#message').val());
      var data = JSON.stringify({"nickName":HOST_NICKNAME, "message":str});
      channel.messageChannelSend(data, function(){});
      postChat(HOST_NICKNAME,str);
      $('#message').val("");            
    }
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
            is_audience: 0
        },
    })
    .done(function (response) {
    })
    .fail(function () {
    });
}

function escapeHTML(str) {
   str = str.replace(/&/g, '&amp;');
   str = str.replace(/</g, '&lt;');
   str = str.replace(/>/g, '&gt;');
   str = str.replace(/"/g, '&quot;');
   str = str.replace(/'/g, '&#39;');
   return str;
}
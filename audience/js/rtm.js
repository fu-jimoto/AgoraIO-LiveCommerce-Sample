var rtm = AgoraRTM.createInstance(appId);
var rtmChannel;

async function loginToRTM() {
    var account = createRandomString();
    await rtm.login({ token: '', uid: account }).then(() => {
        console.log('AgoraRTM client login success');
        //rtm channel
        rtmChannel = rtm.createChannel(channelName);
        rtmChannel.join().then(()=>{
            console.log("RTM Join Channel Success");
            rtmChannel.on('ChannelMessage', function (message, memberId) {
                console.log("Get channel message:"+memberId);
                console.dir(message);
                var data = JSON.parse(message.text);
                $('div#chatBox').append('<div class="comment">'+data.nickName+':'+data.message+'</div>');
                $('#chatBox').animate({scrollTop: $('#chatBox')[0].scrollHeight}, 'fast');
            });
        });
    }).catch(err => {
        console.log('AgoraRTM client login failure', err);
    });
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

async function sendMessage(){
    if($('#message').val() && $('#message').val().length <= 100 && nickName){
        var str = escapeHTML($('#message').val());
        var data = JSON.stringify({"nickName":nickName, "message":str});
        rtmChannel.sendMessage({text: data});
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
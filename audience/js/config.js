var appId           = "YOUR APP ID";
var liveId;
var baseChannelName = "livecommerce";
var channelName;
var gUid;
var sigHostAccount  = "audience";
var sigDebug        = true;
var nickName        = "";
var getCountInfoInt = 10*1000;
var logTag          = "#VCUBE";
var BASE_URL        = "http://YOUR_HOST";
var GET_COUNT_URL   = BASE_URL+"/api/get_live_info.php";
var COUNT_UP_URL    = BASE_URL+"/api/put_live_count.php";
var POST_CHAT_URL   = BASE_URL+"/api/post_chat.php";
var liveStatusList  = {'befor':1,'open':2,'close':3};
var liveStatus      = liveStatusList.befor;
var countTypeList   = {'view':1,'heart':2,'session':3};


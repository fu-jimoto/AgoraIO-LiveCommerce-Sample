var appId             = "YOUR APP ID";
var liveId;
var baseChannelName   = "livecommerce";
var channelName;
var gUid              = "1000";
var videoProfile      = "720p";
var sigHostAccount    = "host";
var HOST_NICKNAME     = "HOST";
var sigDebug          = true;
var getCountInfoInt   = 10*1000;
var putCountInfoInt   = 60*1000;
var logTag            = "#LC ";
var ON_LINE           = 1;
var OFF_LINE          = 2;
var BASE_URL          = "http://YOUR_HOST";
var GET_COUNT_URL     = BASE_URL+"/api/get_live_info.php";
var STATUS_CHANGE_URL = BASE_URL+"/api/put_live_status.php";
var COUNT_UP_URL      = BASE_URL+"/api/put_live_count.php";
var POST_CHAT_URL     = BASE_URL+"/api/post_chat.php";
var liveStatusList    = {'befor':1,'open':2,'close':3};
var liveStatus        = liveStatusList.befor;
var countTypeList     = {'view':1,'heart':2,'session':3};

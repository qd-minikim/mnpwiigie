var config = require('../config.js')
//对外请求公共方法
function connectSocket(url, paramdata, that, callback) {
  url = url || config.requestUrl;

  var socketTask = wx.connectSocket({
    url: url, //对外地址
    data: paramdata,
    header: {
      'content-type': 'application/json'
    },
    method: 'post',
    success: res => {
       typeof callback == "function" && callback(res)
    },
    fail:err=>{
      // wx.showToast({
      //   title: '网络异常！',
      // })
    }
  })

  return socketTask;

}
 
module.exports = {
  connectSocket: connectSocket,
 
}
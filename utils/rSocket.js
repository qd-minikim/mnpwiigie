//对外请求公共方法
function connectSocket(url, paramdata, that, callback) {
  url = url || config.requestUrl;

  wx.connectSocket({
    url: url, //对外地址
    data: paramdata,
    header: {
      'content-type': 'application/json'
    },
    success: res => {
      typeof callback == "function" && callback(res.data)
    }
  })
}
 
module.exports = {
  connectSocket: connectSocket,
 
}
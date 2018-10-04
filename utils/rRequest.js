 //对外请求公共方法
 function doRequest(url, paramdata, that, callback) {
   url = url || config.requestUrl;
    
   wx.request({
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
function submitRequest(url, paramdata, that, callback) {
  url = url || config.requestUrl;

  wx.request({
    url: url, //对外地址
    data: paramdata,
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    method: 'POST',
    success: res => {
      typeof callback == "function" && callback(res.data)
    }
  })
}
 module.exports = {
   doRequest: doRequest,
   submitRequest: submitRequest,
 }
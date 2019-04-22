var config = require('../config.js')
var rRequest = require('../utils/rRequest.js');
var rCommon = require('../utils/rCommon.js');
var WXBizDataCrypt = require('../utils/WXBizDataCrypt.js');
 
/**获取群信息 */
function getOpenGId(that) {
 
  var objectSocket = wx.getLaunchOptionsSync()
 
  var shareTicket = "";
  if (objectSocket && objectSocket.scene && objectSocket.scene == '1044') { //


   
    shareTicket = objectSocket.shareTicket;
    var appId = that.globalData.loginInfo.appId
    var sessionKey = that.globalData.loginInfo.sessionKey

    wx.getShareInfo({
      shareTicket: shareTicket,
      success: res => {
 
        var pc = new WXBizDataCrypt(appId, sessionKey)

        var data = pc.decryptData(res.encryptedData, res.iv)

        var openGId = data.openGId
         
        that.globalData.openGId = openGId;
        

      }
    })
  }


}
 
module.exports = {
  getOpenGId: getOpenGId,

}
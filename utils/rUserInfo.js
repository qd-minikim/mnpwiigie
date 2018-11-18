var config = require('../config.js')
var rRequest = require('../utils/rRequest.js');
var rCommon = require('../utils/rCommon.js');
var WXBizDataCrypt = require('../utils/WXBizDataCrypt.js')
const app = getApp()
//
function userLogin(that, callback) {
  wx.login({
    success: res => {
      var url = config.loginUrl;
      var data = {
        code: res.code
      }
      rRequest.doRequest(url, data, that, function(rdata) {

        if (rdata.info) {

          app.globalData.loginInfo = rdata.info

          getSettingInfo(that, callback);
          
        }
      })

    }
  })
}

function getSettingInfo(that, callback) { // 查看是否授权
 
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        getUsersInfo(that, callback);


      } else {
        console.log("用户信息未授权--")
        wx.reLaunch({
          url: '/pages/pagewelcome/pagewelcome',
        })

      }
    },
    fail: function (res) {
      console.log("授权失败--")
    },
  })
}

function getUsersInfo(that, callback) {
   
  wx.getUserInfo({
    success: function (res) {

      app.globalData.userWxInfo = res.userInfo;


      var appId = app.globalData.loginInfo.appId
      var sessionKey = app.globalData.loginInfo.sessionKey
      var pc = new WXBizDataCrypt(appId, sessionKey)
      var data = pc.decryptData(res.encryptedData, res.iv)
      var url = config.userInfoUrl;
      var data = {
        miniopenId: data.openId,
        nickname: encodeURIComponent(data.nickName),
        sex: data.gender,
        city: encodeURIComponent(data.city),
        country: encodeURIComponent(data.country),
        province: encodeURIComponent(data.province),
        avatarUrl: data.avatarUrl,
        unionid: data.unionId,
      }
      rRequest.doRequest(url, data, that, function (rdata) {

        if (rdata.info) {
          app.globalData.userInfo = rdata.info;
          app.globalData.userIData = true;
 
          rCommon.userDefAddr.getUserDefAddr(that, rdata.info.id);


          typeof callback == "function" && callback(rdata)

        }


      })

    },
    fail: function (e) {

      console.log("--------fail---------" + e)
    },
    complete: function (e) {

      console.log("--------complete---------")
    }
  })
}

function getUserInfoApp(that, callback){


  if (app.globalData.userWxInfo){

    typeof callback == "function" && callback({})

  }else{
      userLogin(that, function (rdata) {

        typeof callback == "function" && callback(rdata)

    })
 
  }

}
module.exports = {
  getUserInfoApp: getUserInfoApp,
  
}
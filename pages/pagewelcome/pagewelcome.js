// pages/pagewelcome/pagewelcome.js
const app = getApp()
var config = require('../../config.js')
var rRequest = require('../../utils/rRequest.js');
var WXBizDataCrypt = require('../../utils/WXBizDataCrypt.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: app.globalData.systemInfo.windowHeight + 'px',
    backgroundImage: config.imageUrl + '/wiigie/background/bg_1/bg_image.jpg'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.userLogin();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // //先登录
  // userLogin: function() {
  //   var that = this;
  //   wx.login({
  //     success: res => {
  //       var url = config.loginUrl;
  //       var data = {
  //         code: res.code
  //       }
  //       rRequest.doRequest(url, data, that, function(rdata) {

  //         if (rdata.info) {

  //           app.globalData.loginInfo = rdata.info
  //           that.getSettingInfo();
  //         }
  //       })

  //     }
  //   })
  // },


  getSettingInfo: function() { // 查看是否授权
    var that = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          app.getUsersInfo();
        } else {
          console.log("用户信息未授权--")
        }
      },
      fail: function(res) {
        console.log("授权失败--")
      },
    })
  },


  /** 自定事件*/

  setAuthInfo: function(e) {

    var that = this;

    if (e.detail.userInfo) {
      // console.log('授权通过')
      app.getUsersInfo();
    } else {
      ///console.log('拒绝授权')
      wx.reLaunch({ ///pages/pagehome/pagehome
        url: '/page/component/pages/pageauth/pageauth',
      })
    }
  }
})
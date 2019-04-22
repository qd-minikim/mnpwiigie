// page/component/pages/pagegift/giftinform/giftinform.js 
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUserInfo = require('../../../../../utils/rUserInfo.js');
var rUtils = require('../../../../../utils/rUtils.js');
const app = getApp()
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    giftRecordId: '',
    fromUserId: '',
    checkStatus: {
      isOrder: '',
      downtimes: 3,
      welcomeMsg: '',
    },
    initdowntime: 3,
    windowHeight: 0,

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false, 
    userIData: false,
    // userWxInfo: {}, 
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(options) {

    let that = this
    var giftRecordId = options.gr;
    var fromUserId = options.fu;
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    that.setData({
      giftRecordId: giftRecordId,
      fromUserId: fromUserId,
    })


    var url = "/page/component/pages/pagegift/giftinform/giftinform?gr=" + giftRecordId + "&fu=" + fromUserId

    wx.setStorage({
      key: "cardpage",
      data: url,
    })

    // if (app.globalData.userWxInfo) { 
    if (app.globalData.userIData) {
      that.setData({
        // userWxInfo: app.globalData.userWxInfo, 
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })

      that.checkGiftRecord()

    } else {
      rUserInfo.getUserInfoApp(that, function(rdata) {
        // if (app.globalData.userWxInfo) { 
        if (app.globalData.userIData) {
          that.setData({
            // userWxInfo: app.globalData.userWxInfo, 
            userIData: app.globalData.userIData,
            userInfo: app.globalData.userInfo,
          })
          that.checkGiftRecord()
        }

      })

    }
    wx.hideShareMenu();
  },

  /** 
   * 生命周期函数--监听页面初次渲染完成 
   */
  onReady: function() {
    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight
 
    this.setData({
      'windowHeight': windowHeight,


    })
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
  checkGiftRecord: function() {
    var that = this;


    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820 
    var giftRecordId = that.data.giftRecordId
    var fromUserId = that.data.fromUserId

    var data = {
      code_: 'x_checkGiftRecord',
      giftrecordid: giftRecordId,
      fromUserId: fromUserId,
      userId: userid,

    }

    rRequest.doRequest(url, data, that, function(rdata) {
      wx.hideLoading();
      if (rdata.info) {

        var isOrder = rdata.info.isOrder
        var pagestatus = rdata.info.pagestatus
        that.setData({
          'checkStatus.isOrder': isOrder,
          'checkStatus.downtimes': that.data.initdowntime,
          'checkStatus.welcomeMsg': rdata.info.welcomeMsg
        })
        if (isOrder == '0') { //0不是下单人  1 是下单人  2 是送出人
          rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

            if (pagestatus == '1') {
              wx.redirectTo({
                url: '/page/component/pages/pagegift/giftreceive/giftreceive?gr=' + giftRecordId + '&fu=' + fromUserId,
              })

            } else if (pagestatus == '2') {
              wx.redirectTo({
                url: '/page/component/pages/pagegift/giftreceivefail/giftreceivefail?gr=' + giftRecordId,
              })

            } else if (pagestatus == '3') {
              wx.redirectTo({
                url: '/page/component/pages/pagegift/giftreceivesucc/giftreceivesucc?gr=' + giftRecordId,
              })

            }


          })

        }
        if (isOrder == '2') { //0不是下单人  1 是下单人 2 是送出人
          rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

            // wx.redirectTo({
            //   url: '/page/component/pages/pagegift/giftreceive/giftreceive?gr=' + rdata.info.oldgift.id + '&fu=' + rdata.info.oldgift.from_person,
            // })

            wx.redirectTo({
              url: '/page/component/pages/pagegift/giftreceivesucc/giftreceivesucc?gr=' + rdata.info.oldgift.id,
            })
          })

        }
        if (isOrder == '1') {
          rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

            wx.redirectTo({
              url: '/page/component/pages/pagegift/giftgivesucc/giftgivesucc?gr=' + giftRecordId,
            })
          })

        }


      }

    })


  }
})
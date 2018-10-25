// page/component/pages/pagegift/giftaddr/giftaddr.js

var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},

    /**用户默认地址 */
    userDefAddr: null,
    /**收礼信息 */
    giftData: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    if (app.globalData.userWxInfo) {
      that.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    that.setData({
      giftData: app.globalData.giftData,
    })


    /** */
    wx.getStorage({
      key: 'userDefAddr',
      success: function(res) {
        if (res.data) {
          that.setData({
            userDefAddr: res.data
          })
        }

      },
    })

    //需要判断是否是自购，还是 送礼

    // that.getUserDefAddr() //x_getDefAddr
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
    var that = this;
    wx.getStorage({
      key: 'userDefAddr',
      success: function(res) {
        if (res.data) {
          that.setData({
            userDefAddr: res.data
          })
        }

      },
    })
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
  selectUserAddr: function(event) {

    wx.navigateTo({
      url: '/page/component/pages/pageaddr/addrlist/addrlist',
    })

  },
  acceptgift: function() {

    var that = this;
    wx.showModal({
      title: '提示',
      content: '收礼后表示您已接收该礼品，将会向您提供的地址进行发货',
      success: function (res) {

        if (res.confirm) {
          var url = config.requestUrl;


          var addressInfo = {
            mobile_phone: that.data.userDefAddr.phone, //服务类型
            address: encodeURIComponent(that.data.userDefAddr.address),
            addressHouse: encodeURIComponent(that.data.userDefAddr.addressHouse),
            city: that.data.userDefAddr.city,
            province: that.data.userDefAddr.province,
            district: that.data.userDefAddr.district,
            phone: that.data.userDefAddr.phone,
            orderUsername: encodeURIComponent(that.data.userDefAddr.orderUsername),
          }

          var buyId = that.data.giftData.buyId;
          var userid = that.data.userInfo.id;
          var giftRecordId = that.data.giftData.giftRecordId;
          var fUserId = that.data.giftData.fUserId;
          var newGiftRecordId = that.data.giftData.newGiftRecordId;
          var tUserId = that.data.giftData.tUserId;
          var oper = that.data.giftData.operd;
          var data = {
            code_: 'x_doAccept',
            "buyId": buyId,
            "userId": userid,
            "processStatus": '23',
            "giftRecordId": giftRecordId,
            "fUserId": fUserId,
            "newGiftRecordId": newGiftRecordId,
            "tUserId": tUserId

          }

          var recegiftInfo = Object.assign(data, addressInfo);



          rRequest.doRequest(url, recegiftInfo, that, function(rdata) {

            wx.showToast({
              title: '收礼成功',
              image: '/image/icon_ok.png',
              duration: 2000,
              success: function() {}
            })
            setTimeout(function() {

              wx.redirectTo({
                url: '/page/component/pages/pagegift/giftreceivesucc/giftreceivesucc?gr=' + giftRecordId + '&t=' + oper,
              })

            }, 1500)


          })
        } else if (res.cancel) {

        }




      }
    })
  },

})
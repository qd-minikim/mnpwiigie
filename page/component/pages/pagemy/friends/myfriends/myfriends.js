// page/component/pages/pagemy/friends/myfriends/myfriends.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    myFriends: [],
    itemsPerPage: 10,
    endRow: 0,
    allRows: 0,

    scrollHeight: 0,
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    this.getMyFriends()
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var scrollHeight = windowHeight - 100 * percent
    this.setData({

      scrollHeight: scrollHeight + "px",

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    try {
      var value = wx.getStorageSync('refresh')

      if (value && value == '1') {

        that.getMyFriends()

      }
    } catch (e) {

    }
    wx.setStorage({
      key: "refresh",
      data: "0",
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
  getMyFriends: function() {
    let that = this;


    var url = config.requestUrl;
    var userid = that.data.userInfo.id//
    var data = {
      code_: 'x_getMyFriends',
      userid: userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {
        that.setData({
          myFriends: rdata.infolist,
          allRows: rdata.infocounts,
        })


      }

    })
  },
  friendset: function(e) {
    var friendid = e.currentTarget.dataset.friendid;


    wx.navigateTo({
      url: '/page/component/pages/pagemy/friends/friendset/friendset?f=' + friendid,
    })

  }
})
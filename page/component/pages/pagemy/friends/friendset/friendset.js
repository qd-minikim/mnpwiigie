// page/component/pages/pagemy/friends/friendset/friendset.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendid: '',
    initFriendInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var friendid = options.f;

    this.setData({

      friendid: friendid
    })
    this.initFriendSet();
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  initFriendSet: function() {
    var that = this;


    var url = config.requestUrl;
    var friendid = that.data.friendid
    var data = {
      code_: 'x_initFriendSet',
      id: friendid
    }
    rRequest.doRequest(url, data, that, function(rdata) {
  
      if (rdata.info) {

        that.setData({
          initFriendInfo: rdata.info
        })
      }


    })

  },

  uppFriendSet: function(e) {

    var that = this;


    var url = config.requestUrl;
    var friendid = that.data.friendid

    var lx = e.currentTarget.dataset.lx;
    var value = e.detail.value;

    var closeFriend = '-1';
    var closeOwn = '-1';
    if (lx == 'closeown') {
      if (value) {
        closeOwn = '1';

      } else {
        closeOwn = '0';

      }
    }
    if (lx == 'closefriend') {
      if (value) {
        closeFriend = '1';

      } else {
        closeFriend = '0';

      }
    }
 
    var data = {
      code_: 'x_uppFriendSet',
      id: friendid,
      close_friend: closeFriend,
      close_own: closeOwn,

    }

    rRequest.doRequest(url, data, that, function(rdata) {
   
        // if (lx == 'closeown') {
        //   that.setData({
        //     'initFriendInfo.close_own': closeOwn
        //   })
        // }

        // if (lx == 'closefriend') {
        //   that.setData({
        //     'initFriendInfo.close_friend': closeFriend
        //   })
        // }
      wx.setStorage({
        key: "refresh",
        data: "1",
      })
 
    })

  }
})
// page/component/pages/pageinform/notice/summarypage/summarypage.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rUserInfo = require('../../../../../../utils/rUserInfo.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {


    sumNotices: [],
    selected: false,

    endRow: 0,
    itemsPerPage: 10,

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},

    clickIndex: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (app.globalData.userIData) {
      that.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })

      that.getSumNotices()
    } else {

      rUserInfo.getUserInfoApp(that, function(rdata) {

        if (app.globalData.userIData) {
          that.setData({
            // userWxInfo: app.globalData.userWxInfo,
            userIData: app.globalData.userIData,
            userInfo: app.globalData.userInfo,
          })
          that.getSumNotices()
        }

      })
    }

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
    let that = this
    var clickIndex = this.data.clickIndex;

    if (clickIndex != '-1') {
      var sumNotices = this.data.sumNotices;
      sumNotices[clickIndex].no_read_num = 0;

      that.setData({
        sumNotices: sumNotices
      })

      try {
        var value = wx.getStorageSync('refresh')

        if (value && value == '1') {
          sumNotices.splice(clickIndex, 1);
          that.setData({
            sumNotices: sumNotices
          })
        }
      } catch (e) {

      }
      wx.setStorage({
        key: "refresh",
        data: "0",
      })

    }



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

  getSumNotices: function() {


    let that = this;

    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820
    var data = {
      code_: 'x_getSumNotices',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        that.setData({
          sumNotices: rdata.infolist,
          selected: true,
        })
      }
      wx.hideLoading();

    })
  },
  notices: function(e) {
    var ns = e.currentTarget.dataset.noticessumid;
    var nt = e.currentTarget.dataset.noticessumtype;

    var clickIndex = e.currentTarget.dataset.idex;
    this.setData({
      clickIndex: clickIndex
    })

    wx.navigateTo({
      url: '/page/component/pages/pageinform/notice/detailpage/detailpage?ns=' + ns + '&nt=' + nt,
    })
  }
})
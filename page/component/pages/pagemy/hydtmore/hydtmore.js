// page/component/pages/pagemy/hydtmore/hydtmore.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');

var WxParse = require('../../../../../wxParse/wxParse.js');

var pagehydt = require('../../../../common/pages/pagehydt/pagehydt.js');
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

    // 好友动态
    home5Array: [],
    home5Count: 0,
    home5Selected: false,
    home5endRow: 0,
    itemsPerPage: 10,


    //是否下拉刷新
    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
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
    this.getFriendsActive()
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

    //wx.showNavigationBarLoading();
    this.setData({
      home5endRow: '0',
      home5Count: '0',
      isPullDownRefresh: true
    })
    this.getFriendsActive()
    

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      isReachBottom: true
    })
    this.getFriendsActive()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //好友动态-详情

  hydtShowDetail: function(event) {
    let that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;
    var userid = that.data.userInfo.id;
    pagehydt.pageHydt.showDetail(upmarkid, requirementid, userid);


  },
  //获取好友动态
  getFriendsActive: function() {


    let that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;

    var url = config.requestUrl;
    var usreId = that.data.userInfo.id

    var endRow = that.data.home5endRow
    var itemsPerPage = that.data.itemsPerPage
    var home5Count = that.data.home5Count
    var data = {
      code_: 'x_getHome4',
      homepageid: 'homepage_4',
      userid: usreId,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      windowWidth: app.globalData.systemInfo.windowWidth
    }
    if (isReachBottom && home5Count == endRow) {

      that.setData({
        isReachBottom: false,
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
        success: function() {}
      })
      return
    }


    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        var home5Array = [];

        if (isPullDownRefresh) {
          home5Array = [];

          wx.stopPullDownRefresh();
        }
        if (isReachBottom) {
          home5Array = that.data.home5Array;
        }
        var home5ArrayNew = [...home5Array, ...rdata.infolist]

        that.setData({
          home5Array: home5ArrayNew,
          home5Selected: true,
          home5Count: rdata.infocounts,
          home5endRow: rdata.endRow,
          isPullDownRefresh: false,
          isReachBottom: false,
        })

        var actiontyArr = [];

        for (let i = 0; i < home5ArrayNew.length; i++) {
          actiontyArr.push(home5ArrayNew[i].actiontypename);
        }

        for (let i = 0; i < actiontyArr.length; i++) {
          WxParse.wxParse('actionty' + i, 'html', actiontyArr[i], that);
          if (i === actiontyArr.length - 1) {
            WxParse.wxParseTemArray("actiontyTemArray", 'actionty', actiontyArr.length, that)
          }
        }

      }


      wx.hideLoading();
    })


  },
})
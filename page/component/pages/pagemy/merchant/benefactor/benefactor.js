// page/component/pages/pagemy/merchant/benefactor/benefactor.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    benefactors: [],
    itemsPerPage: 15,
    endRow: 0,
    allRows: 0,

    selected: false,

    scrollHeight: 0,
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},

    pcuserid: '',

    //是否下拉刷新
    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pcuserid = options.pu;

    this.setData({

      pcuserid: pcuserid
    })
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    this.getBenefactors()
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
    this.setData({
      endRow: '0',
      allRows: '0',
      isPullDownRefresh: true
    })
    this.getBenefactors();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  scroll: function(e) {

  },

  upper: function(e) {

  },
  lower: function(e) {
    this.setData({
      isReachBottom: true
    })
    this.getBenefactors()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getBenefactors: function() {
    var that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;


    var url = config.requestUrl;
    var userid = that.data.userInfo.id//
    var pcuserid = that.data.pcuserid
    var endRow = that.data.endRow
    var allRows = that.data.allRows
    var itemsPerPage = that.data.itemsPerPage
    var data = {
      code_: 'x_getBenefactors',
      userid: userid,
      pcuserid: pcuserid,
      endRow: endRow,
      itemsPerPage: itemsPerPage
    }

    if (isReachBottom && allRows == endRow) {

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


        var benefactors = [];
        if (isPullDownRefresh) {
          benefactors = [];

          wx.stopPullDownRefresh();
        }
        if (isReachBottom) {
          benefactors = that.data.benefactors;
        }
        var benefactorsNew = [...benefactors, ...rdata.infolist]

        that.setData({
          benefactors: benefactorsNew,
          allRows: rdata.infocounts,
          endRow: rdata.endRow,
          selected: true,
          isPullDownRefresh: false,
          isReachBottom: false,
        })


      }
      wx.hideLoading();
    })

  }
})
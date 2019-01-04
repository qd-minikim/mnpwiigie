// page/component/pages/pagemy/myrefund/detailpage/detailpage.js

var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rCommon = require('../../../../../../utils/rCommon.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    refundArray: [],
    refundSelected: false,
    itemsPerPage: 20,
    endRow: 0,
    allRows: 0,

    refundtype: '',
    orderrefundid: '',
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},

    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,


    minheight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    if (app.globalData.userIData) {
      that.setData({
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }

    var refundtype = options.t;
    if (refundtype) {

      that.setData({
        refundtype: refundtype
      })
    }
    var orderrefundid = options.rfid;
    if (orderrefundid) {

      that.setData({
        orderrefundid: orderrefundid
      })
    }

    if (refundtype == '') {

      wx.setNavigationBarTitle({
        title: '友托帮-总返款额',
      })
    }
    if (refundtype == '0') {

      wx.setNavigationBarTitle({
        title: '友托帮-未返款额',
      })
    }
    if (refundtype == '1') {

      wx.setNavigationBarTitle({
        title: '友托帮-已返款额',
      })
    }
    that.getRefundList();

    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight

    var percent = windowWidth / 750

    this.setData({
      'minheight': windowHeight,


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
    this.getRefundList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var isReachBottom = this.data.isReachBottom;

    if (isReachBottom) {

    } else {

      this.setData({
        isReachBottom: true
      })
      this.getRefundList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getRefundList: function() {
 
    var that = this;

    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;


    var refundtype = that.data.refundtype;
    var orderrefundid = that.data.orderrefundid;



    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;
 


    if (isReachBottom) {
      that.setData({
        isReachBottom: false,
      })
      if (allRows == endRow) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 1500,
          success: function() {}
        })
        return false
      }

    } else {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
    }

    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820
    var data = {
      code_: 'x_getRefundList',
      refundtype: refundtype,
      orderrefundid: orderrefundid,
      endRow: endRow,
      itemsPerPage: itemsPerPage
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        var refundArray = [];
        var refundArrayNew = [];
        if (isPullDownRefresh) {
          refundArray = [];

          wx.stopPullDownRefresh();
        }
        if (isReachBottom) {
          refundArray = that.data.refundArray;

        }

        refundArrayNew = refundArray.concat(rdata.infolist);

        that.setData({

          refundArray: refundArrayNew,

          refundSelected: true,
          allRows: rdata.infocounts,
          endRow: rdata.endRow,
          isPullDownRefresh: false,
          isReachBottom: false,
        })


        wx.hideLoading();
      }
 
    })


  }
})
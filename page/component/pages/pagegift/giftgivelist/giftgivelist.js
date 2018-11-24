// page/component/pages/pagegift/giftgivelist/giftgivelist.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftgivelist:null,
    searched:false,
    itemsPerPage: 10,
    endRow: 0,
    allRows: 0,

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},

    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
    isRefresh: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    this.getGiftGiveListInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var isReachBottom = this.data.isReachBottom;

    if (isReachBottom) {

    } else {

      this.setData({
        isReachBottom: true
      })
      this.getGiftGiveListInfo();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getGiftGiveListInfo: function () {

    let that = this
    var userid =  that.data.userInfo.id
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;
    var isRefresh = that.data.isRefresh;
    var endRow = that.data.endRow;
    var itemsPerPage = that.data.itemsPerPage;
    var allRows = that.data.allRows;
    var url = config.requestUrl

    if (isReachBottom && allRows == endRow) {

      that.setData({
        isReachBottom: false,
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
        success: function () { }
      })
      return false
    }



    var data = {
      code_: 'x_getGiveGiftList',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,

    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    wx.request({
      url: url, //对外地址
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        var rdata = res.data
        if (rdata.infolist) {


          var giftgivelist = [];
          var giftgivelistNew = [];
          if (isPullDownRefresh) {
            giftgivelist = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            giftgivelist = that.data.giftgivelist;

          }

          giftgivelistNew = giftgivelist.concat(rdata.infolist);
 
          that.setData({
            'giftgivelist': giftgivelistNew,
            'endRow': rdata.endRow,
            'allRows': rdata.infocounts,
            'searched': true,
          })
        }

      },
      fail: res => {

      },
      complete: res => {
       
        that.setData({

          isPullDownRefresh: false,
          isReachBottom: false,
          isRefresh: false,
        })
        wx.hideLoading();
      }
    })
 
  },

  showGiftDetail:function(event){
    //window.location.href = "/wiigie/give/giveOrderSucc?gr=" + giftRecordId + "&u=" + userid;
    var id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/page/component/pages/pagegift/giftgivesucc/giftgivesucc?gr=' + id,
      })
   

  }
})
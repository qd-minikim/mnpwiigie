// page/component/pages/pagedialog/dialoglist/dialoglist.js
var rRequest = require('../../../../../utils/rRequest.js');
var config = require('../../../../../config.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requirementId: '',


    dialogList: [],
    searched: false,

    itemsPerPage: 10,
    endRow: 0,
    allRows: 0,

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
    var requirementId = options.r;
    this.setData({
      requirementId: requirementId,
          //  'userInfo.id': '1529295282828524'
    })
    //

    this.getDialogList();
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
    var that = this;
    try {
      var value = wx.getStorageSync('refresh')

      if (value && value == '1') {
 
        that.getDialogList();

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
  getDialogList: function() {
    var that = this;

    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;



    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = that.data.userInfo.id //'1529295282828524' ////

    var requirementId = that.data.requirementId //''//1529296099516208
    var data = {
      code_: 'x_getDialogList',
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      userid: userid,
      "requirementId": requirementId,
    }
    rRequest.doRequest(url, data, that, function(rdata) {


      if (rdata.infolist) {

        that.setData({
          dialogList: rdata.infolist,
          searched: true,
          allRows: rdata.infocounts,
        })
      }
      wx.hideLoading();
    })
  },
  /**客服聊天 */
  dialogpage: function(e) {
    var r = e.currentTarget.dataset.require;
    var dialogId = e.currentTarget.dataset.dialogid;
    /**type = 1:消费者 0：商户 */
    wx.navigateTo({

      url: '/page/component/pages/pagedialog/dialog/dialog?t=0&r=' + r + '&d=' + dialogId,

    })

  },
})
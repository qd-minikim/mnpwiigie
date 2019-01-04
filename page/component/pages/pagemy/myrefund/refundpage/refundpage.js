// page/component/pages/pagemy/myrefund/refundpage/refundpage.js

var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rCommon = require('../../../../../../utils/rCommon.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    myrefundInfo: {},
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},

    isPullDownRefresh: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userIData) {
      this.setData({
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }


     this.getMyrefund();


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

    wx.hideShareMenu();
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
    wx.showLoading({
      title: '正在更新...',
      mask: true,
    })
    this.setData({
  
      isPullDownRefresh: true
    })
    this.getMyrefund();
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

  getMyrefund: function() {

    var that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820
    var data = {
      code_: 'x_getmyrefund',
      userid: userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          myrefundInfo: rdata.info
        })
      }

      wx.hideLoading();

      if (isPullDownRefresh){
        that.setData({
 
          isPullDownRefresh: false,
           
        })
        wx.stopPullDownRefresh();
      }
      

    })

  },


  refunddetail: function(e) {
    var refundtype = e.currentTarget.dataset.rftype; //'' 全部 0 未  1已完成
    var rfid = e.currentTarget.dataset.id; //'' 全部 0 未  1已完成


    wx.navigateTo({
      url: '/page/component/pages/pagemy/myrefund/detailpage/detailpage?t=' + refundtype + '&rfid=' + rfid,
    })

  },

})
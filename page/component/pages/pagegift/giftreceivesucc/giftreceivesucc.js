// page/component/pages/pagegift/giftreceivesucc/giftreceivesucc.js
var config = require('../../../../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftInfo: {
      process: '1',
      coverImage: config.imageUrl + "/wiigie/background/gift/give_gift_result_23.png", //展示的图片路径
      giftSkuImage: '/image/goods-test.jpg'
    },


    /**tabbar */
    pageScrollView: {
      height: app.globalData.systemInfo.windowHeight
    },
    tabbar: {}, //tabbar 信息
    tabbarPage: '/pages/pagemy/pagemy' //当前页面属于哪个tabbar 默认是null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /****调用函数设置tabbar及页面*****/
    app.editTabBar();
   
    /****调用函数设置tabbar及页面*****/

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

  }
})
// page/component/pages/test/testpagexdd/testpagexdd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewData1: [
      '微波 转发了    2018-12-12 12:12:12',
      '赵小米 转发了  2012-12-12 12:12:12',
      '冯段斌 购买了  2012-12-12 12:12:12',
      '冯联通 转发了  2012-12-12 12:12:12',],

    viewData2: [
      '/image/goods_test1.jpg',
      '/image/goods_test2.jpg',
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight
    var screenHeight = res.screenHeight
  
    var percent = windowWidth / 750
    var swiperWidth = windowWidth
    this.setData({

      'swiperWidth': swiperWidth + "px",
      'swiperHeight': swiperWidth + "px",

    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
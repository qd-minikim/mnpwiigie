// page/component/pages/pagexdd/pagexdd.js

var config = require('../../../../config.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requirementInfo:{},

    swiperArea:{
      swiperImgUrls: ['/image/home_swiper_1.jpg', '/image/home_swiper_2.jpg'],
      swiperIndicatorDots: true, //是否显示指示点   
      swiperAutoplay: true, //是否自动切换
      swiperInterval: 2000, //自动切换时间间隔
      swiperDuration: 500, //duration 滑动动画时长
    },


    fixedBottom:{
      oneGridWidth:0,
      twoGridWidth:0,
      gridNums: 8,//下单 送礼 推荐给 占用两个 首页或客服的 空间

      xdClassName:'bottom-xd',
      slClassName: 'bottom-sl',
      tjClassName: 'bottom-tj'
    }
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


    var windowWidth= app.globalData.systemInfo.windowWidth

    var ongGridWidth = windowWidth / this.data.fixedBottom.gridNums

    this.setData({

      oneGridWidth: ongGridWidth+"px" ,
      twoGridWidth: (ongGridWidth * 2) + "px" 
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

  },

  /**获取详情信息 */

  getRequirementInfo:function(){


  }
})
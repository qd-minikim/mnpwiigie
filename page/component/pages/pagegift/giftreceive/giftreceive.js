// page/component/pages/pagegift/giftreceive/giftreceive.js

var config = require('../../../../../config.js');
var rUtils = require('../../../../../utils/rUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    giftInfo:{
      process:'0',
      coverImage: config.imageUrl +"/wiigie/background/gift/give_gift_icon.png",//展示的图片路径
      currentTime:'2018-10-04 21:16:08',
      endTime: '2018-10-04 21:16:12',
    },
    timerDown:{
      day:'00',
      hou:'00',
      min: '00',
      sec: '00',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.getTimerDown()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**倒计时 */
  getTimerDown: function(){
    var that = this;
    var currentTime = that.data.giftInfo.currentTime;
    var endTime = that.data.giftInfo.endTime;
    rUtils.timerDown.countDown(that, currentTime, endTime,function(){

      console.log("结束----")
    });
  }
})

 
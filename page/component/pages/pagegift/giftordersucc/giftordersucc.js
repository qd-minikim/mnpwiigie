// page/component/pages/pagegift/giftordersucc/giftordersucc.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUtils = require('../../../../../utils/rUtils.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftRecordId: '',
    /**下单信息 */
    orderData: {},

    initdowntime: 8,
    downtimes: 8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    let that = this;
    var giftRecordId = options.gr;

    that.setData({
      giftRecordId: giftRecordId
    })
    that.setData({
      orderData: app.globalData.orderData,
    })
    that.autoFunction()
    that.getConfigMsgInfo();
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

  /**继续送礼 */
  continueGift: function() {
    let that = this;
    var giftRecordId = that.data.giftRecordId
    wx.redirectTo({
      url: '/page/component/pages/pagegift/giftgivesucc/giftgivesucc?gr=' + giftRecordId,
    })

  },

  autoFunction: function() {
    let that = this;
    rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "downtimes", function() {

       that.continueGift();
    })
  },


  getConfigMsgInfo: function() {
    let that = this;
    var url = config.requestUrl;
    var buybush =that.data.orderData.buyCash?that.data.orderData.buyCash:0;
    var refund =that.data.orderData.myorderrefound ? that.data.orderData.myorderrefound : 0;
 
    var values = [{
      code: 'GIFTORDERSUCC',
      replace: [{
          regexp: 'buybush',
          replacement: Number(buybush).toFixed(2)
        },
        {
          regexp: 'refund',
          replacement: Number(refund).toFixed(2)
        }
      ]
    }];


    var data = {
      code_: 'x_getConfigMsgInfo',
      /**[{code:xxxx,replace:[{regexp:xxx,replacement:xxxx},{}]},{}] */
      values: values
    }
    rCommon.configMsgInfo.getConfigMsg(url, data, that, function(rdata) {
      if (rdata.info) {

        that.setData({
          configMsgInfo: rdata.info,

        })

      }

    });

  },
})
// page/component/pages/pageorder/ordersucc/ordersucc.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',

    ordersuccinfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    let that = this;
    var orderId = options.o;

    that.setData({
      orderId: orderId
    })

    that.getOrderInfo();


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
  /**获取订单信息 */
  getOrderInfo: function() {
    let that = this;
    let orderId = that.data.orderId;


    var url = config.requestUrl;

    var data = {
      code_: 'x_ordersucc',
      orderid: orderId
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        that.setData({
          ordersuccinfo: rdata.info
        })

        that.getConfigMsgInfo();
      }

    })


  },
  /**继续购买 */
  continueBuy: function(e) {

    var m = e.currentTarget.dataset.upmarkid
    var r = e.currentTarget.dataset.requr
    wx.reLaunch({
        url: '/page/component/pages/pagexdd/pagexdd?m='+m+'&r=' + r,
    })

  },
  /**返回首页 */
  showHome: function() {

    wx.switchTab({
      url: '/pages/pagehome/pagehome',
    })
  },
  getConfigMsgInfo: function () {
    let that = this;
    var url = config.requestUrl;
    var buybush = that.data.ordersuccinfo.buy_cash
    var refund = that.data.ordersuccinfo.refund


    
    var values = [{
      code: 'ORDERSUCC',
      replace: [{ regexp: 'buybush', replacement: Number(buybush).toFixed(2) },
        { regexp: 'refund', replacement: refund }]
    } 
    ];


    var data = {
      code_: 'x_getConfigMsgInfo',
      /**[{code:xxxx,replace:[{regexp:xxx,replacement:xxxx},{}]},{}] */
      values: values
    }
    rCommon.configMsgInfo.getConfigMsg(url, data, that, function (rdata) {
      if (rdata.info) {

        that.setData({
          configMsgInfo: rdata.info,

        })

      }

    });

  },
})
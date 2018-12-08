// page/component/pages/pagemy/waybill/waybill.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    orderid:'',
    wayBillInfo: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var orderid = options.o;
    this.setData({

      orderid: orderid,

    })
    this.getWayBill()

    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var scrollHeight = windowHeight - 150 * percent
    this.setData({

      scrollHeight: scrollHeight + "px",

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
  getWayBill: function() {

    let that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })

    var url = config.requestUrl;

    var orderid =that.data.orderid

    var data = {
      code_: 'x_getWayBill',
      orderid: orderid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        that.setData({
         
          wayBillInfo: rdata.info
        })


      }else{
        that.setData({

          msg: rdata.msg
        })
        
      }

      wx.hideLoading();

    })
  }
})
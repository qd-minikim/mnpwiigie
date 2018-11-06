// page/component/pages/pageorder/ordercancel/ordercancel.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCancelInfo: {},
    orderid: '',

    cancel: '',
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
    var that = this;
    if (app.globalData.userWxInfo) {
      that.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    var orderid = options.o
    that.setData({
      orderid: orderid
    })

    that.getOrderCancel();
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
  radioChange: function(e) {

    // var items = this.data.orderCancelInfo.orderCelCases;
    // for (var i = 0, len = items.length; i < len; ++i) {
    //   items[i].checked = items[i].value == e.detail.value
    // }

    this.setData({
      'cancel': e.detail.value
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getOrderCancel: function() {

    var that = this;

    var url = config.requestUrl;
    var userid = that.data.userInfo.id //that.data.userInfo.id //1528869953018820
    var id = that.data.orderid
    var data = {
      code_: 'x_getOrderCancel',
      id: id,
      userid: userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({

          orderCancelInfo: rdata.info
        })
      }

    })


  },

cancelConfirm:function(){
  var that = this;
  wx.showModal({
    title: '提示',
    content: '确定要取消订单吗？',
    success: function (res) {
      if (res.confirm) {
        that.addOrderCancel()
      }
      else if (res.cancel) {

      }
    }
  })
}

  ,

  addOrderCancel: function() {

    var that = this;

    var url = config.requestUrl;
    var cancel = that.data.cancel


    if (cancel == '') {
      wx.showToast({
        title: '请选择取消原因',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {


        }
      })

      return false;

    }



    var userid = that.data.userInfo.id //that.data.userInfo.id  
    var orderId = that.data.orderid
    var data = {
      code_: 'x_addOrderCancel',
      orderId: orderId,
      cancel: cancel,
      userId: userid,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      wx.setStorage({
        key: "refresh",
        data: "1",
      })
      wx.showToast({
        title: '取消成功',
        image: '/image/icon_ok.png',
        duration: 2000,
        success: function() {


        }
      })
      setTimeout(function() {

        wx.navigateBack({
          delta: 1,
        })

      }, 1500)


    })


  },

})
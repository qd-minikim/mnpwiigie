// page/component/pages/pagemy/customserv/servaddr/servaddr.js

var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companysArray: [],
    index: 0,


    orderid: '',
    serviceid: '',
    initPageInfo: {},

    logisticsNo: '',

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
    var orderid = options.o;
    var serviceid = options.s;
    this.setData({
      orderid: orderid,
      serviceid: serviceid
    })

    this.getInitPage();


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
  bindPickerChange: function(e) {

    this.setData({
      index: e.detail.value
    })
  },

  bindKeyInput: function(event) {

    let that = this;
    var value = event.detail.value;
    this.setData({
      logisticsNo: value
    })

  },
  getInitPage: function() {
    let that = this;

    var url = config.requestUrl;
    var userid = that.data.userInfo.id//
    var orderid = that.data.orderid
    var data = {
      code_: 'x_getCusServAddr',
      orderid: orderid,
      userid: userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        var a = ['选物流公司'];


        that.setData({
          initPageInfo: rdata.info,
          companysArray: a.concat(rdata.info.yxTrackingCompanys)
        })
      }

    })


  },
  addLogistisc: function() {
    let that = this;

    var url = config.requestUrl;
    var index = that.data.index
    var userid = that.data.userInfo.id//
    var logisticsCom = that.data.companysArray[index]
    var logisticsNo = that.data.logisticsNo
    var personAddr = that.data.initPageInfo.addr
    var personName = that.data.initPageInfo.order_username
    var personPhone = that.data.initPageInfo.phone
    var serviceId = that.data.serviceid
    var userName = that.data.initPageInfo.username

    if (index == '0') {

      wx.showToast({
        title: '选物流公司',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {

        }
      })

      return false;
    }
    if (logisticsNo == '') {

      wx.showToast({
        title: '填写物流单号',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function () {

        }
      })

      return false;
    }

    var data = {
      code_: 'x_getCusServAddr',
      logistics_com: encodeURIComponent(logisticsCom),
      logistics_no: encodeURIComponent(logisticsNo),
      personAddr: encodeURIComponent(personAddr),
      personName: encodeURIComponent(personName),
      personPhone: personPhone,
      serviceId: serviceId,
      userid: userid,
      userName: encodeURIComponent(userName)

    }
     
    rRequest.doRequest(url, data, that, function(rdata) {

      wx.showToast({
        title: '提交成功',
        image: '/image/icon_ok.png',
        duration: 2000,
        success: function() {}
      })
      /**缓存 */

      wx.setStorage({
        key: "refresh",
        data: "1",
      })

      setTimeout(function() {
         
        wx.navigateBack({
          delta: 1,
        })

      }, 1500)
    })



  }
})
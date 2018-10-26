// page/component/pages/pagemy/customserv/servdeta/servdeta.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceId: '',

    servdetaInfo: {},//customerServiceInfo,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var serviceId = options.s;
    this.setData({

      serviceId: serviceId,

    })
    this.getServDetaInfo()
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
  /**进度详情 */
  servjdPage: function(event) {
    var serviceId = event.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/customserv/servjd/servjd?s=' + serviceId,
    })

  },
  getServDetaInfo:function(){

    var that = this;
    
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = '1528869953018820'//that.data.userInfo.id//
    var serviceId = that.data.serviceId;
    var data = {
      code_: 'x_getServDeta',
      serviceId: serviceId,
      userId: userid,
    }
    rRequest.doRequest(url, data, that, function (rdata) {


      if(rdata.info){

        that.setData({
          servdetaInfo: rdata.info
        })
      }

      wx.hideLoading();

    })
  }
})
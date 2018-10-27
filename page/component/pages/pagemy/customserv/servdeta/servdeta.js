// page/component/pages/pagemy/customserv/servdeta/servdeta.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootPath: config.imageUrl,
    picsize: 0,
    serviceId: '',

    servdetaInfo: {}, //customerServiceInfo,
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
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var picsize = (windowWidth - 30 * percent) / 6
    var scrollHeight = windowHeight - app.globalData.bottomBtnHeight * percent
    this.setData({

      picsize: picsize,
      scrollHeight: scrollHeight
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    try {
      var value = wx.getStorageSync('refresh')
      var currentTab = that.data.currentTab;

      if (value && value == '1') {

        this.getServDetaInfo()

      }
    } catch (e) {

    }
    wx.setStorage({
      key: "refresh",
      data: "0",
    })


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

  imageYl: function(event) {
    var that = this;
    var rootPath = that.data.rootPath;
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    var imageUrlArry = new Array();
    for (var n = 0; n < imgList.length; n++) {

      var imageUrl = imgList[n].imge_url
      imageUrlArry.push(rootPath + imageUrl)
    }

    //图片预览
    wx.previewImage({
      current: rootPath + src, // 当前显示图片的http链接
      urls: imageUrlArry // 需要预览的图片http链接列表

    })
  },
  /**进度详情 */
  servjdPage: function(event) {
    var serviceId = event.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/customserv/servjd/servjd?s=' + serviceId,
    })

  },
  servaddmore: function(event) {


    var orderId = event.currentTarget.dataset.orderid;
    var serviceId = event.currentTarget.dataset.serviceid;

    wx.navigateTo({
      url: '/page/component/pages/pagemy/customserv/servaddm/servaddm?o=' + orderId + '&s=' + serviceId,
    })
  },
  getServDetaInfo: function() {

    var that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = '1528869953018820' //that.data.userInfo.id//
    var serviceId = that.data.serviceId;
    var data = {
      code_: 'x_getServDeta',
      serviceId: serviceId,
      userId: userid,
    }
    rRequest.doRequest(url, data, that, function(rdata) {


      if (rdata.info) {

        that.setData({
          servdetaInfo: rdata.info
        })
      }

      wx.hideLoading();

    })
  }
})
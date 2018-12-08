// page/component/pages/pagemy/customserv/servjd/servjd.js
 
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    serviceId: '',
    servjdInfo: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var serviceId = options.s;
    this.setData({

      serviceId: serviceId,

    })
    this.getservjd()

    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
  getservjd: function () {

    let that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })

    var url = config.requestUrl;

    var serviceId = that.data.serviceId

    var data = {
      code_: 'x_getCusServJd',
      serviceId: serviceId,

    }
    rRequest.doRequest(url, data, that, function (rdata) {

      if (rdata.info) {
        that.setData({

          servjdInfo: rdata.info
        })


      } else {
        // that.setData({

        //   msg: rdata.msg
        // })

      }

      wx.hideLoading();

    })
  }
})
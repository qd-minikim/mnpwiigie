// page/component/pages/pagemy/merchant/baseinfo/baseinfo.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pcuserid: '',
    merchantBaseInfo: {},

    rootUrl: config.imageUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var pcuserid = options.pu;
 
    this.setData({

      pcuserid: pcuserid
    })


    this.getMerchantBaseInfo()

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
  imageYl: function (event) {

    var src = event.currentTarget.dataset.src; //获取data-src
     
    var imageUrlArry = new Array();
    
      imageUrlArry.push(src)
    
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imageUrlArry // 需要预览的图片http链接列表

    })
  },
  getMerchantBaseInfo: function() {

    let that = this;


    var url = config.requestUrl;
    var pcuserid = that.data.pcuserid
    var data = {
      code_: 'x_getMBaseInfo',
      pu: pcuserid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          merchantBaseInfo: rdata.info
        })
      }

    })
  }
})
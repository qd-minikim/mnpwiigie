// page/component/pages/pageaddr/addrlist/addrlist.js
var app = getApp();

var rRequest = require('../../../../../utils/rRequest.js');
var config = require('../../../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {


    pageview: {
      scrollviewHeight: 0,
      bottomView: true, //存在底部按钮
    },
    addressInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editBottom();

    this.getAddressInfo();
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
  /**获取用户地址列表 */
  getAddressInfo: function() {

    var that = this;
    var url = config.requestUrl;

    var userid = '1528869953018820';

    var data = {
      code_: 'x_getAddress',
      userid: userid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {


      if (rdata.info) {

        that.setData({
          addressInfo: rdata.info
        })
      }
    })
  },
  /**设置默认 */

  doAddressDefault: function(event) {


    var that = this;
    var url = config.requestUrl;

    var userid = '1528869953018820';
    var id = event.currentTarget.dataset.id;;
    var data = {
      code_: 'x_uppAddDefault',
      userid: userid,
      id: id

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      wx.showToast({
        title: '设置成功',
        image: '/image/icon_ok.png',
        duration: 2000,
        success: function() {}
      })

      that.getAddressInfo();
    })


  },
  /**删除地址 */

  deleteAddress: function(event) {
    var that = this;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除地址吗',

      success: function() {

      
        var url = config.requestUrl;

        var id = event.currentTarget.dataset.id;;
        var data = {
          code_: 'x_delAddress',

          id: id

        }
        rRequest.doRequest(url, data, that, function (rdata) {

          wx.showToast({
            title: '删除成功',
            image: '/image/icon_ok.png',
            duration: 2000,
            success: function () {
            }
          })

          that.getAddressInfo();
        })

      }

    })




  }

})
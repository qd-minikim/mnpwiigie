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
    addressInfo: [],
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
    app.editBottom();
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    this.getAddressInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getAddressInfo();
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

    var userid = that.data.userInfo.id;

    var data = {
      code_: 'x_getAddress',
      userid: userid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {


      if (rdata.infolist) {

        that.setData({
          addressInfo: rdata.infolist
        })
      }
    })
  },
  /**设置默认 */

  doAddressDefault: function(event) {


    var that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;
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

        var id = event.currentTarget.dataset.id;
        var data = {
          code_: 'x_delAddress',

          id: id

        }
        rRequest.doRequest(url, data, that, function(rdata) {

          wx.showToast({
            title: '删除成功',
            image: '/image/icon_ok.png',
            duration: 2000,
            success: function() {}
          })

          that.getAddressInfo();
        })

      }

    })

  },
  /**点击选择地址 */
  selectAddress: function(event) {

      var index = event.currentTarget.dataset.index;
      var selectAddress = this.data.addressInfo[index];
      wx.setStorage({
        key: 'userDefAddr',
        data: selectAddress,
      })

      wx.navigateBack({
        delta: 1,
      })
    }

    ,
  /**新增地址 */
  addAddr: function() {

    wx.navigateTo({
      url: '/page/component/pages/pageaddr/addradd/addradd?action=add'
    })

  },
  editAddr: function(event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/component/pages/pageaddr/addradd/addradd?action=upp&id=' + id
    })

  }
})
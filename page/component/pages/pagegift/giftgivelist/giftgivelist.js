// page/component/pages/pagegift/giftgivelist/giftgivelist.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftgivelist:null,

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    this.getGiftGiveListInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  getGiftGiveListInfo: function () {

    var that = this
    var userid =  that.data.userInfo.id
    var endRow = '0';
    var itemsPerPage = '10';
    var url = config.requestUrl
    var data = {
      code_: 'x_getGiveGiftList',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,

    }
    rRequest.doRequest(url, data, that, function (rdata) {
console.log("----------")
      if (rdata.infolist) {
 
          that.setData({
            'giftgivelist': rdata.infolist
          })
      }
    })

  },
})
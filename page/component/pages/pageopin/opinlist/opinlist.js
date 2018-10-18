// page/component/pages/pageopin/opinlist/opinlist.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    requirementId:'',

    opinionInfo: {
      dataInfo: [],
      pageSize: 5,
      allrows: 0
    },

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
    this.setData({
      'requirementId': options.r,
      
    })
    this.getOpinionInfo()
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
  /**获取朋友说 */
  getOpinionInfo: function () {
    var that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;
    var requirementId = that.data.requirementId;;
    var pageSize = that.data.opinionInfo.pageSize;


    var data = {
      code_: 'x_getOpinionList',
      endRow: 0,
      itemsPerPage: pageSize,
      userid: userid,
      requirementId: requirementId,
    }
    rRequest.doRequest(url, data, that, function (rdata) {

      if (rdata.info) {

        that.setData({
          'opinionInfo.dataInfo': rdata.info.infolist,
          'opinionInfo.allrows': rdata.info.allrows,
        })
      }
    })
  },
})
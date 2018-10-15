// page/component/pages/pagedialog/pagedialog.js

var rRequest = require('../../../../utils/rRequest.js');
var config = require('../../../../config.js');
var rSocket = require('../../../../utils/rSocket.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    dialogInfo: null,
    dialogDetailList: null,
    /**0:消费者 1：商户 */
    dialogType:0,

    dialogCofig:{
      width:0
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
  onLoad: function(options) {
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    this.setData({
     
      'userInfo.id': '1528869953018820',
    })
 
    this.createSocket()
 
    this.setData({
      dialogType: options.type,
 
    })

    
    this.getDialogInfo()
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var percent = windowWidth / 750
    this.setData({
      'dialogCofig.width': windowWidth*0.60,

    })
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


  sendDialogInfo: function() {



  },
  getDialogInfo: function () {

    var that = this;
    var url = config.requestUrl;
    var userId = that.data.userInfo.id;
    // var userId = '1528869953018820';
    var requirementId = '1533134736777395';
    var dialogType = that.data.dialogType;
    var data = {
      code_: 'x_getDialogInfo',
      dialogtype: dialogType,
      userid: userId,
      requirementid: requirementId,
    }
    rRequest.doRequest(url, data, that, function (rdata) {

      if (rdata.info) {

        that.setData({
          'dialogInfo': rdata.info,
        })

        that.getDialogDetailList();
      }
    })
  }
  ,
  getDialogDetailList: function() {
    var that = this;
    var url = config.requestUrl;

    var customDialogId = that.data.dialogInfo.id;

   
    var data = {
      code_: 'x_getDialogDetailList',
      customDialogId: customDialogId,
  
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        that.setData({
          'dialogDetailList': rdata.infolist,

        })
      }
    })


  },

  imageYl: function (event) {

    var src = event.currentTarget.dataset.src; //获取data-src
     
    var imgList = new Array();
    imgList.push(src)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表

    })
  },
  createSocket: function() {

    var that = this;

    var relationId = '22';
    var url = config.socketUrl + relationId;
    var data = {}
    rSocket.connectSocket(url, data, that, function(rdata) {


    })

  }
})
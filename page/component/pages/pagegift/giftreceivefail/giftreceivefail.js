// page/component/pages/pagegift/giftreceivefail/giftreceivefail.js

var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUserInfo = require('../../../../../utils/rUserInfo.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftRecordId:'',
    giftStatusImage: config.imageUrl + "/wiigie/background/gift/give_gift_result_read.png",
    /**tabbar */
    pageScrollView: {
      height: 0
    },
    tabbar: {}, //tabbar 信息
    tabbarPage: '/pages/pagemy/pagemy', //当前页面属于哪个tabbar 默认是null
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this

    var gr = options.gr;


    that.setData({

      giftRecordId: gr
    })

    /****调用函数设置tabbar及页面*****/
    app.editTabBar();
    /****调用函数设置tabbar及页面*****/
    if (app.globalData.userIData) {
      that.setData({
        // 'userWxInfo': app.globalData.userWxInfo,
        'userIData': app.globalData.userIData,
        'userInfo': app.globalData.userInfo,
      }) /****调用函数设置tabbar及页面*****/
      that.getGiftRecordInfo()
    } else {
 
      rUserInfo.getUserInfoApp(that, function(rdata) {
        // if (app.globalData.userWxInfo) {
        if (app.globalData.userIData) {

          that.setData({
            // 'userWxInfo': app.globalData.userWxInfo,
            'userIData': app.globalData.userIData,
            'userInfo': app.globalData.userInfo,
          })
          that.getGiftRecordInfo()
        }

      })

    }
 
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var swiperHeight = windowHeight - 90 * percent - 110 * percent
    this.setData({

      'pageScrollView.height': swiperHeight + "px",

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
  /**获取配置描述 */
  getConfigMsgInfo: function () {
    let that = this;
    var url = config.requestUrl;

    var fUserNickname = encodeURIComponent(that.data.giftInfo.recordInfo.from_person_nickname);

    var tUserNickname = encodeURIComponent(that.data.giftInfo.recordInfo.to_person_nickname);
 
    var values = [
        
   {
        code: 'GIFT_READ',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }, {
          regexp: 'receiveruser_nickname',
          replacement: tUserNickname
        }]
      } 
    ];


    var data = {
      code_: 'x_getConfigMsgInfo',
      /**[{code:xxxx,replace:[{regexp:xxx,replacement:xxxx},{}]},{}] */
      values: values
    }
    rCommon.configMsgInfo.getConfigMsg(url, data, that, function (rdata) {
      if (rdata.info) {

        that.setData({
          configMsgInfo: rdata.info,

        })

      } 

    });

  },
  /**打开看看 */

  showGiftRequirementDetail: function (event) {

    var giftRecordId = event.currentTarget.dataset.id;
    var t = event.currentTarget.dataset.oper;

    wx.navigateTo({
      
      url: '/page/component/pages/pagegift/giftdetar/giftdetar?gr=' + giftRecordId + '&t=' + t,
    })

  },
 /** */
  getGiftRecordInfo: function () {

    let that = this
    var giftRecordId = that.data.giftRecordId
    var userId = that.data.userInfo.id;
    var url = config.requestUrl
    var data = {
      code_: 'x_getGiveGiftRecord',
      giftRecordId: giftRecordId,
      userId: userId,
    }
    rRequest.doRequest(url, data, that, function (rdata) {

      if (rdata.info) {
 
        that.setData({

          'giftInfo.recordInfo': rdata.info,
      
        })
  
        that.getConfigMsgInfo()
      }
    })

  },
})
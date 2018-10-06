// page/component/pages/pagegift/giftgivesucc/giftgivesucc.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    giftInfo: {
      giftRecordId: '',
      process: '0',
      giftStatusImage: config.imageUrl + "/wiigie/background/gift/give_gift_result_0.png", //展示的图片路径

      recordInfo: {}
    },
    /**提示信息 */
    configMsgInfo: {},

    /**tabbar */
    pageScrollView: {
      height: app.globalData.systemInfo.windowHeight
    },
    tabbar: {}, //tabbar 信息
    tabbarPage: '/pages/pagemy/pagemy' //当前页面属于哪个tabbar 默认是null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /****调用函数设置tabbar及页面*****/
    app.editTabBar();
    /****调用函数设置tabbar及页面*****/
    var giftRecordId = options.gr;
    this.setData({
      'giftInfo.giftRecordId': giftRecordId,

    })
    this.getGiveGiftRecordInfo()
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
  /** */
  getGiveGiftRecordInfo: function() {

    var that = this
    var giftRecordId = '1537842768256558';

    var url = config.requestUrl
    var data = {
      code_: 'x_getGiveGiftRecord',
      giftRecordId: giftRecordId,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        var process = rdata.info.process_status;
        var giftStatusImage = '';

        if (process == '0') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_0.png";
        }
        if (process == '1') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_1.png"; //展示的图片路径
        }
        if (process == '2') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_2.png"; //展示的图片路径
        }
        if (process == '21') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_21.png"; //展示的图片路径
        }
        if (process == '22') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_22.png"; //展示的图片路径
        }
        if (process == '23') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_23.png"; //展示的图片路径
        }
        if (process == '24') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_24.png"; //展示的图片路径
        }
        if (process == '99') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_99.png"; //展示的图片路径
        }
        that.setData({
          'giftInfo.recordInfo': rdata.info,
          'giftInfo.process': process,
          'giftInfo.giftStatusImage': giftStatusImage,
        })


        that.getConfigMsgInfo()
      }
    })

  },
  /**获取配置描述 */
  getConfigMsgInfo: function() {
    var that = this;
    var url = config.requestUrl;

    var fUserNickname = that.data.giftInfo.recordInfo.from_person_nickname;
    var values = [{
        code: 'PROCESS_0',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'PROCESS_1',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'PROCESS_2',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'PROCESS_21',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'PROCESS_22',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'PROCESS_23',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'PROCESS_99',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }

    ];


    var data = {
      code_: 'x_getConfigMsgInfo',
      /**[{code:xxxx,replace:[{regexp:xxx,replacement:xxxx},{}]},{}] */
      values: values
    }
    rCommon.configMsgInfo.getConfigMsg(url, data, that, function(rdata) {
      if (rdata.info) {

        that.setData({
          configMsgInfo: rdata.info,

        })

      }

    });

  },
})
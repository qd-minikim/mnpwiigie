// page/component/pages/pagegift/giftreceive/giftreceive.js

var config = require('../../../../../config.js');
var rUtils = require('../../../../../utils/rUtils.js');

var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    giftInfo: {
      // process: '0',
      // coverImage: config.imageUrl + "/wiigie/background/gift/give_gift_icon.png", //展示的图片路径
      // currentTime: '2018-10-04 21:16:08',
      // endTime: '2018-10-04 21:16:12',

      giftRecordId: '',
      process: '0',
      giftStatusImage: config.imageUrl + "/wiigie/background/gift/give_gift_icon.png", //展示的图片路径
      recordInfo: {}
    },
    timerDown: {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00',
    },
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

    this.getGiftReceive();


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

  /**倒计时  this.getTimerDown() */
  getTimerDown: function() {
    var that = this;
    var currentTime = that.data.giftInfo.recordInfo.current_time;
    var endTime = that.data.giftInfo.recordInfo.end_time;
    rUtils.timerDown.countDown(that, currentTime, endTime, function() {

      console.log("结束----")
    });
  },

  getGiftReceive: function() {

    var that = this
    var giftRecordId = '1534237795080460';
    var fu = '1527673151198212';
    var url = config.requestUrl
    var data = {
      code_: 'x_getGiftReceive',
      gr: giftRecordId,
      fu: fu,
      // u: giftRecordId,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          'giftInfo.recordInfo': rdata.info,
          'giftInfo.process': rdata.info.process_status
        })

        if (rdata.info.process_status == '0' || rdata.info.process_status == '2')
          that.getTimerDown()
         that.getConfigMsgInfo()
      }
    })

  },
  /**获取配置描述 */
  getConfigMsgInfo: function () {
    var that = this;
    var url = config.requestUrl;

    var fUserNickname = encodeURIComponent(that.data.giftInfo.recordInfo.fusernickname);
    var values = [{
      code: 'GIFT_ADR_MSG',
      replace: [{
        regexp: 'nickname',
        replacement: fUserNickname
      }]
    } ,{
        code: 'ACCEPT_GIFT',
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
    rCommon.configMsgInfo.getConfigMsg(url, data, that, function (rdata) {
      if (rdata.info) {

        that.setData({
          configMsgInfo: rdata.info,

        })

      }

    });

  },
})
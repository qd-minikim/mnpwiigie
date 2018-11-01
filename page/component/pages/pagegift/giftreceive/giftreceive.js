// page/component/pages/pagegift/giftreceive/giftreceive.js

var config = require('../../../../../config.js');
var rUtils = require('../../../../../utils/rUtils.js');

var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var WxParse = require('../../../../../wxParse/wxParse.js');
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
      fuserid: '',
      newGiftRecordId: '',
      giftStatusImage: config.imageUrl + "/wiigie/background/gift/give_gift_icon.png", //展示的图片路径
      recordInfo: {}
    },
    /** */
    actionprocess: '',
    /**要执行的状态 */

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
    tabbarPage: '/pages/pagemy/pagemy', //当前页面属于哪个tabbar 默认是null


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
     /****调用函数设置tabbar及页面(修改参数时同步修改app.js中getUsersInfo中参数)*****/
    app.editTabBar();
    var giftRecordId = options.gr;
    var fuserid = options.fu;

    this.setData({
      'giftInfo.giftRecordId': giftRecordId,
      'giftInfo.fuserid': fuserid,
    })

    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      }) /****调用函数设置tabbar及页面*****/
      this.getGiftReceive();
    } 
    else {

      app.userLogin();
    }
  
   
    

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
    var process = that.data.giftInfo.process

    if (process == '0') {
      var date1 = new Date(currentTime),
        date2 = new Date(endTime); //计算剩余的毫秒数

      if (date2 < date1) {
        /**超时未获知 */
        that.setData({
          'actionprocess': '1',
        })

        that.doProcessGift();
      } else {
        that.setData({
          'actionprocess': '2',
        })
        that.doProcessGift();
        rUtils.timerDown.countDown(that, currentTime, endTime, function() {
          that.setData({
            'actionprocess': '22',
          })
          that.doProcessGift();
        });
      }

    }
    if (process == '2') {
      var date1 = new Date(currentTime),
        date2 = new Date(endTime); //计算剩余的毫秒数

      if (date2 < date1) {
        /**超时未获知 */

        that.setData({
          'actionprocess': '22',
        })
        that.doProcessGift();
      } else {

        rUtils.timerDown.countDown(that, currentTime, endTime, function() {

          that.setData({
            'actionprocess': '22',
          })
          that.doProcessGift();
        });
      }

    }

  },

  getGiftReceive: function() {

    var that = this
    var giftRecordId = that.data.giftInfo.giftRecordId;
    var fu = that.data.giftInfo.fuserid;
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
          'giftInfo.process': rdata.info.process_status,
          'giftInfo.newGiftRecordId': rdata.info.newgiftrecordid
        })

        if (rdata.info.process_status == '0' || rdata.info.process_status == '2') {
          that.getTimerDown()
        }

        that.getConfigMsgInfo()
      }
    })

  },
  /**操作 */
  doProcessGift: function() {
    var that = this

    var url = config.requestUrl

    var actionprocess = that.data.actionprocess;
    if (actionprocess == '') {

      wx.showToast({
        title: '系统异常',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }
    var giftRecordId = that.data.giftInfo.giftRecordId;

    var fUserId = that.data.giftInfo.fuserid;
    var newGiftRecordId = that.data.giftInfo.newGiftRecordId;
    var fromLeaveMessage = '';
    var tUserId = '';
    var data = {
      code_: 'x_doProcess',
      "processStatus": actionprocess,
      "giftRecordId": giftRecordId,
      "fUserId": fUserId,
      "newGiftRecordId": newGiftRecordId,
      "tUserId": tUserId,
      "fromLeaveMessage": ''
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      that.setData({
        'giftInfo.process': actionprocess,
      })
    })

  },


  /**获取配置描述 */
  getConfigMsgInfo: function() {
    var that = this;
    var url = config.requestUrl;

    var fUserNickname = encodeURIComponent(that.data.giftInfo.recordInfo.fusernickname);
    var values = [{
        code: 'GIFT_ADR_MSG',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'ACCEPT_GIFT',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'GIFT_FOR_MSG',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'FORWARD_GIFT',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'GIFT_REJ_MSG',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'REJECT_GIFT',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'REJECT_GIFT_1',
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

        WxParse.wxParse('GIFT_ADR_MSG', 'html', rdata.info.GIFT_ADR_MSG, that, 5);
        WxParse.wxParse('ACCEPT_GIFT', 'html', rdata.info.ACCEPT_GIFT, that, 5);
        WxParse.wxParse('GIFT_FOR_MSG', 'html', rdata.info.GIFT_FOR_MSG, that, 5);
        WxParse.wxParse('FORWARD_GIFT', 'html', rdata.info.FORWARD_GIFT, that, 5);
        WxParse.wxParse('GIFT_REJ_MSG', 'html', rdata.info.GIFT_REJ_MSG, that, 5);
        WxParse.wxParse('REJECT_GIFT', 'html', rdata.info.REJECT_GIFT, that, 5);
        WxParse.wxParse('REJECT_GIFT_1', 'html', rdata.info.REJECT_GIFT_1, that, 5);

      }

    });

  },
  /**点击进入详情页 */
  giftdetar: function(event) {
    var that = this;
    var giftRecordId = that.data.giftInfo.giftRecordId;
    var t = event.currentTarget.dataset.oper;
     
    wx.navigateTo({
      url: '/page/component/pages/pagegift/giftdetar/giftdetar?gr=' + giftRecordId +'&t='+t,
    })

  }

})
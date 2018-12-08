// page/component/pages/pagegift/giftreceivesucc/giftreceivesucc.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUserInfo = require('../../../../../utils/rUserInfo.js');

var rSocket = require('../../../../../utils/rSocket.js');
var SocketTask;
var socketOpen = false;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftInfo: {
      giftRecordId: '',
      process: '',
      giftStatusImage: "", //展示的图片路径

      recordInfo: {}
    },
    /**提示信息 */
    configMsgInfo: {},

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

    /**送礼弹框 */
    fmodalhidden: true,
    fmodaltextareaMaxLen: 40, //字数限制
    fmodalMsg: '', //送礼留言
    nofmodalMsg: true, //是否输入留言
    nofmodalTip: '输入留言',

    /** */
    showPage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    /****调用函数设置tabbar及页面*****/
    app.editTabBar();
    /****调用函数设置tabbar及页面*****/
 
    var giftRecordId = options.gr;
 

    that.setData({
      'giftInfo.giftRecordId': giftRecordId,
      // 'giftInfo.process': process,
      // 'giftInfo.giftStatusImage': giftStatusImage,
    })

    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {
      that.setData({
        // 'userWxInfo': app.globalData.userWxInfo,
        'userIData': app.globalData.userIData,
        'userInfo': app.globalData.userInfo,
      }) /****调用函数设置tabbar及页面*****/
      that.getGiveGiftRecordInfo()
    } else {



      rUserInfo.getUserInfoApp(that, function(rdata) {
        // if (app.globalData.userWxInfo) {
        if (app.globalData.userIData) {

          that.setData({
            // 'userWxInfo': app.globalData.userWxInfo,
            'userIData': app.globalData.userIData,
            'userInfo': app.globalData.userInfo,
          })
          that.getGiveGiftRecordInfo()
        }

      })

      // app.userLogin();
    }

    wx.hideShareMenu();

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
    let that = this;

    var showPage = that.data.showPage;

    if (showPage == 'share') {
      that.setData({
        'showPage': '',
        'fmodalhidden': true,
      })
      that.getGiveGiftRecordInfo()
 

    }

    if (!SocketTask) {


      that.webSocket()
    } else {

      if (SocketTask.readyState !== 0 && SocketTask.readyState !== 1) {

        that.webSocket()
      }
    }
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
   // that.setData({

  //   'giftInfo.recordInfo': rdata.info,
  //   'giftInfo.process': process,
  //   'giftInfo.giftStatusImage': giftStatusImage,
  // })
  onShareAppMessage: function() {
    let that = this;
    // giftInfo.recordInfo
    var newGiftRecordId = that.data.giftInfo.recordInfo.newgiftrecordid;
    var userid = that.data.userInfo.id;

    var giftRecordId = that.data.giftInfo.giftRecordId;


    var fromLeaveMessage = that.data.fmodalMsg;
    // var oper = that.data.giftInfo.oper;
    var tUserId = '';
    var url = config.requestUrl;
    var data = {
      code_: 'x_doProcess',
      "processStatus": '24', //24已转送
      "giftRecordId": giftRecordId,
      "fUserId": userid,
      "newGiftRecordId": newGiftRecordId,
      "tUserId": tUserId,
      "fromLeaveMessage": encodeURIComponent(fromLeaveMessage)
    }
    rRequest.doRequest(url, data, that, function(rdata) {
 
    })
    that.setData({
      'showPage': 'share'
    });

    var fmodalMsg = that.data.fmodalMsg;

    that.setData({
      fmodalhidden: true,
    });
    var path = "/page/component/pages/pagegift/giftinform/giftinform?gr="+ newGiftRecordId+"&fu="+ userid;
    return {
      title: fmodalMsg   ,
      path: path,
      imageUrl: that.data.giftInfo.recordInfo.cover_image_url,
      success: function() {



      },
      fail: function() {

      },
      complete: function() {

      }

    };
  },
  forwardfriend: function () {
    let that = this;
    that.setData({
      fmodalhidden: false,

    });


  },
  //字数限制
  fmodalWordLimit: function (e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > this.data.fmodaltextareaMaxLen) return;
    if (len == 0) {
      this.setData({
        fmodalcurrentNoteLen: len, //当前字数
        fmodalMsg: e.detail.value,
        nofmodalMsg: true,
        nofmodalTip: '输入留言'
      });
    } else {
      this.setData({
        fmodalcurrentNoteLen: len, //当前字数
        fmodalMsg: e.detail.value,
        nofmodalMsg: false,
        nofmodalTip: '继续'
      });
    }
  },

  fmodalcancel: function () {
    this.setData({
      fmodalhidden: true,

    });
  },
  /** */
  getGiveGiftRecordInfo: function() {

    let that = this
    var giftRecordId = that.data.giftInfo.giftRecordId;
    var userId = that.data.userInfo.id;
    var url = config.requestUrl
    var data = {
      code_: 'x_getGiveGiftRecord',
      giftRecordId: giftRecordId,
      userId: userId,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {


        var process = rdata.info.process_status;
        var giftStatusImage = '';

        if (process == '0') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_0.png";
          // wx.showShareMenu();
        }
        else if (process == '1') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_1.png"; //展示的图片路径
        }
        else if (process == '2') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_2.png"; //展示的图片路径
        }
        else if (process == '21') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_21.png"; //展示的图片路径
        }
        else if (process == '22') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_22.png"; //展示的图片路径
        }
        else if (process == '23') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_23.png"; //展示的图片路径
        }
        else if (process == '24') {
         
          var newprocess = rdata.info.newgiftrecord.process_status

          if (newprocess =='0'){
            giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_24.png"; //展示的图片路径
          } else if (newprocess == '1') {
            giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_1.png"; //展示的图片路径
          } else if (newprocess == '2') {
            giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_2.png"; //展示的图片路径
          } else if (newprocess == '21') {
            giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_21.png"; //展示的图片路径
          } else if (newprocess == '22') {
            giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_22.png"; //展示的图片路径
          } else if (newprocess == '23') {
            giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_23.png"; //展示的图片路径
          } else if (newprocess == '24') {
            giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_23.png"; //展示的图片路径
          } else if (newprocess == '99') {
            giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_99.png"; //展示的图片路径

          }
        }
        else if (process == '99') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_99.png"; //展示的图片路径

          
        }

       
        that.setData({
          
          'giftInfo.recordInfo': rdata.info,
          'giftInfo.process': process,
          'giftInfo.giftStatusImage': giftStatusImage,
        })
        
        if (rdata.info.newgiftrecord) {

          var from_leave_message = rdata.info.newgiftrecord.from_leave_message ? rdata.info.newgiftrecord.from_leave_message : ''
          var len = parseInt(from_leave_message.length);
          if (len == 0) {
            that.setData({
              fmodalcurrentNoteLen: len, //当前字数
              fmodalMsg: from_leave_message,
              nofmodalMsg: true,
              nofmodalTip: '输入留言'
            });
          } else {
            that.setData({
              fmodalcurrentNoteLen: len, //当前字数
              fmodalMsg: from_leave_message,
              nofmodalMsg: false,
              nofmodalTip: '继续'
            });
          }

        }


        that.getConfigMsgInfo()
      }
    })

  },
  /**打开看看 */

  showGiftRequirementDetail: function(event) {

      var giftRecordId = event.currentTarget.dataset.id;
      var t = event.currentTarget.dataset.oper;

      wx.navigateTo({
    
        url: '/page/component/pages/pagegift/giftdetar/giftdetar?gr=' + giftRecordId + '&t=' + t,
      })

    }

    ,
  /**获取配置描述 */
  getConfigMsgInfo: function() {
    let that = this;
    var url = config.requestUrl;

    var fUserNickname = encodeURIComponent(that.data.giftInfo.recordInfo.from_person_nickname);
    
    var tUserNickname = encodeURIComponent(that.data.giftInfo.recordInfo.newgiftrecord.to_person_nickname);

   
    var values = [
      {
        code: 'RESULT_0',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'RESULT_1',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'RESULT_2',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'RESULT_21',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'RESULT_22',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'RESULT_23',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'RESULT_24',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      }, {
        code: 'RESULT_99',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      } ,
         {
           code: 'RESULT_24_0',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      },
      {
        code: 'PROCESS_0',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      }, {
        code: 'PROCESS_1',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      }, {
        code: 'PROCESS_2',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      }, {
        code: 'PROCESS_21',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      }, {
        code: 'PROCESS_22',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      }, {
        code: 'PROCESS_23',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      }, {
        code: 'PROCESS_24',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      }, {
        code: 'PROCESS_99',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      },
      {
        code: 'PROCESS_24_0',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
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
  /** */
  webSocket: function () {

    let that = this;


    var userId = that.data.userInfo.id;
    // var giftid = that.data.giftInfo.recordInfo.gift_id
    
    var relationId = "gift_" + userId
    var url = config.socketUrl + "/" + relationId
    var data = {}
    SocketTask = rSocket.connectSocket(url, data, that, function (rdata) {
      console.log('WebSocket连接创建--', rdata)

    })

    SocketTask.onOpen(function (res) {
      console.log('WebSocket连接已打开！readyState=' + SocketTask.readyState)

    })
    SocketTask.onMessage(function (res) {
      that.setData({
        fmodalhidden: true,
      });
      that.getGiveGiftRecordInfo()
      // console.log('WebSocketonMessage！readyState=' + res)
    })
    SocketTask.onError(function (res) {
      // console.log('onError====readyState=')
    })
    SocketTask.onClose(function (res) {
      // console.log('WebSocket连接已关闭！readyState=')
      that.webSocket()
    })

  },
})
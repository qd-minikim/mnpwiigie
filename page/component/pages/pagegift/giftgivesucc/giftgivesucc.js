// page/component/pages/pagegift/giftgivesucc/giftgivesucc.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUserInfo = require('../../../../../utils/rUserInfo.js');
var rSocket = require('../../../../../utils/rSocket.js');
var app = getApp();
var socketOpen = false;

var SocketTask;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    giftInfo: {
      giftRecordId: '',
      process: '0',
      giftStatusImage: config.imageUrl + "/wiigie/background/gift/give_gift_result_0.png", //展示的图片路径
      // newGiftRecordId: '',
      recordInfo: {}
    },
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},
    /**提示信息 */
    configMsgInfo: {},

    /**分享时的title */
    shareTitle: '',
    // fromLeaveMsg: '',
    /**分享时的留言 如果为''(理论不会)时 用shareTitle  */
    /**转发蒙板 */
    pagemask: {
      isForward: false,
      msgTitle: '点击右上角的【发送给朋友】，将这个礼物送给指定的朋友',
      msgTitleColor: '',
      msgDesc: '',
      msgDescColor: '',
    },
    /**tabbar */
    pageScrollView: {
      height: 0
    },
    tabbar: {}, //tabbar 信息
    tabbarPage: '/pages/pagemy/pagemy', //当前页面属于哪个tabbar 默认是null

    /**送礼弹框 */
    fmodalhidden: true,
    fmodaltextareaMaxLen: 40, //字数限制
    fmodalMsg: '', //送礼留言
    nofmodalMsg: true, //是否输入留言
    nofmodalTip: '输入留言',
    /** */
    showFlg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    /****调用函数设置tabbar及页面*****/
    app.editTabBar();
    var giftRecordId = options.gr;
    this.setData({
      'giftInfo.giftRecordId': giftRecordId,

    })


    var url = "/page/component/pages/pagegift/giftgivesucc/giftgivesucc?gr=" + giftRecordId
    wx.setStorage({
      key: "cardpage",
      data: url,
    })
    /****调用函数设置tabbar及页面*****/
    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {
      that.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })

      that.getGiveGiftRecordInfo()
    } else {

      rUserInfo.getUserInfoApp(that, function(rdata) {
        // if (app.globalData.userWxInfo) {
          if (app.globalData.userIData) {
          that.setData({
            // userWxInfo: app.globalData.userWxInfo,
            userIData: app.globalData.userIData,
            userInfo: app.globalData.userInfo,
          })

        }
        that.getGiveGiftRecordInfo()
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
    wx.setStorage({
      key: "cardpage",
      data: "",
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    let that = this;

    var showFlg = that.data.showFlg;

    if (showFlg == 'share') {
      that.setData({
        'showFlg': '',
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
  onShareAppMessage: function() {
    let that = this;

    that.setData({
      'showFlg': 'share'
    })
    wx.setStorage({
      key: "refresh",
      data: "1",
    })

    var fromLeaveMsg = that.data.fmodalMsg;
    // if (fromLeaveMsg =''){

    //   fromLeaveMsg =  that.data.shareTitle; 
    // }

    var giftRecordId = that.data.giftInfo.giftRecordId;
    var userid = that.data.userInfo.id;

    var oper = that.data.giftInfo.oper;
    var tUserId = '';
    var url = config.requestUrl;
    var data = {
      code_: 'x_doProcess',
      "processStatus": '0', //0已送
      "giftRecordId": giftRecordId,
      "fUserId": userid,
      "newGiftRecordId": '',
      "tUserId": '',
      "fromLeaveMessage": encodeURIComponent(fromLeaveMsg)
    }
    rRequest.doRequest(url, data, that, function(rdata) {



    })

    var imageUrl = that.data.giftInfo.recordInfo.cover_image_url
    // var pagaPath = "/page/component/pages/pagegift/giftreceive/giftreceive?gr=" + giftRecordId + "& fu=" + userid
    var pagaPath = "/page/component/pages/pagegift/giftinform/giftinform?gr=" + giftRecordId + "&fu=" + userid

    return {
      title: fromLeaveMsg,
      path: pagaPath,
      imageUrl: imageUrl,
      success: function() {


      },
      fail: function() {

      }


    }


  },
  forwardfriend: function() {
    let that = this;
    that.setData({
      fmodalhidden: false,

    });


  },
  //字数限制
  fmodalWordLimit: function(e) {
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

  fmodalcancel: function() {
    this.setData({
      fmodalhidden: true,

    });
  },
  /**转发蒙板 */
  // forwardfriend: function() {
  //   this.setData({
  //     'pagemask.isForward': true,

  //   })

  // },
  // closeforwardfriend: function() {
  //   this.setData({
  //     'pagemask.isForward': false,

  //   })

  // },


  showGiftRequirementDetail: function(event) {

      var id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/page/component/pages/pagegift/giftdeta/giftdeta?gr=' + id + "&t=6",
      })

    }

    ,
  /** */
  getGiveGiftRecordInfo: function() {

    let that = this
    var giftRecordId = that.data.giftInfo.giftRecordId;

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
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_24.png"; //展示的图片路径
        }
        else if (process == '99') {
          giftStatusImage = config.imageUrl + "/wiigie/background/gift/give_gift_result_99.png"; //展示的图片路径

          wx.showShareMenu();

          that.forwardfriend();
        }
        that.setData({
          'giftInfo.recordInfo': rdata.info,
          'giftInfo.process': process,
          'giftInfo.giftStatusImage': giftStatusImage,

          //'fromLeaveMsg': rdata.info.from_leave_message ? rdata.info.from_leave_message : '',
        })

        if (rdata.info.from_leave_message) {

          var from_leave_message = rdata.info.from_leave_message
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
  /**获取配置描述 */
  getConfigMsgInfo: function() {
    let that = this;
    var url = config.requestUrl;

    var tUserNickname = encodeURIComponent(that.data.giftInfo.recordInfo.to_person_nickname);
    var values = [{
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
        code: 'PROCESS_99',
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      }, {
        code: 'FORWARD_TIP', //模板信息
        replace: []
      }, {
        code: 'GIFTWX_DESC', //转发默认信息 如果fromLeaveMessage没值时
        replace: []
      }, {
        code: 'GIFT_FORWARD_TIT', //分享时的title
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
          'pagemask.msgTitle': rdata.info.FORWARD_TIP,
          'shareTitle': rdata.info.GIFT_FORWARD_TIT,
        })


      }

    });

  },

  /** */
  webSocket: function () {

    let that = this;

     
    var userId = that.data.userInfo.id;
  
    var relationId = "gift_"
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
        'fmodalhidden': true,
      })
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
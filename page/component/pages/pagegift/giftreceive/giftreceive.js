// page/component/pages/pagegift/giftreceive/giftreceive.js

var config = require('../../../../../config.js');
var rUtils = require('../../../../../utils/rUtils.js');
var rUserInfo = require('../../../../../utils/rUserInfo.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var WxParse = require('../../../../../wxParse/wxParse.js');
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
      // process: '0',
      // coverImage: config.imageUrl + "/wiigie/background/gift/give_gift_icon.png", //展示的图片路径
      // currentTime: '2018-10-04 21:16:08',
      // endTime: '2018-10-04 21:16:12',

      giftRecordId: '',
      process: '-1',
      fuserid: '',
      newGiftRecordId: '',
      giftStatusImage: config.imageUrl + "/wiigie/background/gift/give_gift_icon.png", //展示的图片路径
      recordInfo: {},
      newgiftrecord: {}
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this
    /****调用函数设置tabbar及页面(修改参数时同步修改app.js中getUsersInfo中参数)*****/
    app.editTabBar();
    var giftRecordId = options.gr;
    var fuserid = options.fu;

    that.setData({
      'giftInfo.giftRecordId': giftRecordId,
      'giftInfo.fuserid': fuserid,
    })

    var url = "/page/component/pages/pagegift/giftreceive/giftreceive?gr=" + giftRecordId + "&fu=" + fuserid
    wx.setStorage({
      key: "cardpage",
      data: url,
    })

    if (app.globalData.userIData) {
      that.setData({

        'userIData': app.globalData.userIData,
        'userInfo': app.globalData.userInfo,
      }) /****调用函数设置tabbar及页面*****/

      that.getGiftReceive();
    } else {

      rUserInfo.getUserInfoApp(that, function(rdata) {

        if (app.globalData.userIData) {
          that.setData({

            'userIData': app.globalData.userIData,
            'userInfo': app.globalData.userInfo,
          })

          that.getGiftReceive();
        }

      })

    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight
    this.setData({

      'pageScrollView.height': windowHeight
    })
  

    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {

      var showFlg = that.data.showFlg;

      if (showFlg == 'share') {
        that.setData({
          'showFlg': '',
          'fmodalhidden': true,
        })
        // var newGiftRecordId = that.data.giftInfo.newGiftRecordId;
        var giftRecordId = that.data.giftInfo.giftRecordId;
        var url = "/page/component/pages/pagegift/giftreceivesucc/giftreceivesucc?gr=" + giftRecordId
        ///page/component/pages/pagegift/giftreceivesucc/giftreceivesucc
        wx.redirectTo({
          url: url,
        })
        // that.getGiftReceive()

      }

      if (showFlg == 'addr') {

        that.getGiftReceive()
      } 
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
    var newGiftRecordId = that.data.giftInfo.newGiftRecordId;
    var userid = that.data.userInfo.id;

    var giftRecordId = that.data.giftInfo.giftRecordId;


    var fromLeaveMessage = that.data.fmodalMsg;

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
      'showFlg': 'share'
    });


    that.setData({
      fmodalhidden: true,
    });

    var pagaPath = "/page/component/pages/pagegift/giftinform/giftinform?gr="+newGiftRecordId +"&fu=" + userid
    return {
      title: fromLeaveMessage   ,
      path: pagaPath,
      imageUrl: that.data.giftInfo.recordInfo.cover_image_url,  
      success: function() {

      },
      fail: function() {

      },
      complete: function() {

      }

    };

  },

  /**倒计时  this.getTimerDown() */
  getTimerDown: function() {

    rUtils.timerDown.shutdown();

    let that = this;
    var currentTime  = that.data.giftInfo.recordInfo.current_time;
    var endTime  = that.data.giftInfo.recordInfo.end_time;
   
    var process = that.data.giftInfo.process

    if (process == '0') {
      // var date1 = new Date(currentTime),
      //   date2 = new Date(endTime); //计算剩余的毫秒数
      var date1 = new Date(Date.parse(currentTime.replace(/-/g, "/")));
      var date2 = new Date(Date.parse(endTime.replace(/-/g, "/")));


      if (date2 < date1) {
        /**超时未获知 */
        that.setData({
          'actionprocess': '1',
        })

        that.doProcessGift();
      } else {
        // that.setData({
        //   'actionprocess': '2',
        // })
        // that.doProcessGift();
        rUtils.timerDown.countDown(that, currentTime, endTime, function() {
          that.setData({
            'actionprocess': '22',
          })
           that.doProcessGift();
        });
      }

    }
    if (process == '2') {
    
      // var date1 = new Date(currentTime),
      //   date2 = new Date(endTime); //计算剩余的毫秒数
      var date1 = new Date(currentTime.replace(/-/g, "/"));
      var date2 = new Date(endTime.replace(/-/g, "/"));
    
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

    let that = this
    var giftRecordId = that.data.giftInfo.giftRecordId;
    var fu = that.data.giftInfo.fuserid;
    var url = config.requestUrl
    var userid = that.data.userInfo.id
    var data = {
      code_: 'x_getGiftReceive',
      gr: giftRecordId,
      fu: fu,
      u: userid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        var toUserId = rdata.info.giftRecordInfo.to_person ? rdata.info.giftRecordInfo.to_person : ''
        if (toUserId == userid || toUserId == '') {
          that.setData({

            'giftInfo.recordInfo': rdata.info.giftRecordInfo,
            'giftInfo.process': rdata.info.giftRecordInfo.process_status,
            'giftInfo.giftInfo': rdata.info.giftInfo,
            'giftInfo.giftRecordInfo': rdata.info.giftRecordInfo,
            // 'giftInfo.fUserNickname': rdata.info.fUserNickname,
            // 'giftInfo.tUserNickname': rdata.info.tUserNickname,
            'giftInfo.newgiftrecord': rdata.info.newgiftrecord ? rdata.info.newgiftrecord : {},
            'giftInfo.newGiftRecordId': rdata.info.newgiftrecordid,

            'giftInfo.skuinfo': rdata.info.skuinfo,
            'myOrderInfo.mySkuInfo': rdata.info.skuinfo,
            'myOrderInfo.orderCopies': rdata.info.orderInfo.buyCopies,

          })
          if (rdata.info.newgiftrecord && rdata.info.newgiftrecord.from_leave_message) {

            var from_leave_message = rdata.info.newgiftrecord.from_leave_message
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
          //fmodalMsg
          if (that.data.giftInfo.process == '0' || that.data.giftInfo.process == '2') {
            that.getTimerDown()
          }

        }else{
          that.setData({

            'giftInfo.recordInfo': rdata.info.giftRecordInfo,
            // 'giftInfo.process': rdata.info.giftRecordInfo.process_status,
            'giftInfo.giftInfo': rdata.info.giftInfo,
            'giftInfo.giftRecordInfo': rdata.info.giftRecordInfo,
            // 'giftInfo.fUserNickname': rdata.info.fUserNickname,
            // 'giftInfo.tUserNickname': rdata.info.tUserNickname,
            'giftInfo.newgiftrecord': rdata.info.newgiftrecord ? rdata.info.newgiftrecord : {},
            'giftInfo.newGiftRecordId': rdata.info.newgiftrecordid,

            'giftInfo.skuinfo': rdata.info.skuinfo,
            'myOrderInfo.mySkuInfo': rdata.info.skuinfo,
            'myOrderInfo.orderCopies': rdata.info.orderInfo.buyCopies,

          })
         
          
        }

        that.getConfigMsgInfo()
      }
    })

  },
  /**操作 */
  doProcessGift: function() {
    let that = this

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
    var tUserId = that.data.userInfo.id;
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
    let that = this;
    var url = config.requestUrl;

    var fUserNickname = encodeURIComponent(that.data.giftInfo.recordInfo.from_person_nickname);
 
    var tUserNickname = that.data.giftInfo.recordInfo && that.data.giftInfo.recordInfo.to_person_nickname ? that.data.giftInfo.recordInfo.to_person_nickname : ''
    tUserNickname = encodeURIComponent(tUserNickname);

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
      }, {
        code: 'GIFT_READ',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }, {
          regexp: 'receiveruser_nickname',
          replacement: tUserNickname
        }]
      }, {
        code: 'REJECT_TIP',
        replace: [{
          regexp: 'nickname',
          replacement: fUserNickname
        }]
      },{
        code: 'GIFT_ADR_MSG_TIP', replace: []
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
  
        WxParse.wxParse('GIFT_ADR_MSG', 'md', rdata.info.GIFT_ADR_MSG, that, 5);
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
    let that = this;
    var giftRecordId = that.data.giftInfo.giftRecordId;
    var t = event.currentTarget.dataset.oper;

    wx.navigateTo({
      url: '/page/component/pages/pagegift/giftdetar/giftdetar?gr=' + giftRecordId + '&t=' + t,
    })

  },
  /**提交收货信息 */

  receiveAddress: function() {
    let that = this;
    var giftData = {

      sku_desc: that.data.myOrderInfo.mySkuInfo.sku_desc,
      buyCash: Number(that.data.myOrderInfo.mySkuInfo.list_price) * Number(that.data.myOrderInfo.orderCopies),
      buycopies: that.data.myOrderInfo.orderCopies,
      unitPrice: that.data.myOrderInfo.mySkuInfo.list_price,

      oper: '1',
      /**当前是什么操作 1 提交收货 2 转发朋友 3 拒绝 */

      buyId: that.data.giftInfo.giftInfo.orderId,
      giftRecordId: that.data.giftInfo.giftRecordId,
      fUserId: that.data.giftInfo.giftRecordInfo.from_person,
      newGiftRecordId: that.data.giftInfo.newGiftRecordId,
      tUserId: that.data.giftInfo.giftRecordInfo.to_person
    }
    app.globalData.giftData = giftData
    wx.navigateTo({
      url: '/page/component/pages/pagegift/giftaddr/giftaddr',
    })
  },


  /**转送给其他朋友 */
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


  /**拒绝 */

  reject: function() {

    let that = this;
    wx.showModal({
      title: '提示',
      content: that.data.configMsgInfo.REJECT_TIP,
      success: function(res) {

        if (res.confirm) {
          var giftRecordId = that.data.giftInfo.giftRecordId;

          var fUserId = that.data.giftInfo.giftRecordInfo.from_person;
          var newGiftRecordId = that.data.giftInfo.newGiftRecordId;
          var fromLeaveMessage = '';
          var url = config.requestUrl;
          var tUserId = '';
          var data = {
            code_: 'x_doProcess',
            "processStatus": '21', //21人工拒绝
            "giftRecordId": giftRecordId,
            "fUserId": fUserId,
            "newGiftRecordId": newGiftRecordId,
            "tUserId": tUserId,
            "fromLeaveMessage": encodeURIComponent(fromLeaveMessage)
          }
        
          rRequest.doRequest(url, data, that, function(rdata) {


            wx.showToast({
              title: '成功拒绝',
              image: '/image/icon_ok.png',
              duration: 2000,
              success: function() {}
            })
            setTimeout(function() {
              var url = "/page/component/pages/pagegift/giftreceivesucc/giftreceivesucc?gr=" + giftRecordId
              ///page/component/pages/pagegift/giftreceivesucc/giftreceivesucc
              wx.redirectTo({
                url: url,
              })
            }, 1500)
          })
        } else if (res.cancel) {

        }
 

      }
    })
  },
  /** */
  webSocket: function() {

    let that = this;


    var userId = that.data.userInfo.id;
  
    var relationId = "gift_" + userId
    var url = config.socketUrl + "/" + relationId
    var data = {}
    SocketTask = rSocket.connectSocket(url, data, that, function(rdata) {
      console.log('WebSocket连接创建--', rdata)

    })

    SocketTask.onOpen(function(res) {
      console.log('WebSocket连接已打开！readyState=' + SocketTask.readyState)

    })
    SocketTask.onMessage(function(res) {
      that.setData({
        'fmodalhidden': true,
      })
      that.getGiftReceive()
      // console.log('WebSocketonMessage！readyState=' + res)
    })
    SocketTask.onError(function(res) {
      // console.log('onError====readyState=')
    })
    SocketTask.onClose(function(res) {
      // console.log('WebSocket连接已关闭！readyState=')
      that.webSocket()
    })

  },
})
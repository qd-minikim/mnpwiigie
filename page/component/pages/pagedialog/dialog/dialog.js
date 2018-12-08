// page/component/pages/pagedialog/dialog/dialog.js

var rRequest = require('../../../../../utils/rRequest.js');
var config = require('../../../../../config.js');
var rSocket = require('../../../../../utils/rSocket.js');
var rUtils = require('../../../../../utils/rUtils.js');
var rUpload = require('../../../../../utils/rUpload.js');
const app = getApp()

var socketOpen =false;

var SocketTask;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**传递参数 */
    requirementId: '',
    userType: 1, //1:消费者 0：商户
    customDialogId: '',


    dialogInfoId: '',
    timestamp: '',
    relationId: '',
    onickname: '',
    ousericon: '',
    ouserid: '',
    spuId: '',
    promotionId: '',
    inputValue: '',
    /**要发送的文字信息 */
    imageFilePaths: [],
    /**图片文件 */

    dialogDetailList: [],

    dialogCofig: {
      width: 0
    },
    scrollTop: 0,

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},


    scrollHeight: 0,


    panelPage: {
      panelPageTop: false, // false 表示底部上推，true 表示 上不下推
      chooseSize: false,
      chooseType: '',
      animationData: {},
      maskLayerHeight: '',
      maskLayerWidth: '',
      maskPanHeight: '', //例如下单选择等存在底端按钮的时候，按钮上部的view的高度
      maskPanWidth: '',

      msginfo: '',
      isHtml: false
    },

   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {
      this.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }


    this.setData({
      'customDialogId': options.d,
      'requirementId': options.r,
      'userType': options.t,
        // 'userInfo.id': '1529295282828524'

    })   
 
    this.getDialogInfo()


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight
    var percent = windowWidth / 750
    var scrollHeight = windowHeight - app.globalData.bottomBtnHeight * percent - 20
    this.setData({
      'dialogCofig.width': windowWidth * 0.60,
      'scrollHeight': scrollHeight,
      'panelPage.maskPanWidth': windowWidth
    })

    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!SocketTask){
      

      this.webSocket()
    }else{

      if (SocketTask.readyState !== 0 && SocketTask.readyState !== 1) {

        this.webSocket()
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

  },


  getDialogInfo: function() {

   let that = this;
    var url = config.requestUrl;
    var userId = that.data.userInfo.id;

    var requirementId = that.data.requirementId;

    var customDialogId = that.data.customDialogId; //商户时 存在
    var userType = that.data.userType;
    var data = {
      code_: 'x_getDialogInfo',
      userType: userType,
      userid: userId,
      requirementid: requirementId,
      customDialogId: customDialogId
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          'dialogInfoId': rdata.info.customDialogId,
          'timestamp': rdata.info.timestamp,
          'relationId': rdata.info.relationId,
          'onickname': rdata.info.oNickname,
          'ousericon': rdata.info.oUsericon,
          'ouserid': rdata.info.oUserid,

          'spuId': rdata.info.spuId,
          'promotionId': rdata.info.promotionId,
        })

        that.getDialogDetailList();
      }
    })
  },
  getDialogDetailList: function() {
   let that = this;
    var url = config.requestUrl;

    // var customDialogId = that.data.dialogInfo.id;

    var customDialogId = that.data.dialogInfoId;
    var data = {
      code_: 'x_getDialogDetailList',
      customDialogId: customDialogId,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        that.setData({
          'dialogDetailList': rdata.infolist,

        })
        that.setData({
          scrollTop: 1000 * rdata.infolist.length
        });

      }
    })


  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })


  },

  cancleattach: function() {
   let that = this;
    rUtils.slideModal.down(that, null, false);
  },
  photos: function(event) {
   let that = this;
    var sourcetype = event.currentTarget.dataset.sourcetype;

    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: [sourcetype],
      success: function(res) {
        that.setData({
          imageFilePaths: res.tempFilePaths
        })

        var requirementId = that.data.requirementId;

        var timestamp = that.data.timestamp;
        var userType = that.data.userType;

        //  /**1:消费者 0：商户 */
        var cUserId = '';
        var sUserId = '';
        if (userType == '1') {
          cUserId = that.data.ouserid;
          sUserId = that.data.userInfo.id;

        }
        if (userType == '0') {
          cUserId = that.data.userInfo.id;
          sUserId = that.data.ouserid;

        }

        var content = '';
        var dialogType = '1';
        var userId = that.data.userInfo.id;
        var voiceDuration = '';
        var customDialogId = that.data.dialogInfoId;
        var spuId = that.data.spuId;
        var promotionId = that.data.promotionId;

        var data = {
          code_: 'x_sendDialog',
          requirement_id: requirementId,
          timestamp: timestamp,
          user_type: userType,
          c_user_id: cUserId,
          s_user_id: sUserId,
          content: encodeURIComponent(content),
          dialog_type: dialogType,
          user_id: userId,
          voice_duration: voiceDuration,
          custom_dialog_id: customDialogId,
          spu_id: spuId,
          promotion_id: promotionId,

          service_: 'dialogimage'


        }


        rUpload.upload.uploadImage('upfile', 0, res.tempFilePaths.length, res.tempFilePaths, data, that, function(rdata) {

          var dialogDetailList = that.data.dialogDetailList;

          var newInfo = {
            dialog_type: 1,
            content: rdata.filePath,
            user_id: userId
          }
          dialogDetailList.push(newInfo);
          that.setData({
            'dialogDetailList': dialogDetailList,

          })
          that.setData({
            scrollTop: 1000 * dialogDetailList.length
          });


        });

      },
    })

  },
  camera: function() {
     let that = this;
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: function(res) {

          // const tempFilePaths = res.tempFilePaths
          that.setData({
            imageFilePaths: res.tempFilePaths
          })

        },
      })

    }

    ,
  sendDialog: function(event) {
   let that = this;
    var url = config.requestUrl;

    var requirementId = that.data.requirementId;
    var timestamp = that.data.timestamp;
    var userType = that.data.userType;

    //  /**1:消费者 0：商户 */
    var cUserId = '';
    var sUserId = '';
    if (userType == '1') {
      cUserId = that.data.ouserid;
      sUserId = that.data.userInfo.id;

    }
    if (userType == '0') {
      cUserId = that.data.userInfo.id;
      sUserId = that.data.ouserid;

    }

    var content = that.data.inputValue;

    if (content == '') {

      wx.showToast({
        title: '发送信息不能为空',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }


    var dialogType = '0';
    var userId = that.data.userInfo.id;
    var voiceDuration = '';
    var customDialogId = that.data.dialogInfoId;
    var spuId = that.data.spuId;
    var promotionId = that.data.promotionId;

    var data = {
      code_: 'x_sendDialog',
      requirement_id: requirementId,
      timestamp: timestamp,
      user_type: userType,
      c_user_id: cUserId,
      s_user_id: sUserId,
      content: encodeURIComponent(content),
      dialog_type: dialogType,
      user_id: userId,
      voice_duration: voiceDuration,
      custom_dialog_id: customDialogId,
      spu_id: spuId,
      promotion_id: promotionId,


    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        var mgmtStatus = rdata.info.mgmtStatus;
        // rMap.put("mgmtMsg", "");
        // rMap.put("mgmtStatus", 0);
        // rMap.put("dialogDetailIds", "");
        if (mgmtStatus == '1') {

          wx.showToast({
            title: rdata.info.mgmtMsg,
            image: '/image/icon_warn.png',
            duration: 2000,
            success: function() {

            }
          })

        } else {

          var dialogDetailList = that.data.dialogDetailList;

          var newInfo = {
            dialog_type: 0,
            content: content,
            user_id: userId
          }
          dialogDetailList.push(newInfo);
          that.setData({
            'dialogDetailList': dialogDetailList,
            'inputValue': ''
          })


          that.setData({
            scrollTop: 1000 * dialogDetailList.length
          });

          // var sendData = { "relationId": timestamp + "_" + that.data.ouserid}
          // sendMsg(sendData);

          wx.setStorage({
            key: "refresh",
            data: "1",
          })

        }
      }
    })


  },


  attachment: function(event) {
   let that = this
    var clicklx = event.currentTarget.dataset.lx;
    var clickcode = event.currentTarget.dataset.code;
    var isHtml = event.currentTarget.dataset.html
    rUtils.slideModal.up(that, clicklx, true);

    that.setData({
      'panelPage.isHtml': isHtml,
    })

    if (clicklx == 'attachment') { //匹配模板

    }

  },


  imageYl: function(event) {

    var src = event.currentTarget.dataset.src; //获取data-src

    var imgList = new Array();
    imgList.push(src)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表

    })
  },





  /** */
  webSocket: function () {

   let that = this;
   
    var userType = that.data.userType;
    var userId = that.data.userInfo.id;
    var relationId = '';

    relationId = "dialog_" + userId
    var url = config.socketUrl + "/" + relationId
    var data = {}
    SocketTask = rSocket.connectSocket(url, data, that, function (rdata) {
      console.log('WebSocket连接创建--', rdata)
 
    })
 
    SocketTask.onOpen(function (res) {
      console.log('WebSocket连接已打开！readyState=' + SocketTask.readyState)
 
    })
    SocketTask.onMessage(function (res) {
      that.getDialogInfo()
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
 
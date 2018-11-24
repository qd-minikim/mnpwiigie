// page/component/pages/pageinform/scanpage/scanpage.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUserInfo = require('../../../../../utils/rUserInfo.js');
var rUtils = require('../../../../../utils/rUtils.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionId: '',
    haschecked: false,
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},

    checkStatus: {
      isused: '0',
      isbind: '0',
      isfqr: '0',
      isedit: '-1',
      downtimes: 3,
      statusmsg: ''
    },
    initdowntime: 3,
    windowHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this


    
    if (options.scene) {

      var url = "/page/component/pages/pageinform/scanpage/scanpage?scene=" + options.scene 
      wx.setStorage({
        key: "cardpage",
        data: url,
      })


      var scene = decodeURIComponent(options.scene);
      console.log("scene is ", scene);
      that.setData({
        promotionId: scene,
      })
    } else {
      console.log("no scene");
    }

    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {
      that.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
      that.checkPromotion()
    } else {
      rUserInfo.getUserInfoApp(that, function(rdata) {
        // if (app.globalData.userWxInfo) {
        if (app.globalData.userIData) {
          that.setData({
            // userWxInfo: app.globalData.userWxInfo,
            userIData: app.globalData.userIData,
            userInfo: app.globalData.userInfo,
          })
          that.checkPromotion()
        }

      })
      //app.userLogin();
    }



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight


    this.setData({
      'windowHeight': windowHeight,


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
  checkPromotion: function() {


    let that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = that.data.userInfo.id //'1528869953018820' //
    var promotionId = that.data.promotionId
    var data = {
      code_: 'x_checkPromotion',
      userid: userid,
      promotionid: promotionId
    }
    rRequest.doRequest(url, data, that, function(rdata) {
      wx.hideLoading();
      if (rdata.info) {
        var isused = rdata.info.isUsed
        var isbind = rdata.info.isBind
        var isfqr = rdata.info.isFqr
        var isedit = rdata.info.isEdit

        var configMsgInfo = rdata.info.configMsgInfo

        var m = rdata.info.upmarkId
        var r = rdata.info.requirementId
   
        that.setData({
          'checkStatus.isused': isused,
          'checkStatus.isbind': isbind,
          'checkStatus.isfqr': isfqr,
          'checkStatus.isedit': isedit,
          'haschecked': true,
          'configMsgInfo': configMsgInfo
        })

        //isUsed是否 文案已被发起到手机端 0未  1 已经
        //isBind扫码用户 是否是已绑定用户 0不是 1 是
        //isFqr扫码用户是否 是文案编辑人员 0不是 1是
        //isEdit该文案对应的需求 对应的状态-1 无效  0 编辑状态  1 待付款状态 2 其他状态
        //先判断是否可用  需求绑定状态：默认 0未绑定；   1已绑定

        if (isused == '0') {
          //未绑定需求
          //判断该用户是否已绑定后台
          if (isbind == '0') { //未绑定后台手机号
            //A 层
            that.setData({
              'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_00 ? configMsgInfo.SCAN_MSG_00:'还没有绑定后台商户账号',
              'checkStatus.downtimes': that.data.initdowntime
            })
            rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

              wx.switchTab({
                url: '/pages/pagemy/pagemy',
              })
            })
          }
          if (isbind == '1') { //绑定后台手机号

            if (isfqr == '0') { //该需求不是我所绑定后台用户生成的
              //B 层
              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_010 ? configMsgInfo.SCAN_MSG_010 :'该推广还未发布，请耐心等待，先看看其他的吧',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

                wx.switchTab({
                  url: '/pages/pagehome/pagehome',
                })
              })

            }
            if (isfqr == '1') { ////是文案的发起人

              //C 层
              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_011 ? configMsgInfo.SCAN_MSG_011 :'还需一步，您的推广就会上线喽！',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

                wx.redirectTo({
                  url: "/page/component/pages/pagemy/merchant/fqrequirement/fqrequirement?pro=" + promotionId + "&rid=",
                })
              })
            }
          }
        }
        if (isused == '1') { //需求已被绑定

          //判断是否是 发起人
          if (isfqr == '0') { //不是发起人
            if (isedit == '-1') { //编辑中
              //D 层
              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_10a ? configMsgInfo.SCAN_MSG_10a :'该推广无效，快去看看其他的吧！',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

                wx.switchTab({
                  url: '/pages/pagehome/pagehome',
                })
              })
            } else if (isedit == '0') { //编辑中
              //E 层
              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_100 ? configMsgInfo.SCAN_MSG_100 : '该推广还没上线，快去看看其他的吧！',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

                wx.switchTab({
                  url: '/pages/pagehome/pagehome',
                })
              })



            } else if (isedit == '1') { //待付款
              //F 层

              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_101 ? configMsgInfo.SCAN_MSG_101 :  '该推广还没上线，快去看看其他的吧！',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

                wx.switchTab({
                  url: '/pages/pagehome/pagehome',
                })
              })

            } else {
              //H
              //G层 直接跳转到详情
              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_102 ? configMsgInfo.SCAN_MSG_102 :'好物要分享，快行动起来吧！',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

                wx.redirectTo({
                  url: "/page/component/pages/pagexdd/pagexdd?m=" + m + "&r=" + r,
                })

              })

            }
          }
          if (isfqr == '1') { //是发起人

            if (isedit == '-1') { //无效
              //H
              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_11a ? configMsgInfo.SCAN_MSG_11a :'该推广无效，快去看看其他的吧！',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

                wx.switchTab({
                  url: '/pages/pagehome/pagehome',
                })
              })
            } else if (isedit == '0') { //编辑中
              //I
              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_110 ? configMsgInfo.SCAN_MSG_110:'还需一步，您的推广就会上线喽！',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

                wx.redirectTo({
                  url: "/page/component/pages/pagemy/merchant/fqrequirement/fqrequirement?pro=" + promotionId + "&rid=" + r,
                })
              })
            } else if (isedit == '1') { //待付款
              //J
              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_111 ? configMsgInfo.CAN_MSG_111 :'上次付款还没有完成哟！',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {
                wx.redirectTo({
                  url: "/page/component/pages/pagemy/merchant/fkrequirement/fkrequirement?p=" + promotionId+"&r=" + r,
                })
             
              })
            } else {
              //K直接跳转到详情
              that.setData({
                'checkStatus.statusmsg': configMsgInfo.SCAN_MSG_112 ? configMsgInfo.SCAN_MSG_112 :'好物要分享，快行动起来吧！',
                'checkStatus.downtimes': that.data.initdowntime
              })
              rUtils.countSecondDown.countSecondDown(that, that.data.initdowntime, "checkStatus.downtimes", function() {

                wx.redirectTo({
                  url: "/page/component/pages/pagexdd/pagexdd?m=0&r=" + r,
                })

              })
            }
          }
        }


      }


    })
  }
})
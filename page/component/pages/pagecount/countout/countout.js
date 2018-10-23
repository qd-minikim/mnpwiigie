// page/component/pages/pagecount/countout/countout.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rCommon = require('../../../../../utils/rCommon.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    accountInfo: {},

    /**要提现的金额 */
    accountOut: '',
    istackout: false,
    tipmsg: '提现',
    /**配置信息 */
    configMsgInfo: {},
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

    this.getAccount()
    this.getConfigMsgInfo()

    wx.hideShareMenu();
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

  /**获取配置描述 */
  getConfigMsgInfo: function() {
    var that = this;
    var url = config.requestUrl;
    var values = [{
        code: 'WJ_LJJE_MSG',
        replace: []
      },
      {
        code: 'WJ_LJCS_MSG',
        replace: []
      },
      {
        code: 'WJ_DBZDJE_MSG',
        replace: []
      },
      {
        code: 'WJ_DBZXJE_MSG',
        replace: []
      },
      {
        code: 'WJ_TXBD_MSG',
        replace: []
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

  getAccount: function() {

    var that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;

    var data = {
      code_: 'x_getAccount',

      userid: userid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          accountInfo: rdata.info
        })
      }


    })
  },
  /**全部提现 */
  takeoutAll: function() {

    var that = this;

    that.setData({

      accountOut: parseFloat(Number(that.data.accountInfo.available_amount)).toFixed(2)
    })
  },

  bindKeyInput: function(event) {

    var that = this;
    var value = event.detail.value;
    var availableAmount = that.data.accountInfo.available_amount
    var len = value.split(".").length
    if (len > 1) {
      var lenl = value.split(".")[1].length
      if (lenl > 2) {
        value = parseFloat(Number(value)).toFixed(2)
      
      }


    }
    that.setData({
      accountOut: value,

    })
    if (Number(value) > Number(availableAmount)) {
      that.setData({
        istackout: false,
        tipmsg: '提现超出可用余额',
      })

    } else {
      if (Number(value) == 0) {
        that.setData({
          istackout: false,
          tipmsg: '提现金额不能为零',
        })
      } else {
        that.setData({
          istackout: true,
          tipmsg: '提现',
        })
      }

    }

  },


 


  /**提现 */
  takeOut: function() {

    var that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;
    var accountOut = that.data.accountOut;
    
    var data = {
      code_: 'x_merchantPay',

      userid: userid,
      amount: accountOut
    }
    rRequest.doRequest(url, data, that, function(rdata) {
 
      if (rdata.status == '1') {
        wx.showToast({
          title: '成功',
          image: '/image/icon_ok.png',
          duration: 2000,
          success: function () { }
        })

        that.setData({
          accountOut: '',
          istackout: false,
          tipmsg: '提现',
        })
        that.getAccount()

      } else {
        wx.showToast({
          title: rdata.msg,
          image: '/image/icon_warn.png',
          duration: 2000,
          success: function() {}
        })
      }

    })

  }
})
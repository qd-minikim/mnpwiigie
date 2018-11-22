// page/component/pages/pagebing/pagebing.js
var config = require('../../../../config.js');
var rCommon = require('../../../../utils/rCommon.js');
var rRequest = require('../../../../utils/rRequest.js');
var rUtils = require('../../../../utils/rUtils.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    yzm: '',

    showTipMsg: '发送验证码',
    clickTip: true,

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
    this.getConfigMsgInfo();
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
    let that = this;
    var url = config.requestUrl;
    var values = [{
        code: 'BIND_MSG',
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

  bindKeyInputPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindKeyInputYzm: function(e) {
    this.setData({
      yzm: e.detail.value
    })
  },


  /**发送验证码 */
  getYzm: function() {
    let that = this;
    var phone = that.data.phone

    if (phone == '') {
      wx.showToast({
        title: '输入手机号',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {


        }
      })

      return;
    }
    if (!(/^1[34578]\d{9}$/.test(phone))) {

      wx.showToast({
        title: '手机号有误',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {


        }
      })
      return;
    }

    rUtils.countDown.countDown(that, 'showTipMsg', 'clickTip');

    var url = config.requestUrl;

    var data = {
      code_: 'x_getYzm',
      "phone": phone
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.success == '0') {
        wx.showToast({
          title: rdata.msg,
          image: '/image/icon_ok.png',
          duration: 2000,
          success: function() {


          }
        })

      } else {

        wx.showToast({
          title: rdata.msg,
          image: '/image/icon_warn.png',
          duration: 2000,
          success: function() {

          }
        })
        rUtils.countDown.shutdown(that, 'showTipMsg', 'clickTip');

      }

    })

  },


  /**提交验证码 */
  submitBing: function() {

    let that = this;
    var phone = that.data.phone
    var yzm = that.data.yzm
    if (phone == '') {
      wx.showToast({
        title: '输入手机号',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {


        }
      })

      return;
    }
    if (!(/^1[34578]\d{9}$/.test(phone))) {

      wx.showToast({
        title: '手机号有误',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {

        }
      })
      return;
    }
    if (yzm == '') {
      wx.showToast({
        title: '输入验证码',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {


        }
      })

      return;
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = that.data.userInfo.id  
    var data = {
      code_: 'x_dobing',
      "phone": phone,
      "checkcode": yzm,

      "userid": userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.status == '1') { //绑定成功
        wx.showToast({
          title: rdata.msg,
          image: '/image/icon_ok.png',
          duration: 2000,
          success: function () {
          }
        })
        wx.setStorage({
          key: "refresh",
          data: "1",
        })
        setTimeout(function() {

          wx.navigateBack({
            delta: 1,
          })

        }, 1500)

      } else {
        wx.showToast({
          title: rdata.msg,
          image: '/image/icon_wran.png',
          duration: 2000,
          success: function () {
          }
        })
        that.setData({
          showTipMsg: '重新发送',
          clickTip: true,
          yzm: ''
        })
      }
      wx.hideLoading();
    })

  }
})
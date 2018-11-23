// page/component/pages/pageorder/orderconfirm/orderconfirm.js
 
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},

    /**用户默认地址 */
    userDefAddr: null,
    /**下单信息 */
    orderData: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    if (app.globalData.userWxInfo) {
      that.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    that.setData({
      orderData: app.globalData.orderData,
    })


    /** */
    wx.getStorage({
      key: 'userDefAddr',
      success: function (res) {
        if (res.data) {
          that.setData({
            userDefAddr: res.data
          })
        }

      },
    })

    //需要判断是否是自购，还是 送礼

    // that.getUserDefAddr() //x_getDefAddr
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getStorage({
      key: 'userDefAddr',
      success: function (res) {
        if (res.data) {
          that.setData({
            userDefAddr: res.data
          })
        }

      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  selectUserAddr: function (event) {

    wx.navigateTo({
      url: '/page/component/pages/pageaddr/addrlist/addrlist',
    })

  },


  /**提交订单 */
  orderpay: function () {

    let that = this;
    var url = config.orderPayUrl;

    var userDefAddr = that.data.userDefAddr;
    if (!userDefAddr) {
      wx.showToast({
        title: '请选择地址',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function () { }
      })
      return false;
    }


    var addressInfo = {

      mobile_phone: that.data.userDefAddr.phone, //服务类型

      address: encodeURIComponent(that.data.userDefAddr.address),
      addressHouse: encodeURIComponent(that.data.userDefAddr.addressHouse),
      city: that.data.userDefAddr.city,
      province: that.data.userDefAddr.province,
      district: that.data.userDefAddr.district,

      phone: that.data.userDefAddr.phone,
      orderUsername: encodeURIComponent(that.data.userDefAddr.orderUsername),
    }
    var orderData = that.data.orderData;


    var orderInfo = Object.assign(orderData, addressInfo);
    orderInfo = {
      ...orderInfo,
      sku_desc: encodeURIComponent(orderInfo.sku_desc)
    };

    rRequest.doRequest(url, orderInfo, that, function (rdata) {

      if (rdata.info) {

        wx.requestPayment({
          timeStamp: rdata.info.timeStamp, //时间戳
          nonceStr: rdata.info.nonceStr, //随机字符串
          package: rdata.info.package, //统一下单接口返回的 prepay_id 参数值
          signType: rdata.info.signType, //签名算法
          paySign: rdata.info.paySign, //签名
          success: function (res) {

            wx.showToast({
              title: '下单成功',
              image: '/image/icon_ok.png',
              duration: 2000,
              success: function () { }
            })

            wx.setStorage({
              key: "refresh",
              data: "2",
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)


          },
          fail: function (res) {
            wx.showToast({
              title: '下单失败',
              image: '/image/icon_ok.png',
              duration: 2000,
              success: function () { }
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          },
          complete: function (res) {

          }
        })
      }
    })


  }
})
// page/component/pages/pageorder/pageorder.js
var config = require('../../../../config.js');
var rCommon = require('../../../../utils/rCommon.js');
var rRequest = require('../../../../utils/rRequest.js');
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var  that = this;
    if (app.globalData.userWxInfo) {
      that.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }

    wx.getStorage({
      key: 'userDefAddr',
      success: function(res) {
        if(res.data){
          that.setData({
            userDefAddr: res.data
          })
        }
        
      },
    })
    // this.setData({
    //   userDefAddr:
    // })


    //需要判断是否是自购，还是 送礼

   // that.getUserDefAddr() //x_getDefAddr
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
  selectUserAddr: function(event) {

    wx.navigateTo({
      url: '/page/component/pages/pageaddr/addrlist/addrlist',
    })

  },



  orderpay: function() {

    var that = this;
    var url = config.orderPayUrl;


    var data = {
      requirementid: '1529296099516208',
      userid: '1528869953018820',
      markid: '17482c48dfc64a04',
      upmarkid: '6f9608ca15bd4bcc',
      buyCash: '0.45',
      skuid: '1529217692948442',
      spuid: '1529215126697316',
      promotionid: '1529291860866339',
      buycopies: '1',
      unitPrice: '0.45',

      mobile_phone: '15192720655',
      address: 'addressaddressaddress',
      addressHouse: 'addressHouseaddressHouse',
      city: '370200',
      province: '370000',
      district: '370211',

      phone: '111111111111',
      orderUsername: 'weibo',
      ordertype: '2',
      fromLeaveMessage: 'fromLeaveMessage',


    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        wx.requestPayment({
          timeStamp: rdata.info.timeStamp, //时间戳
          nonceStr: rdata.info.nonceStr, //随机字符串
          package: rdata.info.package, //统一下单接口返回的 prepay_id 参数值
          signType: rdata.info.signType, //签名算法
          paySign: rdata.info.paySign, //签名
          success: function(res) {
            console.log("---------success")
          },
          fail: function(res) {
            console.log("---------fail")
          },
          complete: function(res) {

          }
        })
      }
    })


  }
})
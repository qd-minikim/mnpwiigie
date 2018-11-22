// page/component/pages/pagegift/giftorder/giftorder.js
var config = require('../../../../../config.js');


var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {


    /**字数限制 */
    textareaMaxLen: 40,

    configMsgInfo: {},

    /**留言 */
    inputValue: '',
    /**下单信息 */
    orderData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderData: app.globalData.orderData,
    })
    this.getConfigMsgInfo()
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



  /**获取配置描述 */
  getConfigMsgInfo: function() {
    let that = this;
    var url = config.requestUrl;
    var values = [{
      code: 'GIFT_FORWARD_MSG',
      replace: []
    }];


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
  orderpay: function() {

    let that = this;
    var url = config.orderPayUrl;


    var fromLeaveMessage = that.data.inputValue;

    if (fromLeaveMessage == '') {
      wx.showToast({
        title: '请输入送礼留言',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }

    var orderData = that.data.orderData;

    var orderInfo = { ...orderData,
      fromLeaveMessage: encodeURIComponent(fromLeaveMessage),
      sku_desc: encodeURIComponent(orderData.sku_desc)
    };


    rRequest.doRequest(url, orderInfo, that, function(rdata) {

      if (rdata.info) {

        wx.requestPayment({
          timeStamp: rdata.info.timeStamp, //时间戳
          nonceStr: rdata.info.nonceStr, //随机字符串
          package: rdata.info.package, //统一下单接口返回的 prepay_id 参数值
          signType: rdata.info.signType, //签名算法
          paySign: rdata.info.paySign, //签名
          success: function(res) {

            var giftRecordId = rdata.info.giftRecordId;
            wx.showToast({
              title: '下单成功',
              image: '/image/icon_ok.png',
              duration: 2000,
              success: function() {}
            })

            setTimeout(function() {

              wx.redirectTo({
                url: '/page/component/pages/pagegift/giftgivesucc/giftgivesucc?gr=' + giftRecordId,
              })

            }, 1500)
          },
          fail: function(res) {
            wx.showToast({
              title: '下单失败',
              image: '/image/icon_err.png',
              duration: 2000,
              success: function() {}
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)
          },
          complete: function(res) {

          }
        })
      }
    })


  },
  //字数限制
  bindWordLimit: function(e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len, //当前字数
      inputValue: value
    });
  }
})
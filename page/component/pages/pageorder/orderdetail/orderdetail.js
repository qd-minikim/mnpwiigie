// page/component/pages/pageorder/orderdetail/orderdetail.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    orderid:'',
    orderDetail: {},

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
    var that = this;
    if (app.globalData.userWxInfo) {
      that.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })


    }
    var orderid = options.o
    that.setData({
      orderid: orderid//'1537499430418714'
    })

    that.getOrderDetail();

    that.getConfigMsgInfo();
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

  customdialog: function(e) {
      var that = this;

      var requirmentId = e.currentTarget.dataset.requir
      var orderType = e.currentTarget.dataset.ordertype
      var deliveryType = e.currentTarget.dataset.deliverytype
      var customerServiceStatus = e.currentTarget.dataset.customerservicestatus
      var csId = e.currentTarget.dataset.csid
      var orderId = e.currentTarget.dataset.orderid
      var statusCode = e.currentTarget.dataset.statuscode

      if (orderType == '2') {
        if (deliveryType == '2') {

          if (statusCode == 2) {

            if (customerServiceStatus == -1) {
              wx.showModal({
                title: '提示',
                content: '已超出售后服务期限',
                // confirmText:'',
                showCancel: false,
                success: function() {

                }
              })

            }
            else if (customerServiceStatus == 0) {
              wx.showModal({
                title: '提示',
                content: '不支持售后服务',
                // confirmText:'',
                showCancel: false,
                success: function () {

                }
              })

            }
           else  if (customerServiceStatus == 3) {
              wx.navigateTo({

                url: '/page/component/pages/pagemy/customserv/servdeta/servdeta?s=' + csId,

              })

            }
            else if('1,2,9'.indexOf(customerServiceStatus) > -1) {

              wx.navigateTo({

                url: '/page/component/pages/pagemy/customserv/servadd/servadd?o=' + orderId,

              })

            }

          } else {

            wx.showModal({
              title: '提示',
              content: '确认收货后才能申请售后服务',
              // confirmText:'',
              showCancel: false,
              success: function() {

              }
            })

          }
        } else {

          wx.showModal({
            title: '提示',
            content: '服务类订单暂不支持售后服务',
            // confirmText:'',
            showCancel: false,
            success: function() {

            }
          })
        }
      }


      else if (orderType == '3') {

        var orderDstip = that.data.configMsgInfo.ORDER_DSTIP;
        wx.showModal({
          title: '提示',
          content: orderDstip,
          // confirmText:'',
          showCancel: false,
          success: function() {

          }
        })


      }

 
    }

    ,
  getOrderDetail: function() {

    var that = this;
    //1525959638799628&u=1492742904403462
    var url = config.requestUrl;
    var userid = that.data.userInfo.id //that.data.userInfo.id //1528869953018820
    var id = that.data.orderid
    var data = {
      code_: 'x_getOrderDetail',
      id: id,
      userid: userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({

          orderDetail: rdata.info
        })
      }

    })


  },
  /**获取配置描述 */
  getConfigMsgInfo: function() {
    var that = this;
    var url = config.requestUrl;
    var values = [{
        code: 'ORDER_DSTIP',
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
})
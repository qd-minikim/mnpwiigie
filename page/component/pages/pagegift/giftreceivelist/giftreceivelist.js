// page/component/pages/pagegift/giftreceivelist/giftreceivelist.js
 
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftreceivelist: null,

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    this.getGiftReceiveListInfo();
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
    var that = this;
    try {
      var value = wx.getStorageSync('refresh')
      var currentTab = that.data.currentTab;
     
      if (value && value == '1'  ) {
        this.getGiftReceiveListInfo();

      }
    } catch (e) {

    }
    wx.setStorage({
      key: "refresh",
      data: "0",
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
  getGiftReceiveListInfo: function () {

    var that = this
    var userid = that.data.userInfo.id//that.data.userInfo.id
    var endRow = '0';
    var itemsPerPage = '10';
    var url = config.requestUrl
    var data = {
      code_: 'x_getReceiveGiftList',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,

    }
    rRequest.doRequest(url, data, that, function (rdata) {

      if (rdata.infolist) {

        that.setData({
          'giftreceivelist': rdata.infolist
        })
      }
    })

  },
  /**查看物流 */
  wayBill: function (event){

    var orderId = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/waybill/waybill?o=' + orderId,
    })

  },
   /**评价晒单*/
 
  /**评价晒单 */
  evaladd: function (event) {
    var that = this
 
    var evalid = event.currentTarget.dataset.evalid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/evaluate/evaladd/evaladd?e=' + evalid,
    })
  },
 /**申请售后 */
  serviceApply: function (event) {
    var that = this

    var orderid = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/customserv/servadd/servadd?o=' + orderid,
    })
  },
   /**确认收货 */
  
  surereceve: function (e) {
    var that = this;
    var orderid = e.currentTarget.dataset.orderid;
    var promotionid = e.currentTarget.dataset.proid;
    var requirementid = e.currentTarget.dataset.reqid;
    var receiveSuccessCS = e.currentTarget.dataset.recs;
    var dealtype = e.currentTarget.dataset.detype;
    var deliverytype = e.currentTarget.dataset.deltype;
    var logisticsstatus = e.currentTarget.dataset.lstatus;

    var userid = that.data.userInfo.id;
    if (deliverytype == '2' && logisticsstatus == '1') {

      wx.showModal({
        title: '提示',
        content: '确定收到了商品了吗？',
        success: function (res) {
          if (res.confirm) {
            var data = {
              code_: 'x_doreceive',
              "orderid": orderid,
              "promotion_id": promotionid,
              "requirementid": requirementid,
              "userid": userid
            }

            rCommon.doOrder.orderAction(that, data, function (rdata) {

              wx.showToast({
                title: '确认成功',
                image: '/image/icon_ok.png',
                duration: 2000,
                success: function () {


                }
              })

              
              that.getGiftReceiveListInfo();
            });
          } else if (res.cancel) {

          }

        }
      })

    }
  },

  /** */
  showReceiveDetail: function (event) {
   
    var id = event.currentTarget.dataset.id;
    var fu = event.currentTarget.dataset.fu;
    wx.navigateTo({
      url: '/page/component/pages/pagegift/giftreceive/giftreceive?gr=' + id + '&fu=' + fu,
    })


  }
})
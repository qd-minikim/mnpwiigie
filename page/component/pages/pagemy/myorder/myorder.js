// page/component/pages/pagemy/myorder/myorder.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**tab */
    // clickindex:-1,
    currentTab: 0, // 0自购 1送礼
    /** */
    swiperHeight: 0,

    searched: false,
    /**自购 */
    orderbuysearched: false,
    orderbuyArray: [],

    /**送礼 */
    ordergiftsearched: false,
    ordergiftArray: [],

    /**分页 */
    itemsPerPage: 100,
    orderbuyEndRow: 0,
    orderbuyAllRows: 0,

    ordergiftEndRow: 0,
    ordergiftAllRows: 0,

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
    this.getOrdersInfo()
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var swiperHeight = windowHeight - 80 * percent
    this.setData({

      swiperHeight: swiperHeight + "px",

    })


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    try {
      var value = wx.getStorageSync('refresh')
      var currentTab = that.data.currentTab;
      // var index = that.data.clickindex;
      if (value && value == '1'   ) {
 
        if (currentTab == '0') {
          that.getOrdersInfo();
          // var orderbuyArray = that.data.orderbuyArray;
          // orderbuyArray[index].evaluable = '1';
          // that.setData({
          //   orderbuyArray: orderbuyArray,
          // })
        }
        if (currentTab == '1') {
          // that.setData({
          //   ordergiftArray: rdata.infolist,
          // })
        }


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
  bindChange: function(e) {

    let that = this;

    var currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab,
      searched: false,
    });


    if (currentTab == '0') {
      var orderbuysearched = that.data.orderbuysearched;

      if (!orderbuysearched) {
        that.getOrdersInfo()
      }
    }
    if (currentTab == '1') {
      var ordergiftsearched = that.data.ordergiftsearched;

      if (!ordergiftsearched) {
        that.getOrdersInfo()
      }
    }
  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {

    let that = this;
 
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,

      })
    }
  },

  getOrdersInfo: function() {

    let that = this;
    var currentTab = that.data.currentTab;
    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })

    var orderType = '2'
    //自购
    if (currentTab == '0') {
      orderType = '2'
      endRow = that.data.orderbuyEndRow;
      allRows = that.data.orderbuyAllRows;
    }

    //送礼
    if (currentTab == '1') {
      orderType = '3'
      endRow = that.data.ordergiftEndRow;
      allRows = that.data.ordergiftAllRows;
    }


    var url = config.requestUrl;

    var userid = that.data.userInfo.id



    var data = {
      code_: 'x_getMyOrders',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      orderType: orderType

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        if (currentTab == '0') {
          that.setData({
            orderbuysearched: true,
            orderbuyEndRow: rdata.endRow,
            orderbuyAllRows: rdata.infocounts,
            orderbuyArray: rdata.infolist,
          })

        }

        if (currentTab == '1') {
          that.setData({
            ordergiftsearched: true,
            ordergiftArray: rdata.infolist,
            ordergiftEndRow: rdata.endRow,
            ordergiftAllRows: rdata.infocounts,
          })
        }

      }
      that.setData({
        searched: true,

      })
      wx.hideLoading();

    })



  },

  /**物流信息 */

  wayBill: function(event) {


    var orderId = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/waybill/waybill?o=' + orderId,
    })
  },
  /**评价晒单 */
  evaladd: function(event) {
    let that = this

    var index = event.currentTarget.dataset.index;
    // that.setData({
    //   clickindex: index,

    // })

    var evalid = event.currentTarget.dataset.evalid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/evaluate/evaladd/evaladd?e=' + evalid,
    })
  },
  /*取消订单*/
  cancelOrder: function (event){

    var orderid = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pageorder/ordercancel/ordercancel?o=' + orderid,
    })
    
    
  },
  /*确认收货*/
surereceve:function(e){
  let that = this;
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


            that.getOrdersInfo();
          });
        } else if (res.cancel) {

        }

      }
    })

  }

}

})
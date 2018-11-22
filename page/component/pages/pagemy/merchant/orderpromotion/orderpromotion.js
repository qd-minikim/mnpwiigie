// page/component/pages/pagemy/merchant/orderpromotion/orderpromotion.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    pcuserid: '',
    promotionid: '',
    deliverytype: '',
    currentTab: 0, // 0待处理 1已处理 
    /** */
    swiperHeight: 0,

    searched: false,

    navigateToflg: '',


    orderDes: {

      allOrderNum: '',
      waitCopiesNum: '',
      waitOrderNum: '',
      doneCopiesNum: '',
      doneOrderNum: '',

    },
    viewModal: {
      /**录入快递单号的弹框 */
      addLogistics: {
        addLogisticsShow: false, //
        requirementTitle: '',
        orderUsername: '',
        mobilePhone: '',
        orderAddr: '',
        carrierNo: '',
        carrierName: '',
        orderId: ''
      }

    },
    /**待处理 */
    dclsearched: false,
    dclArray: [],
    dclEndRow: 0,
    dclAllRows: 0,
    /**已处理 */
    yclsearched: false,
    yclArray: [],
    yclEndRow: 0,
    yclAllRows: 0,

    initPageInfo: {},
    /**分页 */
    itemsPerPage: 10,

    //是否下拉刷新
    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
    //刷新
    isRefresh: false,
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
    var pcuserid = options.pu;
    var promotionid = options.p;

    this.setData({

      pcuserid: pcuserid,
      promotionid: promotionid,

    })
    this.getInitPage()



    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750
    //- 90 * percent
    var swiperHeight = windowHeight - 250 * percent
    this.setData({

      swiperHeight: swiperHeight + "px",

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    var navigateToflg = that.data.navigateToflg
    if (navigateToflg == 'carrier') {
      var carrierInfo = app.globalData.carrierInfo
      that.setData({
        'viewModal.addLogistics.carrierName': carrierInfo.carrierName,
        'viewModal.addLogistics.carrierCode': carrierInfo.carrierCode
      })
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
  scroll: function(e) {

  },

  upper: function(e) {

  },
  lower: function(e) {
    this.setData({
      isReachBottom: true
    })
    this.getPromotionOrders()
  },
  bindChange: function(e) {

    let that = this;

    var currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab,
      searched: false,
      isPullDownRefresh: false,
      isReachBottom: false,
      isRefresh: false,
    });


    if (currentTab == '0') {
      var dclsearched = that.data.dclsearched;

      if (!dclsearched) {
        that.getPromotionOrders()
      }
    }
    if (currentTab == '1') {
      var yclsearched = that.data.yclsearched;

      if (!yclsearched) {
        that.getPromotionOrders()
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


  getInitPage: function() {
    let that = this;


    var url = config.requestUrl;
    var userid = that.data.userInfo.id //'1529295282828524' //1528869953018820
    var pcuserid = that.data.pcuserid
    var promotionid = that.data.promotionid

    var data = {
      code_: 'x_getInitPromotionOrders',
      "userid": userid,
      "pcuserid": pcuserid,
      "promotionid": promotionid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {


        that.setData({
          initPageInfo: rdata.info
        })

        that.getPromotionOrders()
      }

    })


  },
  getPromotionOrders: function() {


    let that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;
    var isRefresh = that.data.isRefresh;

    var currentTab = that.data.currentTab;
    var itemsPerPage = that.data.itemsPerPage;
    var endRow = 0;
    var allRows = 0;
    if (currentTab == '0') {
      endRow = that.data.dclEndRow;
      allRows = that.data.dclAllRows;

    } else if (currentTab == '1') {
      endRow = that.data.yclEndRow;
      allRows = that.data.yclAllRows;
    }
    if (isRefresh) {
      itemsPerPage = endRow;
      endRow = 0;

    }

    if (isReachBottom && allRows == endRow) {

      that.setData({
        isReachBottom: false,
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
        success: function() {}
      })
      return
    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })

    var url = config.requestUrl;
    var userid = that.data.userInfo.id//'1529295282828524'//1528869953018820
    var pcuserid = that.data.pcuserid
    var promotionid = that.data.promotionid
    var deliveryType = that.data.initPageInfo.delivery_type

    var data = {
      code_: 'x_getPromotionOrders',
      "endRow": endRow,
      "itemsPerPage": itemsPerPage,
      "tabType": currentTab,
      "deliveryType": deliveryType,
      "userid": userid,
      "pcuserid": pcuserid,
      "promotionid": promotionid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {
        if (currentTab == '0') {
          var dclArray = [];
          if (isRefresh || isPullDownRefresh) {
            dclArray = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            dclArray = that.data.dclArray;
          }
          var dclArrayNew = [...dclArray, ...rdata.infolist]

          that.setData({
            dclArray: dclArrayNew,
            dclAllRows: rdata.infocounts,
            dclEndRow: rdata.endRow,
            dclsearched: true,
            isPullDownRefresh: false,
            isReachBottom: false,
            isRefresh: false,

            'orderDes.allOrderNum': rdata.info.num_orders,
            'orderDes.waitCopiesNum': rdata.info.num_pending_buycopies,
            'orderDes.waitOrderNum': rdata.info.num_pending_orders
          })
      

        } else if (currentTab == '1') {
          var yclArray = [];
          if (isRefresh || isPullDownRefresh) {
            yclArray = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            yclArray = that.data.yclArray;
          }
          var yclArrayNew = [...yclArray, ...rdata.infolist]

          that.setData({
            yclArray: yclArrayNew,
            yclAllRows: rdata.infocounts,
            yclEndRow: rdata.endRow,
            yclsearched: true,
            isPullDownRefresh: false,
            isReachBottom: false,
            isRefresh: false,
            orderNum: rdata.info,
            'orderDes.allOrderNum': rdata.info.num_orders,
            'orderDes.doneCopiesNum': rdata.info.num_pending_buycopies,
            'orderDes.doneOrderNum': rdata.info.num_pending_orders
          })
        }
       
      }

      wx.hideLoading();

    })
  },

  closeLogistics: function () {

    let that = this;
    that.setData({
      'viewModal.addLogistics.addLogisticsShow': false,
      'viewModal.addLogistics.requirementTitle': '',
      'viewModal.addLogistics.orderUsername': '',
      'viewModal.addLogistics.mobilePhone': '',
      'viewModal.addLogistics.orderAddr': '',
      'viewModal.addLogistics.carrierNo': '',
      'viewModal.addLogistics.carrierName': '',
      'viewModal.addLogistics.orderId': '',

    })
  },
  bindKeyInputLogisticsNo: function (e) {
    let that = this;
    var carrierNo = e.detail.value
    that.setData({
      'viewModal.addLogistics.carrierNo': carrierNo,
    })

  },
  addLogisticsNo: function () {
    let that = this;
    var carrierNo = that.data.viewModal.addLogistics.carrierNo;

    var carrierName = that.data.viewModal.addLogistics.carrierName;
    var carrierCode = that.data.viewModal.addLogistics.carrierCode;
    var orderId = that.data.viewModal.addLogistics.orderId;


    if (carrierNo == '') {
      wx.showToast({
        title: '快递单号为空',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function () { }
      })
      return false;
    }
    if (carrierName == '') {
      wx.showToast({
        title: '快递公司为空',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function () { }
      })
      return false;
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820
    var data = {
      code_: 'x_addOrderCarrier',
      "orderId": orderId,
      "carrier": encodeURIComponent(carrierName),
      "trackNo": carrierNo,
      "carrierCode": carrierCode

    }
    rRequest.doRequest(url, data, that, function (rdata) {

      if (rdata.info == '') {

        wx.showToast({
          title: '录入成功',
          image: '/image/icon_ok.png',
          duration: 2000,
          success: function () { }
        })

        that.setData({
          isRefresh: true,
          yclsearched:false,
        })
        wx.setStorage({
          key: "refresh",
          data: "1",
        })
        setTimeout(function () {
          that.closeLogistics()

          that.getPromotionOrders()

        }, 1500)

      }

      wx.hideLoading();

    })

  },
  doPhoneAddSendInfo: function (e) {
    let that = this;
    var title = that.data.initPageInfo.requirement_title;
    var username = e.currentTarget.dataset.username;
    var phone = e.currentTarget.dataset.phone;
    var addr = e.currentTarget.dataset.addr;
    var orderid = e.currentTarget.dataset.orderid;


    that.setData({
      'viewModal.addLogistics.addLogisticsShow': true,
      'viewModal.addLogistics.requirementTitle': title,
      'viewModal.addLogistics.orderUsername': username,
      'viewModal.addLogistics.mobilePhone': phone,
      'viewModal.addLogistics.orderAddr': addr,
      'viewModal.addLogistics.orderId': orderid,

    })


  },

  doWaitAddrMsg: function (e) {
    let that = this;
    var wmsg = e.currentTarget.dataset.wmsg;

    wx.showModal({
      title: '提示',
      content: wmsg,
      showCancel: false,
      confirmText: '知道了',
      success: function (res) {

      }
    })

  },
  selectCarrier: function () {


    this.setData({
      'navigateToflg': 'carrier'
    })
    wx.navigateTo({
      url: '/page/component/pages/pagemy/selcarrier/selcarrier',
    })

  },

  
  wayBill: function (event) {
    var orderId = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/waybill/waybill?o=' + orderId,
    })
 

  },
  pagexdd: function (event) {
    var m = event.currentTarget.dataset.upmark;
    var r = event.currentTarget.dataset.rqui;
    wx.navigateTo({
      url: "/page/component/pages/pagexdd/pagexdd?m=" + m + "&r=" + r,
    })


  },


})
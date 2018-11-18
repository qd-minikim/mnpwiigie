// page/component/pages/pagemy/merchant/orderhandle/orderhandle.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pcuserid: '',
    currentTab: 0, // 0待处理 1已处理 
    /** */
    swiperHeight: 0,

    // searched: false,

    navigateToflg: '',

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


    /**分页 */
    itemsPerPage: 10,

    //是否下拉刷新
    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
    //刷新
    isRefresh: false,

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


    // /**用户信息 */
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

    var pcuserid = options.pu;

    this.setData({

      pcuserid: pcuserid
    })

    this.getMgmtOrders()
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
    var swiperHeight = windowHeight - 80 * percent
    this.setData({

      swiperHeight: swiperHeight + "px",

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var navigateToflg = that.data.navigateToflg
    if (navigateToflg == 'carrier') {
      var carrierInfo = app.globalData.carrierInfo
      that.setData({
        'viewModal.addLogistics.carrierName': carrierInfo.carrierName,
        'viewModal.addLogistics.carrierCode': carrierInfo.carrierCode
      })
    }


    try {
      var value = wx.getStorageSync('refresh')
      var currentTab = that.data.currentTab;
      var index = that.data.clickindex;
      if (value && value == '1') {
        that.setData({
          isRefresh:true,
          dclsearched:false,
          yclsearched: false,
        })

        that.getMgmtOrders()

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
  scroll: function(e) {

  },

  upper: function(e) {

  },
  lower: function(e) {
    this.setData({
      isReachBottom: true
    })
    this.getMgmtOrders()
  },
  bindChange: function(e) {

    var that = this;

    var currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab,
      // searched: false,
      isPullDownRefresh: false,
      isReachBottom: false,
      isRefresh: false,
    });


    if (currentTab == '0') {
      var dclsearched = that.data.dclsearched;

      if (!dclsearched) {
        that.getMgmtOrders()
      }
    }
    if (currentTab == '1') {
      var yclsearched = that.data.yclsearched;

      if (!yclsearched) {
        that.getMgmtOrders()
      }
    }

  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {

    var that = this;

    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,

      })
    }
  },
  getMgmtOrders: function() {


    var that = this;
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
    var userid = that.data.userInfo.id //'1529295282828524'that.data.userInfo.id //1528869953018820
    var pcuserid = that.data.pcuserid


    var data = {
      code_: 'x_getMgmtOrders',
      "endRow": endRow,
      "itemsPerPage": itemsPerPage,
      "userid": userid,
      "pcuserid": pcuserid,
      "tabType": currentTab
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
          })
        }

      }

      wx.hideLoading();

    })
  },


  closeLogistics: function() {

    var that = this;
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
  bindKeyInputLogisticsNo: function(e) {
    var that = this;
    var carrierNo = e.detail.value
    that.setData({
      'viewModal.addLogistics.carrierNo': carrierNo,
    })

  },
  addLogisticsNo: function() {
    var that = this;
    var carrierNo = that.data.viewModal.addLogistics.carrierNo;

    var carrierName = that.data.viewModal.addLogistics.carrierName;
    var carrierCode = that.data.viewModal.addLogistics.carrierCode;
    var orderId = that.data.viewModal.addLogistics.orderId;


    if (carrierNo == '') {
      wx.showToast({
        title: '快递单号为空',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {}
      })
      return false;
    }
    if (carrierName == '') {
      wx.showToast({
        title: '快递公司为空',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {}
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
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info == '') {

        wx.showToast({
          title: '录入成功',
          image: '/image/icon_ok.png',
          duration: 2000,
          success: function() {}
        })

        that.setData({
          isRefresh: true,
        })
        setTimeout(function() {
          that.closeLogistics()

          that.getMgmtOrders()

        }, 1500)

      }

      wx.hideLoading();

    })

  },
  doPhoneAddSendInfo: function(e) {
    var that = this;
    var title = e.currentTarget.dataset.title;
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

  doWaitAddrMsg: function(e) {
    var that = this;
    var wmsg = e.currentTarget.dataset.wmsg;

    wx.showModal({
      title: '提示',
      content: wmsg,
      showCancel: false,
      confirmText: '知道了',
      success: function(res) {

      }
    })

  },
  selectCarrier: function() {


    this.setData({
      'navigateToflg': 'carrier'
    })
    wx.navigateTo({
      url: '/page/component/pages/pagemy/selcarrier/selcarrier',
    })

  },
  // 全部订单
  promotionOrders: function(e) {
    var that = this;
    var proid = e.currentTarget.dataset.proid;
    var pcuserid = that.data.pcuserid

    wx.navigateTo({
      url: '/page/component/pages/pagemy/merchant/orderpromotion/orderpromotion?p=' + proid + "&pu=" + pcuserid,
    })

  },
  /**查看物流 */
  wayBill: function(event) {
    var orderId = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/waybill/waybill?o=' + orderId,
    })


  },
  pagexdd: function(event) {
    var m = event.currentTarget.dataset.upmark;
    var r = event.currentTarget.dataset.rqui;
    wx.navigateTo({
      url: "/page/component/pages/pagexdd/pagexdd?m=" + m + "&r=" + r,
    })


  },
})
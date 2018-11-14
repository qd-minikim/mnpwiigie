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

    searched: false,

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


    viewModal: {
      /**录入快递单号的弹框 */
      addLogistics: {
        addLogisticsShow: false, //
        requirementTitle:'',
        orderUsername: '',
        mobilePhone: '',
        orderAddr: '',
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

  },
  bindChange: function(e) {

    var that = this;

    var currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab,
      searched: false,
    });


    if (currentTab == '0') {
      var dclsearched = that.data.dclsearched;

      if (!dclsearched) {

      }
    }
    if (currentTab == '1') {
      var yclsearched = that.data.yclsearched;

      if (!yclsearched) {

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
    var userid = '1529295282828524' //that.data.userInfo.id //1528869953018820
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
          if (isPullDownRefresh) {
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

          })


        } else if (currentTab == '1') {
          var yclArray = [];
          if (isPullDownRefresh) {
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

          })
        }

      }

      wx.hideLoading();

    })
  },


  closeLogistics:function(){

    var that = this;
    that.setData({
      'viewModal.addLogistics.addLogisticsShow': false,
      'viewModal.addLogistics.requirementTitle': '',
      'viewModal.addLogistics.orderUsername': '',
      'viewModal.addLogistics.mobilePhone': '',
      'viewModal.addLogistics.orderAddr': '',
    })
  },
  doPhoneAddSendInfo:function(e){
    var that = this;
    var title = e.currentTarget.dataset.title;
    var username = e.currentTarget.dataset.username;
    var phone = e.currentTarget.dataset.phone;
    var addr = e.currentTarget.dataset.addr;



    that.setData({
      'viewModal.addLogistics.addLogisticsShow': true,
      'viewModal.addLogistics.requirementTitle': title,
      'viewModal.addLogistics.orderUsername': username,
      'viewModal.addLogistics.mobilePhone': phone,
      'viewModal.addLogistics.orderAddr': addr,
    })


  },
  selectCarrier:function(){

    wx.navigateTo({
      url: '/page/component/pages/pagemy/selcarrier/selcarrier',
    })
    
  }
 
})
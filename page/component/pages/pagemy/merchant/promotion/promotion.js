// page/component/pages/pagemy/merchant/promotion/promotion.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**tab */
    pcuserid:'',
    currentTab: 0, // 0编辑中1待付款  2活动中 3冻结中 4已下线
    /** */
    swiperHeight: 0,

    searched: false,

    /**编辑中 */
    bjzsearched: false,
    bjzArray: [],
    bjzEndRow: 0,
    bjzAllRows: 0,
    /**待付款 */
    dfksearched: false,
    dfkArray: [],
    dfkEndRow: 0,
    dfkAllRows: 0,
    /**活动中 */
    hdzsearched: false,
    hdzArray: [],
    hdzEndRow: 0,
    hdzAllRows: 0,
    /**冻结中 */
    djzsearched: false,
    djzArray: [],
    djzEndRow: 0,
    djzAllRows: 0,
    /**已下线 */
    yxxsearched: false,
    yxxArray: [],
    yxxEndRow: 0,
    yxxAllRows: 0,

    /**分页 */
    itemsPerPage: 10,

    //是否下拉刷新
    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
    // /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {
      this.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }

    var pcuserid = options.pu;

    this.setData({

      pcuserid: pcuserid
    })
    this.getPromotion()

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
    let that = this;

    var currentTab = that.data.currentTab;


    if (currentTab == '0') {
      that.setData({
        bjzEndRow: 0,
        bjzAllRows: 0,
      })
    }
    if (currentTab == '1') {
      that.setData({
        dfkEndRow: 0,
        dfkAllRows: 0,
      })
    }
    if (currentTab == '2') {
      that.setData({
        hdzEndRow: 0,
        hdzAllRows: 0,
      })
    }
    if (currentTab == '3') {
      that.setData({
        djzEndRow: 0,
        djzAllRows: 0,
      })
    }

    if (currentTab == '4') {
      that.setData({
        yxxAllRows: '0',
        yxxEndRow: 0
      })
    }
    that.setData({

      isPullDownRefresh: true
    })

    that.getPromotion();
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
    this.getPromotion()
  },
  bindChange: function(e) {

    let that = this;

    var currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab,
      searched: false,
    });


    if (currentTab == '0') {
      var bjzsearched = that.data.bjzsearched;

      if (!bjzsearched) {
        that.getPromotion()
      }
    }
    if (currentTab == '1') {
      var dfksearched = that.data.dfksearched;

      if (!dfksearched) {
        that.getPromotion()
      }
    }
    if (currentTab == '2') {
      var hdzsearched = that.data.hdzsearched;

      if (!hdzsearched) {
        that.getPromotion()
      }
    }
    if (currentTab == '3') {
      var djzsearched = that.data.djzsearched;

      if (!djzsearched) {
        that.getPromotion()
      }
    }

    if (currentTab == '4') {
      var yxxsearched = that.data.yxxsearched;

      if (!yxxsearched) {
        that.getPromotion()
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
   

  showdetail: function(e) {

    var upmarkid = e.currentTarget.dataset.upmarkid;
    var requirementid = e.currentTarget.dataset.id;
    var progressstatus = e.currentTarget.dataset.progress;
    var promotionId = e.currentTarget.dataset.proid;
    if (progressstatus == '4') {

       
      wx.navigateTo({
        url: "/page/component/pages/pagemy/merchant/fqrequirement/fqrequirement?pro=" + promotionId + "&rid=" + requirementid,
      })


    } else if (progressstatus == '5') {


      wx.navigateTo({
        url: "/page/component/pages/pagemy/merchant/fkrequirement/fkrequirement?p=" + promotionId + "&r=" + requirementid,
      })


    } else {
      wx.navigateTo({
        url: "/page/component/pages/pagexdd/pagexdd?m=" + upmarkid + "&r=" + requirementid,
      })
     
    }



  },

  /**获取活动 */
  getPromotion: function() {

    let that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;

    var currentTab = that.data.currentTab;
    var itemsPerPage = that.data.itemsPerPage;


    var endRow = 0;
    var allRows = 0;
    if (currentTab == '0') {
      endRow = that.data.bjzEndRow;
      allRows = that.data.bjzAllRows;
    } else if (currentTab == '1') {
      endRow = that.data.dfkEndRow;
      allRows = that.data.dfkAllRows;
    } else if (currentTab == '2') {
      endRow = that.data.hdzEndRow;
      allRows = that.data.hdzAllRows;
    } else if (currentTab == '3') {
      endRow = that.data.djzEndRow;
      allRows = that.data.djzAllRows;
    } else if (currentTab == '4') {
      endRow = that.data.yxxEndRow;
      allRows = that.data.yxxAllRows;
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
    var userid = that.data.userInfo.id//'1528869953018820' //that.data.userInfo.id //1528869953018820
    var pcuserid = that.data.pcuserid //1528869953018820
    var data = {
      code_: 'x_getPromotions',
      "endRow": endRow,
      "itemsPerPage": itemsPerPage,
      "userid": userid,
      "pcuserid": pcuserid,
      "statusType": currentTab
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        if (currentTab == '0') {
          var bjzArray = [];
          if (isPullDownRefresh) {
            bjzArray = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            bjzArray = that.data.bjzArray;
          }
          var bjzArrayNew = [...bjzArray, ...rdata.infolist]

          that.setData({
            bjzArray: bjzArrayNew,
            bjzAllRows: rdata.infocounts,
            bjzEndRow: rdata.endRow,
            bjzsearched: true,
            isPullDownRefresh: false,
            isReachBottom: false,

          })


        } else if (currentTab == '1') {
          var dfkArray = [];
          if (isPullDownRefresh) {
            dfkArray = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            dfkArray = that.data.dfkArray;
          }
          var dfkArrayNew = [...dfkArray, ...rdata.infolist]

          that.setData({
            dfkArray: dfkArrayNew,
            dfkAllRows: rdata.infocounts,
            dfkEndRow: rdata.endRow,
            dfksearched: true,
            isPullDownRefresh: false,
            isReachBottom: false,

          })
        } else if (currentTab == '2') {
          var hdzArray = [];
          if (isPullDownRefresh) {
            hdzArray = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            hdzArray = that.data.hdzArray;
          }
          var hdzArrayNew = [...hdzArray, ...rdata.infolist]

          that.setData({
            hdzArray: hdzArrayNew,
            hdzAllRows: rdata.infocounts,
            hdzEndRow: rdata.endRow,
            hdzsearched: true,
            isPullDownRefresh: false,
            isReachBottom: false,

          })
        } else if (currentTab == '3') {
          var djzArray = [];
          if (isPullDownRefresh) {
            djzArray = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            djzArray = that.data.djzArray;
          }
          var djzArrayNew = [...djzArray, ...rdata.infolist]

          that.setData({
            djzArray: djzArrayNew,
            djzAllRows: rdata.infocounts,
            djzEndRow: rdata.endRow,
            djzsearched: true,
            isPullDownRefresh: false,
            isReachBottom: false,

          })
        } else if (currentTab == '4') {
          var yxxArray = [];
          if (isPullDownRefresh) {
            yxxArray = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            yxxArray = that.data.yxxArray;
          }
          var yxxArrayNew = [...yxxArray, ...rdata.infolist]

          that.setData({
            yxxArray: yxxArrayNew,
            yxxAllRows: rdata.infocounts,
            yxxEndRow: rdata.endRow,
            yxxsearched: true,
            isPullDownRefresh: false,
            isReachBottom: false,

          })
        }
      }

      wx.hideLoading();

    })

  }
})
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
    currentTab: 0, // 0编辑中 1活动中 2冻结中 3已下线
    /** */
    swiperHeight: 0,

    searched: false,

    /**编辑中 */
    bjzsearched: false,
    bjzArray: [],
    bjzEndRow: 0,
    bjzAllRows: 0,
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
    var that = this;

    var currentTab = that.data.currentTab;


    if (currentTab == '0') {
      that.setData({
        bjzEndRow: 0,
        bjzAllRows: 0,
      })
    }
    if (currentTab == '1') {
      that.setData({
        hdzEndRow: 0,
        hdzAllRows: 0,
      })
    }
    if (currentTab == '2') {
      that.setData({
        djzEndRow: 0,
        djzAllRows: 0,
      })
    }

    if (currentTab == '3') {
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

    var that = this;

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
      var hdzsearched = that.data.hdzsearched;

      if (!hdzsearched) {
        that.getPromotion()
      }
    }
    if (currentTab == '2') {
      var djzsearched = that.data.djzsearched;

      if (!djzsearched) {
        that.getPromotion()
      }
    }

    if (currentTab == '3') {
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

    var that = this;

    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,

      })
    }
  },
  /**发起 */
  addRequirement: function() {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['QR_CODE'],

      success: function(res) {
        var result = res.result;


        if (result.indexOf("QRCODE") > -1) {

          var paramStr = result.substring(result.indexOf("QRCODE"), result.indexOf("#wechat_redirect"))

          var arryStr = paramStr.split("Q000Q");
          var type = arryStr[1];

          if ("promotion".equals(type)) {

            var pcPromotionId = arryStr[2];
            var pcuserid = arryStr[3];
            var pcuserphone = arryStr[4];



          } else {

            wx.showToast({
              title: '不是有效文案',
              image: '/image/icon_warn.png',
              duration: 2000,
              success: function() {}
            })
          }


        } else {

          wx.showToast({
            title: '二维码无效',
            image: '/image/icon_warn.png',
            duration: 2000,
            success: function() {}
          })
        }

      }
    })


  },


  checkPromotion: function() {
    var that = this;

    var url = config.requestUrl;
    var userid = ''
    var promotionid = ''

    var data = {
      code_: 'x_checkPromotion',
      promotionid: promotionid
    }
    rRequest.doRequest(url, data, that, function(rdata) {
      if (rdata.info) {

        var isUsed = rdata.info.is_used;
        var isBing = rdata.info.is_bing;

        var requirementid = rdata.info.requirement_id;
        var categoryType = rdata.info.category_type;
        var category = rdata.info.category;

        var isEdit = rdata.info.isEdit;


        var requirementPerson = rdata.info.requirement_person;

        if (isUsed == '0') {

          if (isBing == '0') { //没绑定后台

          } else {

            //需求发起页面
          }


        } else if (isUsed == '1') {

          if (isEdit) {

            if (userid == requirementPerson) {
              //需求发起页面
            } else {
              wx.showModal({
                title: '二维码无效',
                content: '',
                showCancel: true,
                confirmText: '知道了',
                success: function() {


                }
              })

            }

          } else {

            //跳转详情页
          }


        }

      }


    })



  },

  showdetail: function(e) {

    var upmarkid = e.currentTarget.dataset.upmarkid;
    var requirementid = e.currentTarget.dataset.id;
    var progressstatus = e.currentTarget.dataset.progress;

    if (progressstatus == '4') {

      // $("#endRow").val("0");
      // window.location.href = "/wiigie/requirement/addPage?u=${userid}&c=V-3&ct=1000000000000012&cc=content_12&r=" + r;



    } else {
      wx.navigateTo({
        url: "/page/component/pages/pagexdd/pagexdd?m=" + upmarkid + "&r=" + requirementid,
      })
     
    }



  },

  /**获取活动 */
  getPromotion: function() {

    var that = this;
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
      endRow = that.data.hdzEndRow;
      allRows = that.data.hdzAllRows;
    } else if (currentTab == '2') {
      endRow = that.data.djzEndRow;
      allRows = that.data.djzAllRows;
    } else if (currentTab == '3') {
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
        } else if (currentTab == '2') {
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
        } else if (currentTab == '3') {
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
// page/component/pages/pagemy/evaluate/evallist/evallist.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**tab */
   
    currentTab: 0, // 0待评价 1待晒单 2 已评价
    refreshpage: '0', //0初始 1 刷新当前 2 追加


    /** */
    swiperHeight: 0,

    searched: false,
    /**待评价 */
    evalsearched_0: false,
    evalArray_0: [],

    /** 待晒单*/
    evalsearched_1: false,
    evalArray_1: [],

    /** 已评价*/
    evalsearched_2: false,
    evalArray_2: [],



    /**分页 */
    itemsPerPage: 10,
    evalEndRow_0: 0,
    evalAllRows_0: 0,
    evalEndRow_1: 0,
    evalAllRows_1: 0,

    evalEndRow_2: 0,
    evalAllRows_2: 0,


    /**用户信息 */
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
    this.getEvaluationNum();
    this.getEvaluations();
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
      
      if (value && value == '1'  ) {
        that.setData({
          refreshpage: 1, //0初始 1 刷新当前 2 追加

        })
        if (currentTab == '0') {
          that.getEvaluationNum();
          that.getEvaluations()
        }
        if (currentTab == '1') {
          that.getEvaluationNum();
          that.getEvaluations()
        }
        if (currentTab == '2') {
          that.getEvaluationNum();
          that.getEvaluations()
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
      var evalsearched_0 = that.data.evalsearched_0;

      if (!evalsearched_0) {
        that.getEvaluations()
      }
    }
    if (currentTab == '1') {
      var evalsearched_1 = that.data.evalsearched_1;

      if (!evalsearched_1) {
        that.getEvaluations()
      }
    }
    if (currentTab == '2') {
      var evalsearched_2 = that.data.evalsearched_2;

      if (!evalsearched_2) {
        that.getEvaluations()
      }
    }
  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {

    let that = this;

    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,

      })
    }
  },
  getEvaluationNum: function() {
    let that = this;

    var url = config.requestUrl;
    var userid =that.data.userInfo.id
    var data = {
      code_: 'x_getEvalNum',
      userid: userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({

          evalAllRows_0: rdata.info.unEvaluation,
          evalAllRows_1: rdata.info.unShowImage,
          evalAllRows_2: rdata.info.hasEvaluation,
        })

      }

    })

  },
  getEvaluations: function() {

    let that = this;
    var currentTab = that.data.currentTab;
    var itemsPerPage = that.data.itemsPerPage;
    var refreshpage = that.data.refreshpage; //0初始 1 刷新当前 2 追加

    var endRow = 0;
    var allRows = 0;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })

    var evaluationType = currentTab
    //待评价
    if (currentTab == '0') {

      endRow = that.data.evalEndRow_0;
      allRows = that.data.evalAllRows_0;
    }
    //待晒单
    if (currentTab == '1') {

      endRow = that.data.evalEndRow_1;
      allRows = that.data.evalAllRows_1;
    }
    //已评价
    if (currentTab == '2') {

      endRow = that.data.evalEndRow_2;
      allRows = that.data.evalAllRows_2;
    }

    if (refreshpage == '0') {
      endRow = 0;
      allRows = 0;
    }
    if (refreshpage == '1') {
      endRow = 0;
      allRows = 0;
    }
    if (refreshpage == '2') {


    }

    var url = config.requestUrl;

    var userid =that.data.userInfo.id

    var data = {
      code_: 'x_getMyEvaluations',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      evaluationType: evaluationType

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        if (currentTab == '0') {

          if (refreshpage == '2') {


          } else {
            that.setData({
              evalsearched_0: true,
              evalEndRow_0: rdata.endRow,
              evalAllRows_0: rdata.infocounts,
              evalArray_0: rdata.infolist,
            })
          }

        }

        if (currentTab == '1') {
          if (refreshpage == '2') {


          } else {
            that.setData({
              evalsearched_1: true,
              evalEndRow_1: rdata.endRow,
              evalAllRows_1: rdata.infocounts,
              evalArray_1: rdata.infolist,
            })
          }
        }


        if (currentTab == '2') {
          if (refreshpage == '2') {


          } else {
            that.setData({
              evalsearched_2: true,
              evalEndRow_2: rdata.endRow,
              evalAllRows_2: rdata.infocounts,
              evalArray_2: rdata.infolist,
            })
          }
        }

      }
      that.setData({
        searched: true,

      })
      wx.hideLoading();

    })



  },
  /**评价晒单 */
  evaladd: function(event) {
    let that = this
 
    var evalid = event.currentTarget.dataset.evalid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/evaluate/evaladd/evaladd?e=' + evalid,
    })
  },
  /**查看评论 */
  evaldeta: function (event) {
    let that = this

    
    var evalid = event.currentTarget.dataset.evalid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/evaluate/evaldeta/evaldeta?e=' + evalid,
    })
  },
  /**添加晒图 */
  evalimge: function (event) {
    let that = this


    var evalid = event.currentTarget.dataset.evalid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/evaluate/evalimge/evalimge?e=' + evalid,
    })
  },
  /**追加评论 */
  evaladdmore: function (event) {
    let that = this


    var evalid = event.currentTarget.dataset.evalid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/evaluate/evaladdm/evaladdm?e=' + evalid,
    })
  },


  
})
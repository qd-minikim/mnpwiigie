// page/component/pages/pagemy/hydtmore/hydtmore.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');

var WxParse = require('../../../../../wxParse/wxParse.js');

var pagehydt = require('../../../../common/pages/pagehydt/pagehydt.js');
const app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},

    currentTab: '0',
    // home5Selected: false,
    // home5Array: [],
    // 好友动态
    home5Array0: [],
    home5Count0: 0,
    home5Selected0: false,
    home5endRow0: 0,

    home5Array1: [],
    home5Count1: 0,
    home5Selected1: false,
    home5endRow1: 0,

    home5Array2: [],
    home5Count2: 0,
    home5Selected2: false,
    home5endRow2: 0,

    home5Array3: [],
    home5Count3: 0,
    home5Selected3: false,
    home5endRow3: 0,

    itemsPerPage: 30,
    scrollViewHeight: 0,

    //是否下拉刷新
    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
    isBottom: false
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
    this.getFriendsActive()
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight
    var screenHeight = res.screenHeight

    var percent = windowWidth / 750
    var scrollViewHeight = windowHeight - 80 * percent
    this.setData({

      scrollViewHeight: scrollViewHeight
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
  
    var currentTab = that.data.currentTab
 
    if (currentTab == '0') {
      that.setData({
        home5endRow0: '0',
        home5Count0: '0',
        isPullDownRefresh: true
      })
    }
    if (currentTab == '1') {

      that.setData({
        home5endRow1: '0',
        home5Count1: '0',
        isPullDownRefresh: true
      })
    }
    if (currentTab == '2') {

      that.setData({
        home5endRow2: '0',
        home5Count2: '0',
        isPullDownRefresh: true
      })
    }
    if (currentTab == '3') {
      that.setData({
        home5endRow3: '0',
        home5Count3: '0',
        isPullDownRefresh: true
      })
    
    }
    that.getFriendsActive()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.setData({
    //   isReachBottom: true
    // })
    // this.getFriendsActive()
  },
  scroll: function(e) {

    var scrollHeight = e.detail.scrollHeight;
    var scrollTop = e.detail.scrollTop
    var scrollViewHeight = this.data.scrollViewHeight

    var maxScrollTop = scrollHeight - scrollViewHeight
 
    if (scrollHeight - scrollTop - scrollViewHeight >= 0 && scrollHeight - scrollTop - scrollViewHeight < 5) {
      var isBottom = this.data.isBottom;

      if (isBottom) {

      } else {

        this.setData({
          isBottom: true
        })
        this.getFriendsActive()
      }
    }

  },

  upper: function(e) {

  },
  lower: function(e) {

    var isReachBottom = this.data.isReachBottom;

    if (isReachBottom) {

    } else {

      this.setData({
        isReachBottom: true
      })
      this.getFriendsActive()
    }


  },
  bindChange: function(e) {

    let that = this;

    var currentTab = e.detail.current;

    that.setData({
      currentTab: currentTab,

      isPullDownRefresh: false,
      isReachBottom: false,
      isRefresh: false,
      isBottom: false,
    });

    if (currentTab == '0') {
      var home5Selected0 = that.data.home5Selected0;
    
      if (!home5Selected0) {
        that.getFriendsActive()

      } 

    }
    if (currentTab == '1') {
      var home5Selected1 = that.data.home5Selected1;
     
      if (!home5Selected1) {
        that.getFriendsActive()
      } 
    }
    if (currentTab == '2') {
      var home5Selected2 = that.data.home5Selected2;
      
      if (!home5Selected2) {
        that.getFriendsActive()
      }  
    }
    if (currentTab == '3') {
      var home5Selected3 = that.data.home5Selected3;
       
      if (!home5Selected3) {
        
      
        that.getFriendsActive()
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
        isPullDownRefresh: false,
        isReachBottom: false,
        isRefresh: false,
        isBottom: false,
      })
     
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //好友动态-详情

  hydtShowDetail: function(event) {
    let that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;
    var actiontype = event.currentTarget.dataset.actiontype;
    // var userid = that.data.userInfo.id;
    pagehydt.pageHydt.showDetail(upmarkid, requirementid, actiontype);


  },
  //获取好友动态
  getFriendsActive: function() {


    let that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;
    var isBottom = that.data.isBottom;

    var currentTab = that.data.currentTab

    var endRow = 0
    var itemsPerPage = that.data.itemsPerPage
    var allRows = 0

    if (currentTab == '0') {

      endRow = that.data.home5endRow0;
      allRows = that.data.home5Count0;
    }
    if (currentTab == '1') {

      endRow = that.data.home5endRow1;
      allRows = that.data.home5Count1;
    }
    if (currentTab == '2') {

      endRow = that.data.home5endRow2;
      allRows = that.data.home5Count2;
    }
    if (currentTab == '3') {

      endRow = that.data.home5endRow3;
      allRows = that.data.home5Count3;
    }

    if (isBottom && allRows == endRow) {

      that.setData({
        isBottom: false,
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
        success: function() {}
      })
      return
    }

    if (isReachBottom) {
      if (allRows == endRow) {

        that.setData({
          isReachBottom: false,
        })

        return false
      }

    } else {

      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
    }


    var url = config.requestUrl;
    var usreId = that.data.userInfo.id

    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var data = {
      code_: 'x_getHome4NewS',
      homepageid: 'homepage_4',
      userid: usreId,
      endRow: endRow,
      currentTab: currentTab,
      itemsPerPage: itemsPerPage,
      windowWidth: windowWidth
    }

    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {
        if (currentTab == '0') {
          var home5Array0 = [];

          if (isPullDownRefresh) {
            home5Array0 = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            home5Array0 = that.data.home5Array0;
          }
          var home5Array0New = [...home5Array0, ...rdata.infolist]

          that.setData({
            home5Array0: home5Array0New,
            home5Selected0: true,
            home5Count0: rdata.infocounts,
            home5endRow0: rdata.endRow,
            
          })

        }
        if (currentTab == '1') {
          var home5Array1 = [];

          if (isPullDownRefresh) {
            home5Array1 = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            home5Array1 = that.data.home5Array1;
          }
          var home5Array1New = [...home5Array1, ...rdata.infolist]

          that.setData({
            home5Array1: home5Array1New,
            home5Selected1: true,
            home5Count1: rdata.infocounts,
            home5endRow1: rdata.endRow,
             
          })

        }
        if (currentTab == '2') {
          var home5Array2 = [];

          if (isPullDownRefresh) {
            home5Array2 = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            home5Array2 = that.data.home5Array2;
          }
          var home5Array2New = [...home5Array2, ...rdata.infolist]

          that.setData({
            home5Array2: home5Array2New,
            home5Selected2: true,
            home5Count2: rdata.infocounts,
            home5endRow2: rdata.endRow,
           
          })

        }
        if (currentTab == '3') {
          var home5Array3 = [];

          if (isPullDownRefresh) {
            home5Array3 = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            home5Array3 = that.data.home5Array3;
          }
          var home5Array3New = [...home5Array3, ...rdata.infolist]

          that.setData({
            home5Array3: home5Array3New,
            home5Selected3: true,
            home5Count3: rdata.infocounts,
            home5endRow3: rdata.endRow,
           
          })

        }
 

      }


      that.setData({
        isPullDownRefresh: false,
        isReachBottom: false,
        isBottom: false,

      })


      wx.hideLoading();
    })


  },
})
// pages/pagegoods/pagegoods.js
var config = require('../../config.js')
var pagegood = require('../../page/common/pages/pagegood/pagegood.js');
var rRequest = require('../../utils/rRequest.js');
var rUserInfo = require('../../utils/rUserInfo.js');
const app = getApp()
// //是否下拉刷新
// var isPullDownRefresh = false
// //是否上拉更多
// var isReachBottom = false
Page({

  /**
   * 页面的初始数据
   */
  data: {

    loginInfo: app.globalData.loginInfo,
    promotiontag: '',


    promotiontagArry: [],

    promotiontagNum: 5, //允许横向显示的个数

    promotiontagCount: 0, //已最小单元划分时，最小单元的个数
    promotiontagWidth: 0, //已最小单元划分时，最小单元的宽度

    goodsArry: [],
    goodsCount: 0,
    goodsSelected: false,
    goodsendRow: 0,
    itemsPerPage: 10,

    windowWidth: 0,
    screenWidth: 0,
    screenHeight: 0,
    windowHeight: 0,

    scrollViewHeight: 0,
    imageSize: 0,

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},


    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
    isBottom: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {
      that.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
      that.promotionTag();
      that.getGoods();
    } else {
      rUserInfo.getUserInfoApp(that, function(rdata) {

        if (app.globalData.userIData) {

          that.setData({
            // userWxInfo: app.globalData.userWxInfo,
            userIData: app.globalData.userIData,
            userInfo: app.globalData.userInfo,
          })
          that.promotionTag();
          that.getGoods();
        }

      })


    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight
    var screenHeight = res.screenHeight
    var screenWidth = res.screenWidth
  
    var percent = windowWidth / 750
    var viewTagHeight = 102 * percent

    this.setData({

      scrollViewHeight: (windowHeight - viewTagHeight),
      windowWidth: windowWidth,
      screenWidth: screenWidth,
      screenHeight: screenHeight,
      windowHeight: windowHeight,
      imageSize: screenWidth
    })
    wx.hideShareMenu();
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

    this.setData({
      goodsendRow: '0',
      goodsCount: '0',
      isPullDownRefresh: true
    })
    this.getGoods();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.setData({
    //   isReachBottom: true
    // })
    // this.getGoods()
  },
  scroll: function(e) {

    var scrollHeight = e.detail.scrollHeight;
    var scrollTop = e.detail.scrollTop
    var scrollViewHeight = this.data.scrollViewHeight

    var maxScrollTop = scrollHeight - scrollViewHeight

    if (scrollHeight - scrollTop - scrollViewHeight >0&&scrollHeight - scrollTop - scrollViewHeight < 10) {
      var isBottom = this.data.isBottom;

      if (isBottom) {

      } else {

        this.setData({
          isBottom: true
        })
        this.getGoods()
      }
    }

  },

  upper: function(e) {
    // this.setData({
    //   goodsendRow: '0',
    //   goodsCount: '0',
    //   isPullDownRefresh: true
    // })
    // this.getGoods();
  },
  lower: function(e) {

    var isReachBottom = this.data.isReachBottom;
    console.log("-----lower---" + isReachBottom)
    if (isReachBottom) {

    } else {

      this.setData({
        isReachBottom: true
      })
      this.getGoods()
    }



  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  goodShowDetail: function(event) {
    let that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;
    var userid = that.data.userInfo.id;
    pagegood.pageGood.showDetail(upmarkid, requirementid);


  },
  promotionTag: function() {
    wx.request({
      url: config.requestUrl, //仅为示例，并非真实的接口地址
      data: {
        code_: 'x_PromotionTag',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {

        var wCount = 1;

        for (var i = 0; i < res.data.infolist.length; i++) {
          var childrenNum = res.data.infolist[i].children_num;

          if (childrenNum == 0) {

            wCount += 1;
          } else {
            wCount += childrenNum;
          }
        }
        var w = this.data.screenWidth
        var n = this.data.promotiontagNum //默认5个
        var lwidth = w / n;
        if (1 <= wCount && wCount <= n) {
          lwidth = w / wCount;
        }
        if (wCount == 0) {
          lwidth = w / 1;
        }


        this.setData({
          promotiontagArry: res.data.infolist,

          promotiontagCount: wCount,
          promotiontagWidth: lwidth + "px"
        })

      }
    })
  },

  selectTag: function(event) {

      var tagCode = event.currentTarget.dataset.tagcode;
      var oldTagCode = this.data.promotiontag;
      if (tagCode == oldTagCode) {
        return false;
      } else {
        this.setData({
          goodsArry: [],
          goodsCount: 0,
          goodsSelected: false,
          goodsendRow: 0,
          promotiontag: tagCode,
          isPullDownRefresh: false,
          isReachBottom: false,
          isBottom: false,
        })

        this.getGoods();

      }

    }

    ,

  getGoods: function() {

    let that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;
    var isBottom = that.data.isBottom;

    var endRow = that.data.goodsendRow
    var itemsPerPage = that.data.itemsPerPage
    var goodsCount = that.data.goodsCount
    //isReachBottom &&
    if (isBottom && goodsCount == endRow) {

      that.setData({
        isBottom: false,
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
        success: function() {}
      })
      return false
    }

    if (isReachBottom) {
      if ( goodsCount == endRow) {

        that.setData({
          isReachBottom: false,
        })
       
        return false
      }
      // itemsPerPage=5;
      // wx.showLoading({
      //   title: '加载中...',
      //   mask: false,
      // })
    } else {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
    }

    var url = config.requestUrl;
    var usreId = that.data.userInfo.id
    var tag = this.data.promotiontag;



    var data = {
      code_: 'x_getGoods',
      goodspageid: 'goodspage_1',
      userid: usreId,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      promotiontag: tag,
    }


    wx.request({
      url: url, //对外地址
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: res => {

        if (res.data.infolist) {

          var goodsArry = [];
          var goodsArryNew = [];
          if (isPullDownRefresh) {
            goodsArry = [];

            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            goodsArry = that.data.goodsArry;

          }

          goodsArryNew = goodsArry.concat(res.data.infolist);

          that.setData({

            goodsArry: goodsArryNew,

            goodsSelected: true,
            goodsCount: res.data.infocounts,
            goodsendRow: res.data.endRow,
            // isPullDownRefresh: false,
            // isReachBottom: false,
          })


        }
      },
      fail: res => {

      },
      complete: res => {

        that.setData({
          isPullDownRefresh: false,
          isReachBottom: false,
          isBottom: false,
        })
        wx.hideLoading();
      }
    })


  }

})
// pages/pagegoods/pagegoods.js
var config = require('../../config.js')
var pagegood = require('../../page/common/pages/pagegood/pagegood.js');
var rRequest = require('../../utils/rRequest.js');
const app = getApp()
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

    windowWidth: app.globalData.systemInfo.windowWidth,
    screenWidth: app.globalData.systemInfo.screenWidth,
    windowHeight: app.globalData.systemInfo.windowHeight,
    scrollViewHeight: 0,
    imageSize: app.globalData.systemInfo.screenWidth,

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},



    //是否下拉刷新
    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
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

    this.promotionTag();
    this.getGoods();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    var windowWidth = this.data.screenWidth
    var percent = windowWidth / 750
    var viewTagHeight = 100 * percent

    this.setData({

      scrollViewHeight: (this.data.windowHeight - viewTagHeight - 5) + "px"
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
    this.setData({
      isReachBottom: true
    })
    this.getGoods()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  goodShowDetail: function(event) {
    var that = this;

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
        console.log("tag=1=" + res.data.infolist)

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

      this.setData({
        promotiontag: tagCode,
      })

      this.getGoods();
    }

    ,

  getGoods: function() {


    var that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;

    var endRow = that.data.goodsendRow
    var itemsPerPage = that.data.itemsPerPage
    var goodsCount = that.data.goodsCount

    if (isReachBottom && goodsCount == endRow) {

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

    var url = config.requestUrl;
    var usreId = that.data.userInfo.id
    var tag = this.data.promotiontag;

    wx.showLoading({
      title: '加载中...',
      mask: true,
    })

    var data = {
      code_: 'x_getGoods',
      goodspageid: 'goodspage_1',
      userid: usreId,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      promotiontag: tag,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        var goodsArry = [];

        if (isPullDownRefresh) {
          goodsArry = [];

          wx.stopPullDownRefresh();
        }
        if (isReachBottom) {
          goodsArry = that.data.goodsArry;
        }
        var goodsArryNew = [...goodsArry, ...rdata.infolist]


        that.setData({

          goodsArry: goodsArryNew,

          goodsSelected: true,
          goodsCount: rdata.infocounts,
          goodsendRow: rdata.endRow,
          isPullDownRefresh: false,
          isReachBottom: false,
        })
      }


      wx.hideLoading();
    })

  }

})
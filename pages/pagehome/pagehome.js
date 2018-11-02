// pages/pagehome/pagehome.js
const app = getApp()

var rCommon = require('../../utils/rCommon.js');
var rRequest = require('../../utils/rRequest.js');
var config = require('../../config.js')
var WxParse = require('../../wxParse/wxParse.js');

var pagehydt = require('../../page/common/pages/pagehydt/pagehydt.js');
Page({
  data: {
    motto: 'Hello World',


    defaultInfo: {
      searchHolder: '检索好友昵称或活动主题、描述',
      askText: '通知',
      askIcon: '/image/ask_0.png',
      // swiper属性
      swiperImgUrls: ['/image/home_swiper_1.jpg'],
      swiperIndicatorDots: true, //是否显示指示点   
      swiperAutoplay: true, //是否自动切换
      swiperInterval: 2000, //自动切换时间间隔
      swiperDuration: 500, //duration 滑动动画时长
      //home-3
      home3Figure1: '/image/figure_1.png',
      home3Text: ['好友互荐', '正品保证', '无忧退货', '全场包邮'],
      //home-4
      home4Figure1: ['', ''],
      home4Figure2: ['/image/figure_2.png', '/image/figure_3.png'],
      home4Text1: ['人以群分', '物以类聚'],
      home4Text2: ['分众崛起:互荐+优享', '消费升级:精致+别样'],
      home4Text3: ['', ''],
      //home-5
      home5Text1: '~好友动态~',
      home5Array: [],
      //home-6
      home6Text1: '~人气推荐~',
      home6Array: []
    },


    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},

    // loginInfo: {},
    // // systemBaseInfo: {},
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {

    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })


      this.homepageCarousel();
      //好友动态
      this.getFriendsActive();
      //人气推荐
      this.getPopularity();
    }

  },
  onShow: function() {


  },
  onReady: function() {

    wx.hideShareMenu()

  },
  //检索
  homeSerarch: function() {

    wx.navigateTo({
      url: "/page/component/pages/pageserch/serchlist/serchlist"
    })

  },
  //通知
  homeNotice: function() {

    wx.navigateTo({
      url: "/page/component/pages/pagewait/pagewait"
    })

  },
  //人以群分
  homePerson: function() {

    wx.navigateTo({
      url: "/page/component/pages/pagemy/friends/myfriends/myfriends"
    })

  },
  //物以类聚
  homeGoods: function() {
    wx.switchTab({
      url: '/pages/pagegoods/pagegoods',
    })
  

  },

  //获取swiper 图片
  homepageCarousel: function () {
    var that = this;
   
    var url = config.requestUrl;
    
    var data = {
      code_: 'x_getImageInfo',
      "imagetype":"homepage_carousel"
    }
    rRequest.doRequest(url, data, that, function (rdata) {

      if (rdata.infolist){
          that.setData({

            'defaultInfo.swiperImgUrls': rdata.infolist
          })
        }

    })

  },
  //点击banner进入web-view页面
  webPage: function (e) {

    var  path = e.currentTarget.dataset.webpath
    wx.navigateTo({
      url: '/page/component/pages/pageweb/pageweb?webpath=' + path,
    }) 


  },
  //点击头像进入 我的
  mypage: function (e) {
 
    wx.switchTab({
      url: '/pages/pagemy/pagemy',
    })


  },
  //获取好友动态
  getFriendsActive: function() {


    var that = this;
    var url = config.requestUrl;
    var usreId = that.data.userInfo.id
    var data = {
      code_: 'x_getHome4',
      homepageid: 'homepage_4',
      userid: usreId,
      endRow: '0',
      itemsPerPage: '10',
      windowWidth: app.globalData.systemInfo.windowWidth
    }
    rRequest.doRequest(url, data, that, function(rdata) {
      console.log("-----------------")
      if (rdata.infolist) {


        that.setData({
          home5Array: rdata.infolist
        })

        var actiontyArr = [];

        for (let i = 0; i < rdata.infolist.length; i++) {
          actiontyArr.push(rdata.infolist[i].actiontypename);
        }

        for (let i = 0; i < actiontyArr.length; i++) {
          WxParse.wxParse('actionty' + i, 'html', actiontyArr[i], that);
          if (i === actiontyArr.length - 1) {
            WxParse.wxParseTemArray("actiontyTemArray", 'actionty', actiontyArr.length, that)
          }
        }

      }
    })


  },
  //获取人气推荐
  getPopularity: function() {
    var that = this;
    var url = config.requestUrl;
    var usreId = that.data.userInfo.id
    var data = {
      code_: 'x_getHome7',
      homepageid: 'homepage_7',
      userid: usreId,
      endRow: '0',
      itemsPerPage: '10',
      windowWidth: app.globalData.systemInfo.windowWidth
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        that.setData({
          home6Array: rdata.infolist
        })
      }
    })

  },


  //好友动态-详情

  hydtShowDetail: function(event) {
    var that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;
    var userid = that.data.userInfo.id;
    pagehydt.pageHydt.showDetail(upmarkid, requirementid, userid);


  },

  //人气推荐-详情


  
})
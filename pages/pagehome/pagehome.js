// pages/pagehome/pagehome.js
const app = getApp()

var config = require('../../config.js')

Page({
  data: {
    motto: 'Hello World',
  

    defaultInfo: {
      searchHolder: '检索好友昵称或活动主题、描述',
      askText: '通知',
      askIcon: '/image/ask_0.png',
      // swiper属性
      swiperImgUrls: ['/image/home_swiper_1.jpg', '/image/home_swiper_2.jpg'],
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
      home5Array:[],
      //home-6
      home6Text1: '~人气推荐~',
      home6Array:[]
    },
    userInfo: {},

    hasUserInfo: false,

    loginInfo: {},
    // systemBaseInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      
      })
    }  
    if (app.globalData.loginInfo) {
      this.setData({
        loginInfo: app.globalData.loginInfo,
 

      })
    //好友动态
      this.getFriendsActive();
    //人气推荐
      this.getPopularity();
    } 

  },
  onShow: function() {


    }

    ,
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //检索
  homeSerarch: function() {

    wx.navigateTo({
      url: "/page/component/pages/pagewait/pagewait"
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
      url: "/page/component/pages/pagewait/pagewait"
    })

  },
  //物以类聚
  homeGoods: function() {

    wx.navigateTo({
      url: "/page/component/pages/pagewait/pagewait"
    })

  },
  //获取好友动态
  getFriendsActive: function() {
    var usreId = this.data.loginInfo.userid
    wx.request({
      url: config.requestUrl, //仅为示例，并非真实的接口地址
      data: {
        code_: 'x_getHome4',
        homepageid: 'homepage_4',
        userid: usreId,
        endRow: '0',
        itemsPerPage: '10',
        windowWidth: app.globalData.systemInfo.windowWidth
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        this.setData({
          home5Array: res.data.infolist
        })
        
      }
    })

  },
//获取人气推荐
  getPopularity: function () {
    var usreId = this.data.loginInfo.userid
    wx.request({
      url: config.requestUrl, //仅为示例，并非真实的接口地址
      data: {
        code_: 'x_getHome7',
        homepageid: 'homepage_7',
        userid: usreId,
        endRow: '0',
        itemsPerPage: '10',
        windowWidth: app.globalData.systemInfo.windowWidth
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        this.setData({
          home6Array: res.data.infolist
        })

      }
    })

  },


  //好友动态-详情

  //人气推荐-详情


})
// pages/pagehome/pagehome.js
const app = getApp()

var config = require('../../config.js')

Page({
  data: {
    motto: 'Hello World',
    // modal: {
    //   modalhidden: true,
    //   modaltitle: '',
    //   modalnocancel: true,
    //   modalinfo: 'sdfsf',
    // },

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
      //home-6
      home6Text1: '~人气推荐~',
    },
    userInfo: {},

    hasUserInfo: false,
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
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
 

          })
        }
      })
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

    wx.request({
      url: config.requestUrl, //仅为示例，并非真实的接口地址
      data: {
        code_: 'x_getHome4',
        homepageid: 'homepage_4',
        userid: '',
        endRow: '0',
        itemsPerPage: '10',
        windowWidth: app.globalData.systemInfo.windowWidth
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
      }
    })

  },
  //好友动态-详情

  //人气推荐-详情


})
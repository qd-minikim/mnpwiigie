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
      home3Text: ['好友互荐', '链购优享', '全场包邮', '正品保障'],
      //home-4
      home4Figure1: ['', ''],
      home4Figure2: ['/image/figure_2.png', '/image/figure_3.png'],
      home4Text1: ['分众崛起', '消费升级'],
      home4Text2: ['行家好友:洞察+互荐', '心仪好物:感知+优享'],
      home4Text3: ['', ''],
      //home-5
      home5Text1: '~好友的洞察~',
      home5Array: [],
      home5Count: 0,
      home5Selected: false,
      //home-6
      home6Text1: '-人气推荐-',
      home6Array: [],
      home6Count: 0
    },
    scrollView: {
      width: 0,
      height: 0
    },
    /**msg配置信息 */
    configMsgInfo: {},

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},

    // loginInfo: {},
    // // systemBaseInfo: {},
    // canIUse: wx.canIUse('button.open-type.getUserInfo')

    noticeNoReadNum:0,

    clickpageflg:''
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {


    wx.showLoading({
      title: '正在更新...',
      mask: true,
    })
    this.homepageCarousel();
    //好友动态
    this.getFriendsActive();
    //人气推荐
    this.getPopularity();
    //配置信息
    this.getConfigMsgInfo();

    this.getNoticeSumNum();
    
    setTimeout(function(){
      wx.stopPullDownRefresh();
      wx.hideLoading();
    },2500)
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    console.log("-------------------")
    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {
      
      this.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })


      this.homepageCarousel();
      //好友动态
      this.getFriendsActive();
      //人气推荐
      this.getPopularity();
      //配置信息
      this.getConfigMsgInfo()

      
    }

  },
  onShow: function() {
 
      this.getNoticeSumNum()
   
  },
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight
    var screenHeight = app.globalData.systemInfo.screenHeight

    var pixelRatio = app.globalData.systemInfo.pixelRatio
    var percent = windowWidth / 750
    var scrollViewHeight = windowHeight - 80 * percent - 130  * percent
    this.setData({
 
      'scrollView.height': scrollViewHeight
    })
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
    //url: "/page/component/pages/pagewait/pagewait"
  
    wx.navigateTo({
     
     url :"/page/component/pages/pageinform/notice/summarypage/summarypage"
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
  homepageCarousel: function() {
    let that = this;

    var url = config.requestUrl;

    var data = {
      code_: 'x_getImageInfo',
      "imagetype": "homepage_carousel"
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {
        that.setData({

          'defaultInfo.swiperImgUrls': rdata.infolist
        })
      }

    })

  },
  //点击banner进入web-view页面
  webPage: function(e) {

    var path = e.currentTarget.dataset.webpath
    wx.navigateTo({
      url: '/page/component/pages/pageweb/pageweb?webpath=' + path,
    })


  },
  //点击头像进入 我的
  mypage: function(e) {

    wx.switchTab({
      url: '/pages/pagemy/pagemy',
    })


  },
  /**获取配置描述 */
  getConfigMsgInfo: function() {
    let that = this;
    var url = config.requestUrl;
    var values = [{
        code: 'FDYNAMIC_MSG',
        replace: []
      }

    ];


    var data = {
      code_: 'x_getConfigMsgInfo',
      /**[{code:xxxx,replace:[{regexp:xxx,replacement:xxxx},{}]},{}] */
      values: values
    }
    rCommon.configMsgInfo.getConfigMsg(url, data, that, function(rdata) {
      if (rdata.info) {

        that.setData({
          configMsgInfo: rdata.info,

        })

      }

    });

  },
  //获取好友动态
  getFriendsActive: function() {


    let that = this;
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

      if (rdata.infolist) {


        that.setData({
          home5Array: rdata.infolist,
          home5Selected: true,
          home5Count: rdata.infocounts
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
  //获取好友动态
  getNoticeSumNum: function () {


    let that = this;
    var url = config.requestUrl;
    var usreId = that.data.userInfo.id
    var data = {
      code_: 'x_getNoticeSumNum',
      userid: usreId,
      
    }
    rRequest.doRequest(url, data, that, function (rdata) {

      if (rdata.info) {
          that.setData({
            noticeNoReadNum: rdata.info.cou ?rdata.info.cou:0
          })
          //cou
      }
    })


  },
  /**更多好友动态 */
  morehydt: function(e) {

 
    wx.navigateTo({
      url: '/page/component/pages/pagemy/hydtmore/hydtmore',
    })
  },

  //获取人气推荐
  getPopularity: function() {
    let that = this;
    var url = config.requestUrl;
    var usreId = that.data.userInfo.id
    var data = {
      code_: 'x_getHome7',
      homepageid: 'homepage_7',
      userid: usreId,
      endRow: '0',
      itemsPerPage: '4',
      windowWidth: app.globalData.systemInfo.windowWidth
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        that.setData({
          home6Array: rdata.infolist,
          home6Count: rdata.infocounts
        })
      }
    })

  },


  //好友动态-详情

  hydtShowDetail: function(event) {
    let that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;
    var userid = that.data.userInfo.id;
    pagehydt.pageHydt.showDetail(upmarkid, requirementid, userid);


  },

  //人气推荐-详情

  rqtjShowDetail: function(event) {
    let that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;
    var userid = that.data.userInfo.id;
    pagehydt.pageHydt.showDetail(upmarkid, requirementid, userid);


  },

})
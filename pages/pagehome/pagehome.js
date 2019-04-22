// pages/pagehome/pagehome.js
const app = getApp()

var rCommon = require('../../utils/rCommon.js');
var rRequest = require('../../utils/rRequest.js');
var config = require('../../config.js')
var WxParse = require('../../wxParse/wxParse.js');
var rAdvUtils = require('../../utils/rAdvUtils.js');
var rUserInfo = require('../../utils/rUserInfo.js');
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
      home4Text2: ['行家好友:发现+互荐', '心仪好物:感知+优享'],
      home4Text3: ['', ''],
      
      //home-5
      home5Text1: '~好友发现~',
      home5Array: [],
      home5Count: 0,
      home5Selected: false,
      home5PagaSize:3,
      //home-6
      home6Text1: '-人气推荐-',
      home6Array: [],
      home6Count: 0,
      home6Selected: false,
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
  onLoad: function (options) {
     var that = this;
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
     

      if (options.advc && options.advp){
        var loginstatus = app.globalData.loginInfo.loginstatus;
        var isNew = loginstatus == 'ok' ? '0' : '1'//0不是；1是新用户
        var pdata = {
          'isNew': isNew,
          'advCode': options.advc,
          'positionCode': options.advp,
          'pageType':'0',
          'userId': that.data.userInfo.id,
          'parameters': options,
        }
        rAdvUtils.adv.doadv(that, pdata);

      }
 
    } else {

      rUserInfo.getUserInfoApp(that, function (rdata) {

        if (app.globalData.userIData) {
          that.setData({

            userIData: app.globalData.userIData,
            userInfo: app.globalData.userInfo,
          })

          that.homepageCarousel();
          //好友动态
          that.getFriendsActive();
          //人气推荐
          that.getPopularity();
          //配置信息
          that.getConfigMsgInfo()


          if (options.advc && options.advp) {
            var loginstatus = app.globalData.loginInfo.loginstatus;
            var isNew = loginstatus == 'ok' ? '0' : '1'//0不是；1是新用户
            var pdata = {
              'isNew': isNew,
              'advCode': options.advc,
              'positionCode': options.advp,
              'pageType': '0',
              'userId': that.data.userInfo.id,
              'parameters': options,
            }
            rAdvUtils.adv.doadv(that, pdata);

          }
        }

      })
    }

  },
  onShow: function() {
 
      this.getNoticeSumNum()
   
  },
  onReady: function() {


    const res = wx.getSystemInfoSync()
    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight
    var screenHeight = res.screenHeight
 
    var percent = windowWidth / 750
    var scrollViewHeight = windowHeight - 90 * percent 
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
    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth

    let that = this;
    var url = config.requestUrl;
    var usreId = that.data.userInfo.id

    var home5PagaSize = that.data.defaultInfo.home5PagaSize
    var data = {
      code_: 'x_getHome4NewS',
      homepageid: 'homepage_4',
      userid: usreId,
      endRow: '0',
      itemsPerPage: home5PagaSize,
      windowWidth: windowWidth
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {


        that.setData({
          home5Array: rdata.infolist,
          home5Selected: true,
          home5Count: rdata.infocounts
        })
 
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

    wx.switchTab({
      url: '/pages/pagehydt/pagehydt',
    })
    // wx.navigateTo({
    //   url: '/page/component/pages/pagemy/hydtmore/hydtmore',
    // })
  },
  /** */
  moregoods: function (e) {

    wx.switchTab({
      url: '/pages/pagegoods/pagegoods',
    })
 
  },
  
  //获取人气推荐
  getPopularity: function() {

    const res = wx.getSystemInfoSync()
    var windowWidth = res.windowWidth
    let that = this;
    var url = config.requestUrl;
    var usreId = that.data.userInfo.id
    var data = {
      code_: 'x_getHome7',
      homepageid: 'homepage_7',
      userid: usreId,
      endRow: '0',
      itemsPerPage: '4',
      windowWidth: windowWidth
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        that.setData({
          home6Array: rdata.infolist,
          home6Count: rdata.infocounts,
          home6Selected:true
        })
      }
    })

  },


  //好友动态-详情

  hydtShowDetail: function(event) {
    let that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;
    var actiontype = event.currentTarget.dataset.actiontype;
    pagehydt.pageHydt.showDetail(upmarkid, requirementid, actiontype);


  },

  //人气推荐-详情

  rqtjShowDetail: function(event) {
    let that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;
    // var userid = that.data.userInfo.id;
    // pagehydt.pageHydt.showDetail(upmarkid, requirementid, userid);
    wx.navigateTo({
      url: "/page/component/pages/pagexdd/pagexdd?m=" + upmarkid + "&r=" + requirementid,
    })

  },

})
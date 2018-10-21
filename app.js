//app.js
var config = require('/config.js')
var WXBizDataCrypt = require('/utils/WXBizDataCrypt.js')
var rCommon = require('/utils/rCommon.js');
var rRequest = require('/utils/rRequest.js');
App({
  //启动时执行的初始化工作
  onLaunch: function() {
    this.getSystemInfo();
  },
  globalData: {
    userInfo: null, //用户信息--wiigie
    userIData: false,
    userWxInfo: null, //用户微信信息--wiigie
    systemInfo: null,
    //登录信息
    loginInfo: null, //用户登录信息{appId:,sessionKey}
    cacheInfo: {
      pagexdd_p_1: null,
    },


    orderData: null,/**赋值在 pagexdd.js中 sureSelect //funtion */
    giftData: null,/**赋值在 giftdetar.js中 receiveAddress //funtion */
    
    /** 底部按钮的高度*/
    bottomBtnHeight: 110, //flex-bottom  同步修改
    /** */

    tabbarHeight: 110, //pagetabbar.wxss 同步修改
    tabbar: {
      "color": "#000000",
      "selectedColor": "#00c003",
      "backgroundColor": "#ffffff",
      "borderStyle": "black",
      "list": [{
          "pagePath": "/pages/pagehome/pagehome",
          "text": "好友冰鉴",
          "iconPath": "/image/home_0.png",
          "selectedIconPath": "/image/home_1.png"
        },
        {
          "pagePath": "/pages/pagegoods/pagegoods",
          "text": "好物精选",
          "iconPath": "/image/goods_0.png",
          "selectedIconPath": "/image/goods_1.png"
        },
        {
          "pagePath": "/pages/pagemy/pagemy",
          "text": "我的",
          "iconPath": "/image/my_0.png",
          "selectedIconPath": "/image/my_1.png"
        }
      ],
      position: "bottom"
    }


  },
  //获取设备信息
  getSystemInfo: function() {
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res
      },
      fail: res => {},
      complete: res => {},
    })
  },


  userInfoResetCallBak: function(res) {
    var that = this;
    // that.setData({
    //   'globalData.userInfo': res.userInfo,
    //   'globalData.userIData ': true
    // })
  },

  getUsersInfo: function() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {

        that.globalData.userWxInfo = res.userInfo;


        var appId = that.globalData.loginInfo.appId
        var sessionKey = that.globalData.loginInfo.sessionKey
        var pc = new WXBizDataCrypt(appId, sessionKey)
        var data = pc.decryptData(res.encryptedData, res.iv)
        var url = config.userInfoUrl;
        var data = {
          miniopenId: data.openId,
          nickname: encodeURIComponent(data.nickName),
          sex: data.gender,
          city: encodeURIComponent(data.city),
          country: encodeURIComponent(data.country),
          province: encodeURIComponent(data.province),
          avatarUrl: data.avatarUrl,
          unionid: data.unionId,
        }
        rRequest.doRequest(url, data, that, function(rdata) {

          if (rdata.info) {
            that.globalData.userInfo = rdata.info;
            that.globalData.userIData = true;
            wx.switchTab({
              url: '/pages/pagehome/pagehome',
            })

            rCommon.userDefAddr.getUserDefAddr(that, rdata.info.id);
          }


        })

      }
    })
  },


  /**导航栏 */
  editTabBar: function() {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.data.tabbarPage
    if (pagePath) {


    } else {
      pagePath = _this.__route__;
    }

    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    var windowWidth = this.globalData.systemInfo.windowWidth
    var windowHeight = this.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750
    var scrollHeight = windowHeight - this.globalData.tabbarHeight * percent
    _this.setData({
      tabbar: tabbar,
      'pageScrollView.height': scrollHeight + "px"
    });


  },
  editBottom: function() {
    var currentPages = getCurrentPages(),
      this_ = currentPages[currentPages.length - 1];

    var windowWidth = this.globalData.systemInfo.windowWidth
    var windowHeight = this.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750
    var scrollHeight = windowHeight - this.globalData.bottomBtnHeight * percent

    if (this_.data.pageview.bottomView) {


      this_.setData({
        'pageview.scrollviewHeight': scrollHeight + "px"
      });
    }

  }

})
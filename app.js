//app.js
var config = require('/config.js')
var WXBizDataCrypt = require('/utils/WXBizDataCrypt.js')
var rCommon = require('/utils/rCommon.js');
var rRequest = require('/utils/rRequest.js');

var defauthtime=3;
App({

  //启动时执行的初始化工作
  onLaunch: function() {

    wx.setStorage({
      key: "cardpage",
      data: "",
    })

    this.getSystemInfo();


    // this.userLogin();


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
    // 订单处理时，录入快递单号时，选择快递公司
    carrierInfo: '',

    orderData: null,
    /**赋值在 pagexdd.js中 sureSelect //funtion */
    giftData: null,
    /**赋值在 giftdetar.js中 receiveAddress //funtion */

    /** 底部按钮的高度*/
    bottomBtnHeight: 90, //flex-bottom  同步修改
    /** */

    tabbarHeight: 90, //pagetabbar.wxss 同步修改
    tabbar: {
      "color": "#a0a0a0",
      "selectedColor": "#00c003",
      "backgroundColor": "#ffffff",
      "borderStyle": "#e4e5e4",
      "list": [{
          "pagePath": "/pages/pagehome/pagehome",
          "text": "好友",
          "iconPath": "/image/home_0.png",
          "selectedIconPath": "/image/home_1.png"
        },
        {
          "pagePath": "/pages/pagegoods/pagegoods",
          "text": "好物",
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
    let that = this
    wx.getSystemInfo({
      success: res => {
        that.globalData.systemInfo = res
      },
      fail: res => {},
      complete: res => {},
    })
  },


  userInfoResetCallBak: function(res) {
    let that = this;

  },
  //先登录
  userLogin: function() {
    let that = this;
    wx.login({
      success: res => {
        var url = config.loginUrl;
        var data = {
          code: res.code
        }
        rRequest.doRequest(url, data, that, function(rdata) {

          if (rdata.info) {

            if (rdata.info.loginfo.loginstatus == 'ok') { //存在老用户

              that.globalData.loginInfo = rdata.info.loginfo
              that.globalData.userInfo = rdata.info.userinfo
              that.globalData.userIData = true
              rCommon.userDefAddr.getUserDefAddr(that, rdata.info.userinfo.id);

              var authtime = rdata.info.authtime && rdata.info.authtime != '' && parseInt(rdata.info.authtime)>0 ? rdata.info.authtime :defauthtime
              var authorizetime = wx.getStorageSync('authorizetime')
              var d = new Date()
              var longintimme = d.getTime();
              var t = parseInt(longintimme) - parseInt(authorizetime == '' ? 0 : authorizetime)

              var s = Number(authtime)*24*60*60*1000;
              if (authorizetime == '' || t > s) {//3天

                wx.setStorage({
                  key: "authorizetime",
                  data: longintimme,
                })
                that.getSettingInfo();

              } else {

                that.redirectPage()
              }
        

            } else if (rdata.info.loginfo.loginstatus == 'noexist') { //不存在老用户
              that.globalData.loginInfo = rdata.info
              that.getSettingInfo();
            } else {


            }



          }
        })

      }, fail: e => {

        console.log("3333333333"+e)
      }, complete: e => {

        console.log("33333333223333" + e)
      }
    })
  },
  getSettingInfo: function() { // 查看是否授权
    let that = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          that.getUsersInfo();
        } else {
          console.log("用户信息未授权--")

          // wx.reLaunch({ ///pages/pagehome/pagehome
          //   url: '/pages/pagewelcome/pagewelcome',
          // })

        }
      },
      fail: function(res) {
        console.log("授权失败--")
      },
    })
  },

  getUsersInfo: function() {
    let that = this;
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


            rCommon.userDefAddr.getUserDefAddr(that, rdata.info.id);


            that.redirectPage()
          }


        })

      },
      fail: function(e) {

        console.log("--------fail---------" + e)
      },
      complete: function(e) {

        console.log("--------complete---------")
      }
    })
  },

  redirectPage: function() {
    var pages = getCurrentPages() //获取加载的页面

    var currentPage = pages[pages.length - 1] //获取当前页面的对象

    var url = currentPage && currentPage.route ? currentPage.route : '' //当前页面url
    var page = ""
    try {
      page = wx.getStorageSync('cardpage')
      wx.setStorage({
        key: "cardpage",
        data: "",
      })
    } catch (e) {

    }


    if (page != "") {
      if (page.indexOf("/page/component/pages/pagexdd/pagexdd") > -1) {

        wx.reLaunch({
          url: page,
        })
      }
      if (page.indexOf("/page/component/pages/pagegift/giftreceive/giftreceive") > -1) {
        wx.reLaunch({
          url: page,
        })
      }
      if (page.indexOf("/page/component/pages/pagecount/counthome/counthome") > -1) {
        wx.reLaunch({
          url: page,
        })
      }
      if (page.indexOf("/page/component/pages/pagegift/giftgivesucc/giftgivesucc") > -1) {
        wx.reLaunch({
          url: page,
        })
      }
      if (page.indexOf("/page/component/pages/pageinform/scanpage/scanpage") > -1) {
        wx.reLaunch({
          url: page,
        })
      }



    } else {
      wx.switchTab({
        url: '/pages/pagehome/pagehome',
      })

    }
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

  },

})
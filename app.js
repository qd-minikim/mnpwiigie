//app.js
var config = require('/config.js')
var WXBizDataCrypt = require('/utils/WXBizDataCrypt.js')
App({
  //启动时执行的初始化工作
  onLaunch: function() {
    this.getSystemInfo();
    this.userLogin();

  },
  globalData: {
    userInfo: null,
    userIData: false,
    systemInfo: null,
    loginInfo: null,
    cacheInfo: {
      pagexdd_p_1: null,

    },

    /** 底部按钮的高度*/
    bottomBtnHeight: 120, //flex-bottom  同步修改
    /** */

    tabbarHeight: 120, //pagetabbar.wxss 同步修改
    tabbar: {
      // color: "#000000",
      selectedColor: "#00c003",
      // backgroundColor: "#ffffff",
      // borderStyle: "black",
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
  //先登录
  userLogin: function() {
    wx.login({
      success: res => {

        wx.showToast({
          title: '正在登录...',
          duration: 5000,
          icon: 'loading'
        })

        wx.request({
          url: config.loginUrl,
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {
            //console.log("返回成功2--"+res.data)

            this.globalData.loginInfo = res.data.info
            this.getUserInfoF();
          }
        })


        //this.getUserInfoF();
      }
    })
  },

  /** */
  getUserInfoF: function() {
    var that = this;

    wx.getUserInfo({
      success: function(res) {

        that.globalData.userInfo = res.userInfo
        that.globalData.userIData = true
        //     newUserInfo.setId(id);
        //			newUserInfo.setOpenid(openId);
        //			newUserInfo.setWxStatus("1");//0：未关注  1  ：关注
        //			newUserInfo.setMgmtStatus("0");
        //			newUserInfo.setCreateTime(systemTime);
        //			
        //			newUserInfo.setNickname(CfgParamUtils.getString(map.get("nickname")));
        //			newUserInfo.setSex(CfgParamUtils.getString(map.get("sex")));
        //			newUserInfo.setCity(CfgParamUtils.getString(map.get("city")));
        //			newUserInfo.setCountry(CfgParamUtils.getString(map.get("country")));
        //			newUserInfo.setProvince(CfgParamUtils.getString(map.get("province")));
        //			newUserInfo.setUnionid(CfgParamUtils.getString(map.get("unionid")));
        var appId = that.globalData.loginInfo.appId
        var sessionKey = that.globalData.loginInfo.sessionKey
        var pc = new WXBizDataCrypt(appId, sessionKey)

        var data = pc.decryptData(res.encryptedData, res.iv)
        wx.request({
          url: config.userInfoUrl,
          data: {
            miniopenId: data.openId,
            nickname: data.nickName,
            sex: data.gender,
            city: data.city,
            country: data.country,
            province: data.province,
            unionid: data.unionId,
          },
        })

        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }

        wx.hideToast();

      },
      fail: function() {
        //wx.hideToast();

      }
    })




    // wx.getSetting({
    //   success: res => {
    //     console.info("确定" + res);

    //     if (res.authSetting['scope.userInfo']) {

    //     }
    //   }

    // })
  },
  userInfoResetCallBak: function(res) {
    var that = this;
    that.setData({
      'globalData.userInfo': res.userInfo,
      'globalData.userIData ': true
    })
  },


  // cancel: function () {
  //   this.setData({

  //     'modal.modalhidden': true,
  //   });
  // },
  // confirm: function () {
  //   this.setData({
  //     'modal.modalhidden': true,
  //   });

  // }


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
  editBottom:function(){
    var currentPages = getCurrentPages(),
    this_ = currentPages[currentPages.length - 1];

    var windowWidth = this.globalData.systemInfo.windowWidth
    var windowHeight = this.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750
    var scrollHeight = windowHeight - this.globalData.bottomBtnHeight * percent

    if (this_.data.pageview.bottomView){


      this_.setData({
        'pageview.scrollviewHeight': scrollHeight + "px"
      });
    }

  }

})
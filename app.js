//app.js
var config = require('config.js')
App({
  //启动时执行的初始化工作
  onLaunch: function() {
    this.getSystemInfo();
    this.userLogin();
   // this.getUserInfoF();
 
  },
  globalData: {
    userInfo: null,
    systemInfo: null
  },
  //获取设备信息
  getSystemInfo: function () {
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res
      },
      fail: res => { },
      complete: res => { },
    })
  },
//先登录
  userLogin: function(){
    wx.login({
      success: res => {
        wx.showNavigationBarLoading()
        wx.showToast({
          title: 'Loading……',
          duration: 3000,
          icon: 'loading'
        })
        this.getUserInfoF();
      }
    })
  },
 
  /** */
  getUserInfoF: function() {
    var that = this;
    wx.getSetting({
      success: (res) => {
          /*
        * res.authSetting = {
        *   "scope.userInfo": true,
        *   "scope.userLocation": true
        * }
        */

        wx.getUserInfo({
          success: res => {
            wx.hideToast()
            wx.hideNavigationBarLoading();
            this.globalData.userInfo = res.userInfo
            /**一开始同意授权 */
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          },
          fail(err) {
            wx.hideToast()
            wx.hideNavigationBarLoading();

            wx.showModal({
              title: '警告',
              cancelText: '不授权',
              confirmText: '授权',
              confirmColor: '#37C31A',
              content: '若不授权微信登录，则无法正常使用wiigie的更多服务；',

              success: function(res) {
                if (res.confirm) {
                  /**用户点击确定 */

                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                          success: res => {
                            that.globalData.userInfo = res.userInfo
                            /**再次同意授权*/
                            // console.info("再次同意授权" + res.userInfo.nickName);
                            if (that.userInfoReadyCallback) {
                              that.userInfoReadyCallback(res)
                            } 
                          }
                        })
                      } else {
                        /**再次不允许*/
                        // console.info("再次不允许");
                        wx.redirectTo({

                          url: "/page/component/pages/pageauth/pageauth"
                        })
                      }
                    }
                  });
                } else if (res.cancel) {
                  console.log('弹出框用户点击取消')
                  wx.redirectTo({
                    url: 'home',
                  })

                }
              }
            })

          }

        })

      }

    })


  }


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
})
// page/component/pages/pageopin/opinadd/opinadd.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUpload = require('../../../../../utils/rUpload.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**传递参数 */
    requirementId: '',
    /**字数限制 */
    textareaMaxLen: 200,

    /**初始页面 */
    initOpinion: {},
    /**选择的选项 */
    choosecode: '',
    opinionReason: '',
    /**添加配图的大小 */
    picsize: 0,
    pics: [],
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {
      this.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }

    this.setData({

      'requirementId': options.r
    })
    this.getInitOpinion()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight

    var percent = windowWidth / 750

    var picsize = (windowWidth - 30 * percent) / 5
    this.setData({

      picsize: picsize,

    })
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getInitOpinion: function () {

    let that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;
    var requirementId = that.data.requirementId;

    var data = {
      code_: 'x_getInitOpinion',
      userid: userid,
      requirementid: requirementId,


    }
    rRequest.doRequest(url, data, that, function (rdata) {
      if (rdata.info) {

        that.setData({

          'initOpinion': rdata.info
        })
      }

    })
  }


  ,
  addopinion: function () {
    let that = this;
    var url = config.requestUrl;

    var code = that.data.choosecode;
    var opinionReason = that.data.opinionReason;;

    if (code == '') {

      wx.showToast({
        title: '请选择您的表态',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function () { }
      })

      return false;
    }

    if (opinionReason == '') {

      wx.showToast({
        title: '请输入您的描述',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function () { }
      })

      return false;
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })


    var userid = that.data.userInfo.id;
    var requirementId = that.data.requirementId;
    var promotionId = that.data.initOpinion.promotionid;

    var data = {
      code_: 'x_addopinion',
      opinionType: code,
      opinion_reason: encodeURIComponent(opinionReason),
      userid: userid,
      requirementid: requirementId,
      promotionid: promotionId,
      otherRecommended: '',
      images: [],
      voices: []
    }
    rRequest.doRequest(url, data, that, function (rdata) {
 
      var data = {
        service_: 'addopinionimage',
        userid: userid,
        requirementId: requirementId,
        opinionId: rdata.info.opinionId,
        
      }
      if (that.data.pics.length > 0) {

        rUpload.upload.uploadImage('upfile', 0, that.data.pics.length, that.data.pics, data, that, function (rdata) {
          wx.showToast({
            title: '提交成功',
            image: '/image/icon_ok.png',
            duration: 2000,
            success: function () { }

          })
          /**缓存 */

          wx.setStorage({
            key: "refresh",
            data: "1",
          })

          setTimeout(function () {
            wx.hideLoading();
            wx.navigateBack({
              delta: 1,
            })

          }, 1500)


        });
      } else {
        /**缓存 */
        wx.showToast({
          title: '提交成功',
          image: '/image/icon_ok.png',
          duration: 2000,
          success: function () { }
 
        })
        wx.setStorage({
          key: "refresh",
          data: "1",
        })
        setTimeout(function () {
          wx.hideLoading();
          wx.navigateBack({
            delta: 1,
          })

        }, 1500)
 
      }

 
    })


  },
  selectCode: function (event) {

    var code = event.currentTarget.dataset.code;

    this.setData({
      'choosecode': code
    });

  },

  //字数限制
  bindWordLimit: function (e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len, //当前字数
      opinionReason: e.detail.value
    });
  },
  touchStart: function (e) {

    this.setData({
      touchStartTime: e.timeStamp
    })
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {

    this.setData({
      touchEndTime: e.timeStamp
    })
  },


  deleimage: function (event) {
    let that = this;
    var index = event.currentTarget.dataset.index;

    wx.showModal({
      title: '提示',
      content: '您要删除这张图片吗',
      success: function (res) {
        if (res.confirm) {
          var pics = that.data.pics;
          if (index == -1) {

           } else {
            pics.splice(index, 1);
          }

          if (pics.length == 0) {
            that.setData({
              isShowImage: 0
            })
          }
          that.setData({
            pics: pics,
          })
        } else if (res.cancel) {

        }

      }
    })


  },
  selectImage: function (event) {
    let that = this;
    var index = event.currentTarget.dataset.index;

    var s = that.data.touchEndTime - that.data.touchStartTime;
    if (that.data.touchEndTime - that.data.touchStartTime < 300) {

      wx.showActionSheet({
        itemList: ['相册', '相机'],
        success(res) {

          if (res.tapIndex == 0) {
            wx.chooseImage({
              count: 1,
              sizeType: ['original', 'compressed'],
              sourceType: ['album'],
              success: function (res) {
                var pics = that.data.pics;
                if (index == -1) {
                  pics.push(res.tempFilePaths[0]);
                } else {

                  pics.splice(index, 1, res.tempFilePaths[0]);
                }

                that.setData({
                  pics: pics,
                  isShowImage: 1
                })


              },
            })
          }
          if (res.tapIndex == 1) {
            wx.chooseImage({
              count: 1,
              sizeType: ['original', 'compressed'],
              sourceType: ['camera'],
              success: function (res) {
                var pics = that.data.pics;

                if (index == -1) {
                  pics.push(res.tempFilePaths[0]);
                } else {
                  pics.splice(index, 1, res.tempFilePaths[0]);
                }
                that.setData({
                  pics: pics
                })

              },
            })
          }
        },
      })
    }
  }


  ,
})
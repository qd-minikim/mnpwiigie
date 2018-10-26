// page/component/pages/pagemy/evaluate/evalimge/evalimge.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rUpload = require('../../../../../../utils/rUpload.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**添加配图的大小 */
    picsize: 0,
    pics: [],
    isShowImage: '0', //默认0 没晒 1 已晒图
    // isAddCommont: '1', //默认0 未评论 1已评论 2已追加评论 3
    // commontTypeId: '0', //默认0 添加 1追加

    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    /**星数量 */
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/image/normal.png',
    selectedSrc: '/image/selected.png',
    halfSrc: '/image/half.png',
    key: 5, //评分

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    var evalid = options.e;

    this.setData({

      evalid: evalid
    })
    this.getEval();
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var picsize = (windowWidth - 30 * percent) / 5
    this.setData({

      picsize: picsize,

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  touchStart: function(e) {

    this.setData({
      touchStartTime: e.timeStamp
    })
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function(e) {

    this.setData({
      touchEndTime: e.timeStamp
    })
  },


  deleimage: function(event) {
    var that = this;
    var index = event.currentTarget.dataset.index;

    wx.showModal({
      title: '提示',
      content: '您要删除这张图片吗',
      success: function(res) {
        if (res.confirm) {
          var pics = that.data.pics;
          if (index == -1) {} else {
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
  selectImage: function(event) {
    var that = this;
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
              success: function(res) {
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
              success: function(res) {
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
  },
  getEval: function() {

    var that = this;
    // var userid = that.data.userInfo.id
    var userid = that.data.userInfo.id
    var evaluationId = that.data.evalid
    var url = config.requestUrl;

    var data = {
      code_: 'x_getEvaluation',
      evaluationId: evaluationId,
      userid: userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        that.setData({
          evalinfo: rdata.info,
          key: rdata.info.score
        })

      }

    })



  },
  submitEval: function() {
    var that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })


    var url = config.requestUrl;

    var userid =that.data.userInfo.id



    var isShowImage = that.data.isShowImage;


    if (isShowImage == '0') { // //默认0 没晒 1 已晒图

      wx.showToast({
        title: '请选择配图',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {


        }
      })

      return false;
    }
    // var isAddCommont = that.data.isAddCommont;
    // var commontTypeId = that.data.commontTypeId;

    var requirementId = that.data.evalinfo.requirement_id;
    var promotionId = that.data.evalinfo.promotion_id;
    var evaluationId = that.data.evalid;
    var firstcommontid = that.data.evalinfo.firstcommontid;
    var data = {
      code_: 'x_addEvalImage',

      evaluationId: evaluationId,
      isShowImage: isShowImage,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      var data = {
        service_: 'addevalimage',
        userid: userid,
        promotionId: requirementId,
        evaluationId: evaluationId,
        commontId: firstcommontid,
      }
      if (that.data.pics.length > 0) {

        rUpload.upload.uploadImage('upfile', 0, that.data.pics.length, that.data.pics, data, that, function(rdata) {
          wx.showToast({
            title: '添图成功',
            image: '/image/icon_ok.png',
            duration: 2000,
            success: function() {}
          })
          /**缓存 */

          wx.setStorage({
            key: "refresh",
            data: "1",
          })

          setTimeout(function() {
            wx.hideLoading();
            wx.navigateBack({
              delta: 1,
            })

          }, 1500)


        });
      } else {
        /**缓存 */

        wx.setStorage({
          key: "refresh",
          data: "1",
        })
        setTimeout(function() {
          wx.hideLoading();
          wx.navigateBack({
            delta: 1,
          })

        }, 1500)



      }




    })
  }
})
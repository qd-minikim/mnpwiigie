// page/component/pages/pagemy/customserv/servaddm/servaddm.js
 
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rUpload = require('../../../../../../utils/rUpload.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceId: '',
    orderId: '',
    servdetaInfo: {},
    /**字数限制 */
    textareaMaxLen: 200,
    commontContent: '',


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
    var orderId = options.o;
    var serviceId = options.s
    this.setData({

      orderId: orderId,
      serviceId: serviceId
    })
    this.getCusServAddM();
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
  //字数限制
  bindWordLimit: function(e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len, //当前字数
      commontContent: e.detail.value
    });
  },
  imageYl: function(event) {

    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表

    })
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
    }


    ,

  getCusServAddM: function() {

    var that = this;
    // var userid = that.data.userInfo.id
    var userid = that.data.userInfo.id
    var orderId = that.data.orderId
    var url = config.requestUrl;

    var data = {
      code_: 'x_getCusServAddM',
      orderId: orderId,
      userid: userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        that.setData({
          servdetaInfo: rdata.info,

        })

      }

    })



  },


  submitCusServMore: function() {
    var that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })

    var url = config.requestUrl;
    var userid = that.data.userInfo.id



    var commontContent = that.data.commontContent;

    if (commontContent == '') {

      wx.showToast({
        title: '输入追评内容',
        image: '/image/icon_warn.png',
        duration: 2000,
        success: function() {


        }
      })

      return false;
    }

   
    var customerServiceId = that.data.serviceId;

    var serviceDes = that.data.commontContent;
    var data = {
      code_: 'x_addCusServAddM', 

      customerServiceId: customerServiceId,
      
      userid: userid,
     
      service_des: encodeURIComponent(serviceDes),
      
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      var data = {
        service_: 'addcustimage',
        customerServiceId: customerServiceId,
        serviceDesId: rdata.info.serviceDesId,
       
      }
      if (that.data.pics.length > 0) {

        rUpload.upload.uploadImage('upfile', 0, that.data.pics.length, that.data.pics, data, that, function(rdata) {
          wx.showToast({
            title: '补充成功',
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
        wx.showToast({
          title: '补充成功',
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



      }




    })
  }
})
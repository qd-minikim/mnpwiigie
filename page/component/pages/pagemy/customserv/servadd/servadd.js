// page/component/pages/pagemy/customserv/servadd/servadd.js
 
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rUpload = require('../../../../../../utils/rUpload.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**传递参数 */
    orderId: '',
    /**字数限制 */
    textareaMaxLen: 200,
    /**添加配图的大小 */
    picsize: 0,
    pics: [],
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    scrollHeight: 0,
    /**初始页面 */
    initServPageInfo: {},

    /**选择的选项 */
    serviceType: '1',// //1 退  2 换
    chooseReason:'',
    serviceDes: '',
    serviceTypeDes:'',
    serviceTypeDesText: '',
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }

    this.setData({

      orderId : options.o
    })
    this.getServPageInfo()
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750
    var scrollHeight = windowHeight - app.globalData.bottomBtnHeight * percent - 20
    var picsize = (windowWidth - 30 * percent) / 5
    this.setData({
      'scrollHeight': scrollHeight,
      picsize: picsize,

    })
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

  getServPageInfo: function () {

    var that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;
    var orderId = that.data.orderId;

    var data = {
      code_: 'x_getCusServAdd',
      userid: userid,
      orderId: orderId,


    }
    rRequest.doRequest(url, data, that, function (rdata) {
      if (rdata.info) {

        that.setData({

          'initServPageInfo': rdata.info
        })
      }

    })
  }


  ,
  addCusServ: function () {
    var that = this;
    var url = config.requestUrl;

    var serviceType = that.data.serviceType;
    var serviceDes = that.data.serviceDes;
    var serviceTypeDes = that.data.serviceTypeDes;
    if (serviceType == '') {
      wx.showToast({
        title: '选择服务类型',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function () { }
      })
      return false;
    }

    if (serviceTypeDes == '') {
      wx.showToast({
        title: '选择售后原因',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function () { }
      })
      return false;
    }
    
    if (serviceDes == '') {

      wx.showToast({
        title: '输入问题描述',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function () { }
      })

      return false;
    }

    var userid =that.data.userInfo.id;
 
    var merchantId = that.data.initServPageInfo.merchant_id;
    var orderId = that.data.orderId;
   
    
    var serviceTypeDesText = that.data.serviceTypeDesText;

    var customerServiceId = '';

    var data = {
      code_: 'x_addCusServ',
      merchantid: merchantId,
      orderid: orderId,
      service_des: encodeURIComponent(serviceDes),
      userid: userid,
      serviceType: serviceType,
      serviceTypeDes: encodeURIComponent(serviceTypeDes),
      serviceTypeDesText: encodeURIComponent(serviceTypeDesText),
      serviceId: customerServiceId,

      
    }
    rRequest.doRequest(url, data, that, function (rdata) {

      var data = {
        service_: 'addcustimage',
        customerServiceId: rdata.info.serviceId,
        serviceDesId: rdata.info.serviceDesId,

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



      }

    })


  },
  selectCode: function (event) {

    var code = event.currentTarget.dataset.code;

    this.setData({
      'serviceType': code
    });

  },
  radioChange: function (e) {
    // serviceType: '1',// //1 退  2 换
    var that = this;
    var code = e.detail.value;

    var serviceType = that.data.serviceType;
    if (serviceType =='1'){

      var type1 = that.data.initServPageInfo.SER_TYPE_1;
      var serviceTypeDesText ='';
      for (var i = 0; i < type1.length;i++){
        if (code == type1[i].code){

          serviceTypeDesText = type1[i].code_name
        }

      }
      that.setData({
        'serviceTypeDesText': serviceTypeDesText
      });
    }
    if (serviceType == '2') {
      var type2 = that.data.initServPageInfo.SER_TYPE_2;
      var serviceTypeDesText = '';
      for (var i = 0; i < type2.length; i++) {
        if (code == type2[i].code) {

          serviceTypeDesText = type2[i].code_name
        }

      }
      that.setData({
        'serviceTypeDesText': serviceTypeDesText
      });
    }
    that.setData({
      'serviceTypeDes': code
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
    var that = this;
    var index = event.currentTarget.dataset.index;

    wx.showModal({
      title: '提示',
      content: '您要删除这张图片吗',
      success: function (res) {
        if (res.confirm) {
          var pics = that.data.pics;
          if (index == -1) { } else {
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
  //字数限制
  bindWordLimit: function (e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len, //当前字数
      serviceDes: e.detail.value
    });
  }
})
// page/component/pages/pageopin/opinremark/opinremark.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUtils = require('../../../../../utils/rUtils.js');
var rUpload = require('../../../../../utils/rUpload.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    itemsPerPage: 10,
    endRow: 0,
    allRows: 0,


    // 朋友说图片大小
    opinpicsize: 0,
    remarkopinpicsize: 0,
    inputRemarkValue: '',
    sendBtnShow: false,
    option: {},
    remarks: [],
    panelPage: {
      panelPageTop: false, // false 表示底部上推，true 表示 上不下推
      chooseSize: false,
      chooseType: '',
      animationData: {},
      maskLayerHeight: '',
      maskLayerWidth: '',
      maskPanHeight: '', //例如下单选择等存在底端按钮的时候，按钮上部的view的高度
      maskPanWidth: '',

      msginfo: '',
      isHtml: false,
      opinionId: '',
      scrollTop: 0,
      refresh: false,
      /**用户信息 */
      userInfo: {},
      //hasUserInfo: false,
      userIData: false,
      // userWxInfo: {}, 

      isPullDownRefresh: false,
      //是否上拉更多
      isReachBottom: false,
      isRefresh: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (app.globalData.userIData) {
      this.setData({

        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
  

 
    this.setData({
      'opinionId': options.o,
        'role': options.ro
    })
    if (options.ro == 'TW') {

      wx.setNavigationBarTitle({
        title: '友托帮-粉丝说留言',
      })
    }

    wx.showLoading({
      title: '加载中...',
      mask: true,
    })

    this.getOption()
    this.getRemark()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750
    var scrollHeight = windowHeight - app.globalData.bottomBtnHeight * percent

    var opinpicsize = (windowWidth - 30 * percent) / 8
    var remarkopinpicsize = (windowWidth - 90 * percent) / 6
    that.setData({

      'opinpicsize': opinpicsize,
      'remarkopinpicsize': remarkopinpicsize,
      'dialogCofig.width': windowWidth * 0.60,

      'panelPage.maskPanWidth': windowWidth,
      'scrollviewwidth': windowWidth,
      'scrollviewheight': scrollHeight,
    })



    wx.hideShareMenu();
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
  imageYl: function(event) {

    let that = this;

    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    var indexImg = event.currentTarget.dataset.index;

    var imageUrlArry = new Array();
    for (var n = 0; n < imgList.length; n++) {

      var imageUrl = imgList[n].imageurl
      imageUrl = imageUrl.replace('160', '1024')
      imageUrlArry.push(imageUrl)
    }

    //图片预览
    wx.previewImage({
      current: imageUrlArry[indexImg], // 当前显示图片的http链接
      urls: imageUrlArry // 需要预览的图片http链接列表

    })

  },
  bindKeyInput: function(event) {
    let that = this;
    var value = event.detail.value;
    var len = value.length
    if (len > 0) {

      that.setData({
        sendBtnShow: true
      })

    } else {
      that.setData({
        sendBtnShow: false
      })
    }
    that.setData({
      inputRemarkValue: value
    })


  },

  getRemark: function() {

    var that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;
    var isRefresh = that.data.isRefresh;

    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;


    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820
    var opinionId = that.data.opinionId


    if (isRefresh) {

      endRow = 0;
      itemsPerPage = allRows;
    }

    if (isReachBottom && allRows == endRow) {

      that.setData({
        isReachBottom: false,
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
        success: function() {}
      })
      return false
    }

    var data = {
      code_: 'x_getOpinionRemark',
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      userid: userid,
      opinionId: opinionId,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {



        var remarksArray = [];
        var remarksArrayNew = [];
        if (isPullDownRefresh) {
          remarksArray = [];

          wx.stopPullDownRefresh();
        }
        if (isReachBottom) {
          remarksArray = that.data.remarks;

        }

        remarksArrayNew = remarksArray.concat(rdata.infolist);


        that.setData({

          remarks: remarksArrayNew,
          endRow: rdata.endRow,
          allRows: rdata.infocounts
        })
        let refresh = that.data.refresh;
        if (refresh) {
          that.setData({
            scrollTop: 1000 * remarksArrayNew.length
          });
          that.setData({
            'refresh': false,

          })
        }

        that.setData({

          isPullDownRefresh: false,
          isReachBottom: false,
          isRefresh: false,
        })
      }

    })
  },

  getOption: function() {
    var that = this;


    var url = config.requestUrl;
    var opinionId = that.data.opinionId //1528869953018820 
    var userId = that.data.userInfo.id
    var data = {
      code_: 'x_getOpinion',
      'opinionId': opinionId,
      'userId': userId
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({

          option: rdata.info,

        })

      }
      wx.hideLoading();
    })
  },
  sendRemark: function(event) {
    let that = this;
    var url = config.requestUrl;


    var userType = that.data.option.usertype; //0  商户   1 用户
 
    var remarkContent = that.data.inputRemarkValue;

    if (remarkContent == '') {

      wx.showToast({
        title: '留言不能为空',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }
    var remarkType = '0';
    var userId = that.data.userInfo.id //that.data.userInfo.id;
    var opinionId = that.data.opinionId //that.data.;

    var data = {
      code_: 'x_addOpinionRemark',
      userid: userId,
      remarkContent: encodeURIComponent(remarkContent),
      remarkType: remarkType,
      opinionId: opinionId,
      userType: userType
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        var mgmtStatus = rdata.info.mgmtStatus;

        if (mgmtStatus == '1') {

          wx.showToast({
            title: rdata.info.mgmtMsg,
            image: '/image/icon_warn.png',
            duration: 2000,
            success: function() {

            }
          })

        } else {
           
          that.setData({
            'refresh': true,
            'isRefresh': true,
            'inputRemarkValue': '',
            'sendBtnShow': false,
            'allRows': that.data.allRows+1
          })

          that.getRemark();
          wx.setStorage({
            key: "refresh",
            data: "1",
          })

        }
      }
    })


  },
  photos: function(event) {
    let that = this;
    var sourcetype = event.currentTarget.dataset.sourcetype;

    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: [sourcetype],
      success: function(res) {
        that.setData({
          imageFilePaths: res.tempFilePaths
        })

        var userType = that.data.option.usertype;  //that.data.userType; //0  商户   1 用户


        var remarkContent = '';

        var remarkType = '1';
        var userId = that.data.userInfo.id //that.data.userInfo.id;
        var opinionId = that.data.opinionId //that.data.;
        var url = config.requestUrl;



        var data = {

          code_: 'x_addOpinionRemark',
          userid: userId,
          remarkContent: '',
          remarkType: remarkType,
          opinionId: opinionId,
          userType: userType

        }

        rRequest.doRequest(url, data, that, function(rdata) {

          var data1 = {

            opinionId: opinionId,
            remarkId: rdata.info.remarkId,
            service_: 'addopinionremarkimage'

          }
          rUpload.upload.uploadImage('upfile', 0, res.tempFilePaths.length, res.tempFilePaths, data1, that, function(rdata) {

            that.setData({
              'refresh': true,
              'isRefresh': true,
              'inputRemarkValue': '',
              'sendBtnShow': false,
              'allRows': that.data.allRows + 1
            })

            that.getRemark();
            wx.setStorage({
              key: "refresh",
              data: "1",
            })


          });




        })

      }
    })

  },
  attachment: function(event) {
    let that = this
    var clicklx = event.currentTarget.dataset.lx;
    var clickcode = event.currentTarget.dataset.code;
    var isHtml = event.currentTarget.dataset.html
    rUtils.slideModal.up(that, clicklx, true);

    that.setData({
      'panelPage.isHtml': isHtml,
    })

    if (clicklx == 'attachment') { //匹配模板

    }

  },
  cancleattach: function() {
    let that = this;
    rUtils.slideModal.down(that, null, false);
  },
})
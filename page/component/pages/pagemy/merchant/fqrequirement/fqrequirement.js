// page/component/pages/pagemy/merchant/fqrequirement/fqrequirement.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rUpload = require('../../../../../../utils/rUpload.js');
var WxParse = require('../../../../../../wxParse/wxParse.js');
var rCommon = require('../../../../../../utils/rCommon.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    promotionid: '',
    initFq: {},
    pcPromotion: {},
    attributeInfo: {},

    configMsgInfo: {},


    footHeight: '90',
    contentHeight: 0,
    /**添加配图的大小 */
    picsize: 0,
    pics: [],
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,

    //展示
    richtextMore: true,
    richtextShow: false,

    //
    title: '',

    commissionfocus: false,
    commission: '',

    singlepricefocus: false,
    singleprice: '',
    singlepricedisable: true,
    deadlinetime: '',


    showGroupGrade: true,
    showGroupGradeArrow: '/image/arrow_down_2.png',

    forwardcontrol: '',
    aidcontrol: '',
    initialcontrol: '',

    //参数
    isthemp: '1',
    requirementid: '',
    descriptionid: '',
    locationid: '',
    markid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var promotionid = options.pro;
    var requirementid = options.rid;
    this.setData({

      promotionid: promotionid,
      requirementid:requirementid
    })
    this.initPage()
    this.getConfigMsgInfo()


    this.getPcPromotion()
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750
    var contentHeight = windowHeight - this.data.footHeight * percent
    var picsize = (windowWidth - 30 * percent - 26 * 5 * percent) / 6
    this.setData({

      picsize: picsize,
      contentHeight: contentHeight
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

  titleinput: function(e) {
    var title = e.detail.value
    this.setData({

      title: title,

    })
  },
  /**传播预算获取焦点 */
  commissionfocus: function(e) {

    this.setData({

      commissionfocus: true,

    })
  },
  /**传播预算失去焦点 */
  commissionblur: function(e) {

    this.setData({

      commissionfocus: false,

    })
  },
  commissioninput: function(e) {
    var commission = e.detail.value
    var that = this;
    var n = Number(commission);

    if (n == 0) {
      that.setData({
        commission: commission,
        singleprice: '',
        singlepricedisable: true,
      })
    } else {
      that.setData({
        commission: commission,
        singleprice: that.data.initFq.settlement_single_price,
        singlepricedisable: false,
      })

    }

  },
  /**传播单价获取焦点 */
  singlepricefocus: function(e) {

    this.setData({

      singlepricefocus: true,

    })
  },
  /**传播单价失去焦点 */
  singlepriceblur: function(e) {

    this.setData({

      singlepricefocus: false,

    })
  },
  singlepriceinput: function(e) {
    var singleprice = e.detail.value
    this.setData({

      singleprice: singleprice,

    })
  },

  initPage: function() {

    var that = this

    var userid = '';
    var promotionId = that.data.promotionid
    var requirementid = that.data.requirementid
    var url = config.requestUrl
    var data = {
      code_: 'x_getInitFqPage',

      u: userid,
      c: 'V-3',
      ct: '1000000000000012',
      cc: 'content_12',
      pm: promotionId,
      r: requirementid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          initFq: rdata.info,
          'deadlinetime': rdata.info.the_day,
          //'singleprice': rdata.info.settlement_single_price,
          'isthemp': rdata.info.is_themp,
          'forwardcontrol': rdata.info.forward_control,
          'aidcontrol': rdata.info.aid_control,
          'initialcontrol': rdata.info.initial_control,
          'requirementid': rdata.info.requirement_id,
          'descriptionid': rdata.info.description_id ? rdata.info.description_id : '',
          'locationid': '',
        
       

        })
      }

    })

  },
  /**获取配置描述 */
  getConfigMsgInfo: function() {
    var that = this;
    var url = config.requestUrl;
    var values = [{
      code: 'CJZWSS',
      replace: []
    }, {
      code: 'ZGCJJE',
      replace: []
    }, {
      code: 'ZGCJ',
      replace: []
    }, {
      code: 'CBDJSM',
      replace: []
    }, {
      code: 'CBDJJE',
      replace: []
    }, {
      code: 'CFG_GROUP_MSG',
      replace: []
    }];


    var data = {
      code_: 'x_getConfigMsgInfo',
      /**[{code:xxxx,replace:[{regexp:xxx,replacement:xxxx},{}]},{}] */
      values: values,
      model: 'V-3',
      contentcode: 'content_12'
    }
    rCommon.configMsgInfo.getConfigMsg(url, data, that, function(rdata) {
      if (rdata.info) {

        that.setData({
          configMsgInfo: rdata.info,

        })

        WxParse.wxParse('cbdjms', 'html', rdata.info.CBDJSM, that, 5);
        WxParse.wxParse('cfg_group_msg', 'html', rdata.info.CFG_GROUP_MSG, that, 5);
        // WxParse.wxParse('richtext', 'html', richtext, that, 5);
      }

    });

  },
  /**获取展开详情信息 */
  getAttribute: function() {
    var that = this

    var spuid = that.data.pcPromotion.spuId;;

    var url = config.requestUrl
    var data = {
      code_: 'x_getAttribute',
      spuid: spuid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          attributeInfo: rdata.info
        })
      }

    })

  },
  /**获取展开详情信息 */
  getRequirementRichtext: function() {
    var that = this
    var usreId = '';
    var spuid = that.data.pcPromotion.spuId;;

    var url = config.requestUrl
    var data = {
      code_: 'x_getRequirementRichtext',
      spuid: spuid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {
      var richtext = rdata.info.richtext_content;
      /**
       * WxParse.wxParse(bindName , type, data, target,imagePadding)
       * 1.bindName绑定的数据名(必填)
       * 2.type可以为html或者md(必填)
       * 3.data为传入的具体数据(必填)
       * 4.target为Page对象,一般为this(必填)
       * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
       */

      WxParse.wxParse('richtext', 'html', richtext, that, 5);

    })

  },
  getPcPromotion: function() {

    var that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var promotionId = that.data.promotionid
    var typeflg = 'add'
    var flg = ''
    var data = {
      code_: 'x_getPcPromotion',
      "promotionId": promotionId,
      "typeflg": typeflg,
      "flg": flg
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.status == '1') {

        if (rdata.info) {
          that.setData({
            pcPromotion: rdata.info,
            'title': rdata.info.title
          })
        }


        that.getAttribute();
        that.getRequirementRichtext();
      } else {

        wx.showModal({
          title: '提示',
          content: rdata.msg,
          showCancel: true,
          confirmText: '知道了',
          success: function(res) {}
        })
      }
      wx.hideLoading();
    })
  },

  /**展开 */
  showRichtext: function() {

    var that = this;
    that.setData({
      'richtextMore': false,
      'richtextShow': true
    })

  },
  showGroupGrade: function(e) {
    var that = this;

    var showGroupGrade = that.data.showGroupGrade;
    if (showGroupGrade) {
      that.setData({
        'showGroupGrade': false,
        'showGroupGradeArrow': '/image/arrow_right_1.png'
      })
    } else {
      that.setData({
        'showGroupGrade': true,
        showGroupGradeArrow: '/image/arrow_down_2.png'

      })
    }



  },
  /**活动截止 */
  bindDateChange: function(e) {

    var newDate = e.detail.value;
    this.setData({
      deadlinetime: newDate
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

  submit: function(e) {
    var that = this;
    var addtype = e.currentTarget.dataset.addtype; //"4" 暂存 "0" 下一步

    var code_ = ''
    if (addtype == '0') {
      code_ = 'x_addRequirement'
      var title = '';

      if (title == '') {
        wx.showToast({
          title: '标题不能为空',
          image: '/image/icon_warn.png',
          duration: 2000,
          success: function() {}
        })

        return
      }
      var commission = '';

      var singleprice = '';
      if (singleprice != '') {

        if (Number(commission) > 0 && Number(commission) < Number(singleprice)) {

          wx.showToast({
            title: '预算<传播单价',
            image: '/image/icon_warn.png',
            duration: 2000,
            success: function() {}
          })

        }

      }


      var deadlineTime = '';
      if (deadlineTime == '') {
        wx.showToast({
          title: '截止时间不能为空',
          image: '/image/icon_warn.png',
          duration: 2000,
          success: function() {}
        })

        return

      }

    } else if (addtype == '4') {
      code_ = 'x_addTempRequirement'

    }

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = '1528869953018820' // that.data.userInfo.id
 
    var requirementid = that.data.requirementid
    var descriptionid = that.data.descriptionid
    var isthemp = that.data.isthemp
    var singleprice = that.data.singleprice

    var promotionid = that.data.promotionid

    var deadlinetime = that.data.deadlinetime
    var commission = that.data.commission
    var forwardcontrol = that.data.forwardcontrol
    var aidcontrol = that.data.aidcontrol
    var initialcontrol = that.data.initialcontrol
    var title = that.data.title

    // requirementid: rdata.info.requirementid,
    //   descriptionid: rdata.info.descriptionid ? rdata.info.descriptionid : '',
    //     locationid: rdata.info.locationid,
    //       isthemp: '0'
    var data = {
      code_: code_,

      title: encodeURIComponent(title),
      commission: commission,
      description: '',
      deadline_time: deadlinetime,
      initial_control: initialcontrol,
      forward_control: forwardcontrol,
      aid_control: aidcontrol,
      userid: userid,
      code: 'V-3',

      contentcode: 'content_12',
      agent_option: '',
      agency_accepted_status: '',
      isthemp: isthemp,
      pc_promotion_id: promotionid,
      settlement_single_price: singleprice,

      requirement_id: requirementid,
      description_id: descriptionid,

      locationinfo: '',
      location_id: '',
      location_satus: '1',
      images: '',
      voice: '',
    }
 
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        if (addtype == '0') {
          that.setData({
            requirementid: rdata.info.requirementid,
            markid: rdata.info.markid,
          })
          if (rdata.iszero == '0') {


          } else {


          }
        } else if (addtype == '4') {

          that.setData({
            requirementid: rdata.info.requirementid,
            descriptionid: rdata.info.descriptionid ? rdata.info.descriptionid : '' ,
            locationid: rdata.info.locationid,
            isthemp: '0'
          })

          wx.showToast({
            title: '暂存成功',
            image: '/image/icon_ok.png',
            duration: 2000,
            success: function() {}
          })
        }

      }

      wx.hideLoading();


    })
  }
})
// page/component/pages/pageaddr/addradd/addradd.js
var rRequest = require('../../../../../utils/rRequest.js');
var config = require('../../../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useraddressid: '',
    action: 'add',
    addrInfo: {
      defaultProvice: [{
        'code': '',
        'name': '选择省'
      }],
      defaultCity: [{
        'code': '',
        'name': '选择市'
      }],
      defaultDistrict: [{
        'code': '',
        'name': '选择区'
      }],
      provinceInfo: {
        provice: [],
        index: 0
      },
      cityInfo: {
        city: [],
        index: 0
      },
      districtInfo: {
        district: [],
        index: 0
      }
    },
    myAddressInfo: {
      orderUserName: '',
      province: '',
      city: '',
      district: '',
      addressHouse: '',
      phone: ''
    },

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
    var action = options.action;

    if (action == 'add') {



      var city = this.data.addrInfo.defaultCity;
      var district = this.data.addrInfo.defaultDistrict;
      this.setData({

        'addrInfo.cityInfo.city': city,
        'addrInfo.districtInfo.district': district,
        'action': action,

      })

      this.getProvince()
    }

    if (action == 'upp') {
      var useraddressid = options.id;

      var city = this.data.addrInfo.defaultCity;
      var district = this.data.addrInfo.defaultDistrict;
      this.setData({

        'addrInfo.cityInfo.city': city,
        'addrInfo.districtInfo.district': district,
        'action': action,
        'useraddressid': useraddressid
      })

      this.getAddressInfo();
    }




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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


  getAddressInfo: function() {

    var that = this;
    var url = config.requestUrl;
    var id = that.data.useraddressid;
    var userid = that.data.userInfo.id;
    var data = {
      code_: 'x_getAddressById',
      id: id,
      userid: userid,


    }
    rRequest.doRequest(url, data, that, function(rdata) {

      var provice = that.data.addrInfo.defaultProvice;

      if (rdata.info) {
        that.setData({
          'myAddressInfo.orderUserName': rdata.info.orderUsername,
          'myAddressInfo.province': rdata.info.province,
          'myAddressInfo.city': rdata.info.city,
          'myAddressInfo.district': rdata.info.district,
          'myAddressInfo.addressHouse': rdata.info.addressHouse,
          'myAddressInfo.phone': rdata.info.phone,
        })


        that.getProvince();



      }
    })

  },


  /**
   * 获取省份
   */
  getProvince: function() {
    var that = this;
    var url = config.requestUrl;

    var data = {
      code_: 'x_getAddrBaseInfo',
      code: '%0000',
      type: 'addrtype',
      fcode: '',

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      var provice = that.data.addrInfo.defaultProvice;

      if (rdata.info) {

        that.setData({
          'addrInfo.provinceInfo.provice': provice.concat(rdata.info),

        })

        if (that.data.action == 'upp') {


          var fcode = that.data.myAddressInfo.province;
          var findex = 0;
          for (var i = 0; i < rdata.info.length; i++) {
            if (fcode == rdata.info[i].code) {

              findex = i;
              break;
            }

          }
          that.setData({

            'addrInfo.provinceInfo.index': findex+1
          })
          that.getCity();
        }
      }
    })
  },

  changeProvince: function(e) {
    var that = this;
   
    that.setData({

      'addrInfo.provinceInfo.index': e.detail.value,
      'addrInfo.cityInfo.index': 0,
      'addrInfo.districtInfo.index': 0,
      'action': 'change',
    })
    this.getCity();

  },

  /**
   * 获取市
   */
  getCity: function() {
    var that = this;
    var url = config.requestUrl;

   var fcode = that.data.addrInfo.provinceInfo.provice[that.data.addrInfo.provinceInfo.index].code;
    //  var fcode = that.data.myAddressInfo.province;
    var code = fcode.substring(0, 2) + "%" + "00";


    var data = {
      code_: 'x_getAddrBaseInfo',
      code: code,
      type: 'addrtype',
      fcode: fcode,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      var city = that.data.addrInfo.defaultCity;

      if (rdata.info) {

        that.setData({
          'addrInfo.cityInfo.city': city.concat(rdata.info)
        })

        if (that.data.action == 'upp') {
          var fcode = that.data.myAddressInfo.city;
          var findex = 0;
          for (var i = 0; i < rdata.info.length; i++) {
            if (fcode == rdata.info[i].code) {

              findex = i;
              break;
            }

          }
          that.setData({

            'addrInfo.cityInfo.index': findex+1
          })

          that.getDistrict();
        }
      }
    })
  },
  changeCity: function(e) {
    var that = this;
    that.setData({

      'addrInfo.cityInfo.index': e.detail.value,
       'addrInfo.districtInfo.index': 0,
        'action': 'change',
    })
    this.getDistrict();

  },
  /**
   * 获取区
   */
  getDistrict: function() {
    var that = this;
    var url = config.requestUrl;
   var fcode = that.data.addrInfo.cityInfo.city[that.data.addrInfo.cityInfo.index].code;
    // var fcode = that.data.myAddressInfo.city;

    var code = fcode.substring(0, 4) + "%";

    var data = {
      code_: 'x_getAddrBaseInfo',
      code: code,
      type: 'addrtype',
      fcode: fcode,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      var district = that.data.addrInfo.defaultDistrict;

      if (rdata.info) {

        that.setData({
          'addrInfo.districtInfo.district': district.concat(rdata.info)
        })

        if (that.data.action == 'upp') {
          var fcode = that.data.myAddressInfo.district;
          var findex = 0;
          for (var i = 0; i < rdata.info.length; i++) {
            if (fcode == rdata.info[i].code) {

              findex = i;
              break;
            }

          }
          that.setData({
            'addrInfo.districtInfo.index': findex+1
          })

        
        }
      }
    })
  },
  changeDistrict: function(e) {
    var that = this;
    that.setData({

      'addrInfo.districtInfo.index': e.detail.value,
      'action': 'change',
    })


  },
  formSubmit: function(e) {
 
    var that = this;
    var url = config.requestUrl;

    var formObj = e.detail.value;

    // that.data.addrInfo.provinceInfo.provice[that.data.addrInfo.provinceInfo.index].code;
    // that.data.addrInfo.cityInfo.city[that.data.addrInfo.cityInfo.index].code;
    // that.data.addrInfo.districtInfo.district[that.data.addrInfo.districtInfo.index].code;

    var useraddressid = that.data.useraddressid,
      userid = '1528869953018820',
      orderUsername = formObj.order_username,
      phone = formObj.phone,
      province = that.data.addrInfo.provinceInfo.provice[that.data.addrInfo.provinceInfo.index].code,
      city = that.data.addrInfo.cityInfo.city[that.data.addrInfo.cityInfo.index].code,
      district = that.data.addrInfo.districtInfo.district[that.data.addrInfo.districtInfo.index].code,
      provinceName = that.data.addrInfo.provinceInfo.provice[that.data.addrInfo.provinceInfo.index].name,
      cityName = that.data.addrInfo.cityInfo.city[that.data.addrInfo.cityInfo.index].name,
      districtName = that.data.addrInfo.districtInfo.district[that.data.addrInfo.districtInfo.index].name,
      isDefault = '0',
      addressHouse = formObj.address_house;


    if (orderUsername == '') {

      wx.showToast({
        title: '姓名不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function() {

        }
      })

      return false;
    }

    if (phone == '') {

      wx.showToast({
        title: '联系电话不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function() {

        }
      })

      return false;
    }
    if (province == '') {

      wx.showToast({
        title: '省份不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function() {

        }
      })

      return false;
    }
    if (city == '') {

      wx.showToast({
        title: '地市不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function() {

        }
      })

      return false;
    }
    if (district == '') {

      wx.showToast({
        title: '区县不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function() {

        }
      })

      return false;
    }
    if (addressHouse == '') {

      wx.showToast({
        title: '地址不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function() {

        }
      })

      return false;
    }
    var data = {
      code_: 'x_addAddress',
      useraddressid: useraddressid,
      userid: userid,
      order_username: orderUsername,
      phone: phone,
      province: province,
      city: city,
      district: district,
      province_name: provinceName,

      city_name: cityName,
      district_name: districtName,
      is_default: isDefault,
      address_house: addressHouse,

    }
    rRequest.submitRequest(url, data, that, function(rdata) {

      wx.showToast({
        title: '保存成功',
        icon: 'success',
        image: '/image/icon_ok.png',
        duration: 2000,
        success: function() {

        }
      })
      wx.navigateBack({
        delta: 1
      })


    })

  }

  // < form catchsubmit = "formSubmit" catchreset = "formReset" >
  // province: '',
  // city: '',
  // district: '' changeDistrict
})
// page/component/pages/pageaddr/addradd/addradd.js
var rRequest = require('../../../../../utils/rRequest.js');
var config = require('../../../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

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


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    this.getProvince()


    var city = this.data.addrInfo.defaultCity;
    var district = this.data.addrInfo.defaultDistrict;
    this.setData({
      'addrInfo.cityInfo.city': city,
      'addrInfo.districtInfo.district': district,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
      }
    })
  },

  changeProvince: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', that.data.addrInfo.provinceInfo.provice[e.detail.value].code)
    that.setData({

      'addrInfo.provinceInfo.index': e.detail.value
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
      }
    })
  },
  changeCity: function(e) {
    var that = this;
    that.setData({

      'addrInfo.cityInfo.index': e.detail.value
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
      }
    })
  },
  changeDistrict: function(e) {
    var that = this;
    that.setData({

      'addrInfo.districtInfo.index': e.detail.value
    })


  },
  formSubmit: function(e) {

    //console.log('form发生了submit事件，携带数据为：', e.detail.value)



    var that = this;
    var url = config.requestUrl;

    var formObj = e.detail.value;

    // that.data.addrInfo.provinceInfo.provice[that.data.addrInfo.provinceInfo.index].code;
    // that.data.addrInfo.cityInfo.city[that.data.addrInfo.cityInfo.index].code;
    // that.data.addrInfo.districtInfo.district[that.data.addrInfo.districtInfo.index].code;

    var useraddressid = '',
      userid = '',
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
        success: function () {

        }
      })

      return false;
    }
    if (province == '') {

      wx.showToast({
        title: '省份不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function () {

        }
      })

      return false;
    }
    if (city == '') {

      wx.showToast({
        title: '地市不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function () {

        }
      })

      return false;
    }
    if (district == '') {

      wx.showToast({
        title: '区县不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function () {

        }
      })

      return false;
    }
    if (addressHouse == '') {

      wx.showToast({
        title: '地址不能为空',
        image: '/image/icon_warn.png',
        duration: 12000,
        success: function () {

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

    })

  }

  // < form catchsubmit = "formSubmit" catchreset = "formReset" >
  // province: '',
  // city: '',
  // district: '' changeDistrict
})
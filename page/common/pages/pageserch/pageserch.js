// page/common/pages/pageserch/pageserch.js
var pageSerch = {

  showDetail: function (m, r) {

    wx.navigateTo({
      url: "/page/component/pages/pagexdd/pagexdd?m=" + m + "&r=" + r ,
    })

  }

}

module.exports = {
  pageSerch: pageSerch
}
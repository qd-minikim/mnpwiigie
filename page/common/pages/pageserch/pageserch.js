// page/common/pages/pageserch/pageserch.js
var pageSerch = {

  showDetail: function (m, r, u) {

    wx.navigateTo({
      url: "/page/component/pages/pagexdd/pagexdd?m" + m + "&r=" + r + "&u=" + u,
    })

  }

}

module.exports = {
  pageSerch: pageSerch
}
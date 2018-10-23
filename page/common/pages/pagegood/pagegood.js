var pageGood = {

  showDetail: function (m, r) {

    wx.navigateTo({
      url: "/page/component/pages/pagexdd/pagexdd?m=" + m + "&r=" + r ,
    })

  }

}

module.exports = {
  pageGood: pageGood
}

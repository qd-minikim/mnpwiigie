var pageHydt={

  showDetail: function (m, r,at){

    wx.navigateTo({
      url: "/page/component/pages/pagexdd/pagexdd?m=" + m + "&r=" + r + "&at=" + at,
    })

  }

}

module.exports = {
  pageHydt: pageHydt
}
var pageHydt={

  showDetail: function (m, r,u){

    wx.navigateTo({
      url: "/page/component/pages/pagexdd/pagexdd?m" + m+"&r="+r+"&u="+u,
    })

  }

}

module.exports = {
  pageHydt: pageHydt
}
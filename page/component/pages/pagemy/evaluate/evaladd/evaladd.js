// page/component/pages/pagemy/evaluate/evaladd/evaladd.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evalid: '',
    /**字数限制 */
    textareaMaxLen: 200,

    /**星数量 */
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/image/normal.png',
    selectedSrc: '/image/selected.png',
    halfSrc: '/image/half.png',
    key: 5, //评分
    /**添加配图的大小 */
    picsize: 0,
    pics: [ ],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var evalid = options.e;

    this.setData({

      evalid: evalid
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var picsize = (windowWidth - 30 * percent) / 5
    this.setData({

      picsize: picsize,

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
  //字数限制
  bindWordLimit: function(e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len, //当前字数
      opinionReason: e.detail.value
    });
  },
  imageYl: function (event) {

    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表

    })
  },
   
  selectImage:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['相册','相机'],
      success(res) {
        
        if (res.tapIndex ==0){
          wx.chooseImage({
            count:1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: function(res) {
              var pics = that.data.pics;
              pics.push(res.tempFilePaths[0]);
              that.setData({
                pics: pics
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
              pics.push(res.tempFilePaths[0]);
                that.setData({
                  pics: pics
                })
              
            },
          })
        }
      },
    })

  }


,
  //点击右边,半颗星

  selectLeft: function(e) {

    var key = e.currentTarget.dataset.key

    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {

      //只有一颗星的时候,再次点击,变为0颗

      key = 0;

    }

    console.log("得" + key + "分")

    this.setData({

      key: key

    })



  },

  //点击左边,整颗星

  selectRight: function(e) {

    var key = e.currentTarget.dataset.key

    console.log("得" + key + "分")

    this.setData({

      key: key

    })

  }
})
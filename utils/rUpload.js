var config = require('../config.js')
var rUtils = require('../utils/rUtils.js');

var upload = {

  n: 0,
  uploadImageUrl: config.uploadFileUrl,
  uploadImage: function(name, i, len, tempFilePaths, formData, that, callback) {
    var this_ = this;
    this_.n = i;
    wx.uploadFile({
      url: this_.uploadImageUrl, //仅为示例，非真实的接口地址
      filePath: tempFilePaths[i],
      name: name,
      formData: formData,
      success(res) {
        this_.n++;

        if (this_.n < len) {

          this_.uploadImage(name, this_.n, len, tempFilePaths, formData, that, callback);
        } else {
         
          rUtils.slideModal.down(that, null, false);

          var rdata = res.data;
          rdata = { ...rdata, filePath: tempFilePaths[i] }
          typeof callback == "function" && callback(rdata)


        }

      }
    })

  }
}


module.exports = {
  upload: upload,

}
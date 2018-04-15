// pages/login/index.js
Page({
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  tokenBindInput: function (e) {
    this.data.token = e.detail.value;
  },
  login: function () {
    if (this.data.token) {
      var token = this.data.token.trim();
      wx.showLoading({
        title: '登录中',
      })
      wx.request({
        url: `https://cnodejs.org/api/v1/accesstoken?accesstoken=${token}`,
        method: "post",
        success: function (response) {
          wx.hideLoading();
          if (response.data.success) {
            wx.setStorage({
              key: 'cnode.userinfo',
              data: response.data
            });
            wx.setStorage({
              key: 'cnode.userauth',
              data: token
            });
            getApp().globalData.userInfo = response.data;
            getApp().globalData.userAuth = token;
            wx.navigateBack({
              delta: 1
            });
          } else {
            wx.showToast({
              title: response.data.error_msg,
              icon: "none",
              duration: 2000
            });
          }
        },
        fail: () => {
          wx.hideLoading();
        }
      })
    } else {
      wx.showToast({
        title: '请输入Token',
        icon: "none",
        duration: 2000
      });
    }
  },
  qrcodeLogin: function () {
    wx.scanCode({
      success: function (response) {
        let token = response.result;
        wx.showLoading({
          title: '登录中'
        })
        wx.request({
          url: `https://cnodejs.org/api/v1/accesstoken?accesstoken=${token}`,
          method: "post",
          success: function (result) {
            wx.hideLoading();
            if (result.data.success) {
              wx.setStorage({
                key: 'cnode.userinfo',
                data: result.data
              });
              wx.setStorage({
                key: 'cnode.userauth',
                data: token,
              });
              getApp().globalData.userInfo = result.data;
              getApp().globalData.userAuth = token;
              wx.navigateBack({
                delta: 1
              });
            } else {
              wx.showToast({
                title: response.data.error_msg,
                icon: "none",
                duration: 2000
              });
            }
          },
          fail: () => {
            wx.hideLoading();
          }
        })
      }
    })
  }
})
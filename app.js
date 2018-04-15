//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    userAuth: ""
  }
})

wx.needLogin = (action) => {
  if (getApp().globalData.userInfo == null) {
    wx.customNavigateTo({
      url: '/pages/login/index',
    });
  } else {
    if (action) {
      action();
    }
  }
}
wx.getStorage({
  key: 'cnode.userinfo',
  success: (res) => {
    if (res.data) {
      getApp().globalData.userInfo = res.data;
    }
  }
})
wx.getStorage({
  key: 'cnode.userauth',
  success: function (res) {
    if (res.data) {
      getApp().globalData.userAuth = res.data;
    }
  }
})

wx.customNavigateTo = function (options) {
  wx.navigateTo({
    url: options.url,
    fail: function (error) {
      wx.redirectTo({
        url: options.url,
      })
    }
  })
}
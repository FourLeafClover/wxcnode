// pages/message/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 1,
    model: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let token = getApp().globalData.userAuth;
    wx.request({
      url: `https://cnodejs.org/api/v1/messages?accesstoken=${token}`,
      method: "get",
      success: (response) => {
        if (response.data.success) {
          this.setData({
            model: response.data.data
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '加载失败',
          icon: "warn",
          duration: 2000
        })
      }
    })
  },
  changeTab: function (e) {
    this.setData({
      activeTab: e.currentTarget.dataset.tab
    })
  },
  gotoTopic: function (e) {
    var item = e.currentTarget.dataset.item;
    var token = getApp().globalData.userAuth;
    if (!item.has_read) {
      wx.request({
        url: `https://cnodejs.org/api/v1/message/mark_one/${item.id}?accesstoken=${token}`,
        method: "post",
        success: function (result) {
          wx.customNavigateTo({
            url: `/pages/topic/index?id=${item.topic.id}`,
          })
        }
      })
    } else {
      wx.customNavigateTo({
        url: `/pages/topic/index?id=${item.topic.id}`,
      })
    }
  }
})
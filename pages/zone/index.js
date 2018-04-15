// pages/zone/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collects: [],
    model: null,
    activeTab: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = this.options.id;
    wx.showLoading();
    wx.request({
      url: `https://cnodejs.org/api/v1/user/${id}`,
      method: "get",
      success: (response) => {
        if (response.data.success) {
          this.setData({
            model: response.data.data
          })
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
    wx.request({
      url: `https://cnodejs.org/api/v1/topic_collect/${id}`,
      method: "get",
      success: (response) => {
        if (response.data.data) {
          this.setData({
            collects: [...response.data.data]
          });
        }
      }
    })
  },
  changeTab: function (e) {
    this.setData({
      activeTab: e.currentTarget.dataset.tag
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  gotoTopic: function (e) {
    var item = e.currentTarget.dataset.item;
    wx.customNavigateTo({
      url: `/pages/topic/index?id=${item.id}`,
    })
  }
})
// pages/addTopic/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: "",
    title: "",
    content: "",
    topic_id: "",
    disableBtn: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = this.options.id;
    if (id) {
      var token = getApp().globalData.userAuth;
      this.setData({
        topic_id: this.options.id
      });
      wx.request({
        url: `https://cnodejs.org/api/v1/topic/${id}?mdrender=false&accesstoken=${token}`,
        method: "get",
        success: (response) => {
          var topic = response.data.data;
          if (response.data.success) {
            this.setData({
              tab: topic.tab,
              content: topic.content,
              title: topic.title
            })
          }
        }
      })
    }
  },
  addTopic: function () {
    if (!this.checkRequestData()) {
      return;
    }
    var token = getApp().globalData.userAuth;
    this.setData({
      disableBtn: true
    });
    wx.showLoading({
      title: '话题创建中',
    })
    wx.request({
      url: 'https://cnodejs.org/api/v1/topics',
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        accesstoken: token,
        title: this.data.title,
        content: this.data.content,
        tab: this.data.tab
      },
      success: (response) => {
        wx.hideLoading();
        if (response.data.success) {
          wx.showToast({
            title: '创建成功'
          }, 1200);
          setTimeout(() => {
            this.setData({
              disableBtn: false
            });
            wx.customNavigateTo({
              url: `/pages/topic/index?id=${response.data.topic_id}`,
            });
          }, 1200);
        } else {
          this.setData({
            disableBtn: false
          });
          wx.showToast({
            title: response.data.error_msg,
            icon: "none",
            duration: 1200
          });
        }
      }
    })
  },
  updateTopic: function () {
    if (!this.checkRequestData()) {
      return;
    }
    var token = getApp().globalData.userAuth;
    this.setData({
      disableBtn: true
    });
    wx.request({
      url: 'https://cnodejs.org/api/v1/topics/update',
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        accesstoken: token,
        title: this.data.title,
        content: this.data.content,
        tab: this.data.tab,
        topic_id: this.data.topic_id
      },
      success: (response) => {
        if (response.data.success) {
          wx.showToast({
            title: '更新成功'
          }, 1200);
          setTimeout(() => {
            this.setData({
              disableBtn: false
            });
            wx.customNavigateTo({
              url: `/pages/topic/index?id=${response.data.topic_id}`,
            });
          }, 1200);
        } else {
          this.setData({
            disableBtn: false
          });
          wx.showToast({
            title: response.data.error_msg,
            icon: "none",
            duration: 1200
          });
        }
      }
    })
  },
  changeTab: function (e) {
    this.setData({
      tab: e.currentTarget.dataset.tab
    })
  },
  changeTitle: function (e) {
    this.data.title = e.detail.value;
  },
  changeContent: function (e) {
    this.data.content = e.detail.value;
  },
  checkRequestData: function () {
    var msg = "";
    if (this.data.tab == "") {
      msg = "请选择模块";
    }
    else if (this.data.title.trim() == "") {
      msg = "请输入标题";
    }
    else if (this.data.title.trim().length < 10) {
      msg = "标题不能少于10个字"
    }
    else if (this.data.content.trim() == "") {
      msg = "请输入话题内容"
    }
    if (msg) {
      wx.showToast({
        title: msg,
        icon: "none"
      });
      return false;
    } else {
      return true;
    }
  }
})
// 引入wemark
var wemark = require('../wemark/wemark');
import utils from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wemark: {},
    model: null,
    isMyTopic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var id = this.options.id;
    var token = getApp().globalData.userAuth;
    var userName = "";
    if (getApp().globalData.userInfo) {
      userName = getApp().globalData.userInfo.loginname;
    }
    wx.request({
      url: `https://cnodejs.org/api/v1/topic/${id}?mdrender=false&accesstoken=${token}`,
      method: "get",
      success: (response) => {
        if (response.data.success) {
          wx.setNavigationBarTitle({
            title: "话题详情",
          });
          var topic = response.data.data;
          topic.create_at = topic.create_at.substring(0, 10);
          var tab = utils.formatTopicTab(topic);
          topic.tab = tab;
          wemark.parse(response.data.data.content, this, {
            name: 'wemark'
          });
          this.setData({
            model: response.data.data,
            isMyTopic: response.data.data.author.loginname == userName
          });
        }
        else {
          wx.showToast({
            title: response.data.error_msg,
            icon: "none"
          });
          setTimeout(function () {
            wx.customNavigateTo({
              url: '/pages/index/index'
            })
          }, 2000)
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  shareBtn: function () {
    wx.customNavigateTo({
      url: '/pages/comment/index',
    })
  },
  collect: function () {
    if (this.data.model != null) {
      wx.needLogin(this.collectOpt);
    }
  },
  collectOpt: function () {
    var token = getApp().globalData.userAuth;
    var topicId = this.data.model.id;
    if (this.data.model.is_collect) {
      wx.request({
        url: "https://cnodejs.org/api/v1/topic_collect/de_collect",
        data: {
          accesstoken: token,
          topic_id: topicId
        },
        method: "post",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (response) => {
          var result = response.data;
          if (result.success) {
            this.data.model.is_collect = false;
            this.setData({
              model: this.data.model
            });
          } else {
            wx.showToast({
              title: result.message,
              icon: "none",
              duration: 2000
            });
          }
        }
      })
    } else {
      wx.request({
        url: "https://cnodejs.org/api/v1/topic_collect/collect",
        data: {
          accesstoken: token,
          topic_id: topicId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "post",
        success: (response) => {
          var result = response.data;
          if (result.success) {
            this.data.model.is_collect = true;
            this.setData({
              model: this.data.model
            });
          } else {
            wx.showToast({
              title: result.message,
              icon: "none",
              duration: 2000
            });
          }
        }
      })
    }
  },
  gotoComment: function () {
    wx.customNavigateTo({
      url: `/pages/comment/index?id=${this.data.model.id}`,
    })
  },
  gotoZone: function () {
    wx.customNavigateTo({
      url: `/pages/zone/index?id=${this.data.model.author.loginname}`,
    })
  },
  showOptSheet: function () {
    wx.showActionSheet({
      itemList: ['我的主页', '编辑'],
      success: (res) => {
        if (res.tapIndex == 0) {
          wx.customNavigateTo({
            url: `/pages/zone/index?id=${this.data.model.author.loginname}`,
          })
        }
        else if (res.tapIndex == 1) {
          wx.customNavigateTo({
            url: `/pages/addTopic/index?id=${this.data.model.id}`
          })
        }
      }
    })
  },
  previewImage: function (e) {
    var src = e.currentTarget.dataset.src;
    if (!src.startsWith("http")) {
      src = `https:${src}`;
    }
    wx.previewImage({
      urls: [src]
    })
  }
})
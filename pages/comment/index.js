// 引入wemark
var wemark = require('../wemark/wemark');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    replies: [],
    replyItem: null,
    showCommentBtn: true,
    isAddCommentShow: false,
    isRelpyCommentShow: false,
    haveComments: true,
    myReplies: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = this.options.id;
    var token = getApp().globalData.userAuth;
    wx.request({
      url: `https://cnodejs.org/api/v1/topic/${id}?mdrender=false&accesstoken=${token}`,
      method: "get",
      success: (response) => {
        wx.hideLoading();
        if (response.data.success) {
          var replies = response.data.data.replies;
          replies.map(item => {
            item.content = wemark.getParseView(item.content);
          });
          this.setData({
            replies: replies,
            haveComments: replies.length > 0
          });
        } else {
          wx.showToast({
            title: response.data.error_msg,
            icon: "none"
          });
        }
      }
    })
  },
  addreplyUser: function (e) {
    wx.needLogin(() => {
      this.setData({
        showCommentBtn: false,
        isRelpyCommentShow: true,
        replyItem: e.currentTarget.dataset.item
      });
    })
  },
  closeReplyComment: function (e) {
    this.setData({
      showCommentBtn: true,
      isRelpyCommentShow: false,
      replyItem: null
    });
  },
  showAddComment: function () {
    wx.needLogin(() => {
      this.setData({
        showCommentBtn: false,
        isAddCommentShow: true
      });
    });
  },
  closeAddComment: function (e) {
    this.setData({
      showCommentBtn: true,
      isAddCommentShow: false
    });
  },
  addComment: function (e) {
    var token = getApp().globalData.userAuth;
    var replyId = this.data.replyItem != null ? this.data.replyItem.id : "";
    var topic_Id = this.options.id;
    var curUser = getApp().globalData.userInfo;
    var content = "";
    var tempContent = "";
    if (e.detail.value == null || e.detail.value.trim().length == 0) {
      return;
    }

    var value = e.detail.value.trim();
    if (replyId != "") {
      //@用户,url保持与PC端一致
      content = `[@${this.data.replyItem.author.loginname}](/user/${this.data.replyItem.author.loginname})     ${value}  \x0a  [【来自酷炫的小程序】](https://github.com/FourLeafClover/wxcnode)`;
      tempContent = `@${this.data.replyItem.author.loginname}  \x0a  ${value}`;
    } else {
      content = `${value}  \x0a  [【来自酷炫的小程序】](https://github.com/FourLeafClover/wxcnode)`
      tempContent = value;
    }
    wx.request({
      url: `https://cnodejs.org/api/v1/topic/${topic_Id}/replies`,
      data: {
        content: content,
        replyId: replyId,
        accesstoken: token
      },
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (response) => {
        if (response.data.success) {
          wx.showToast({
            title: replyId == "" ? '评论话题成功' : "回复评论成功"
          });
          this.setData({
            myReplies: [...this.data.myReplies, tempContent],
            haveComments: true
          });
        } else {
          wx.showToast({
            title: '评论失败',
            icon: "none"
          });
        }
      }
    })
  },
  likeComent: function (e) {
    wx.needLogin(() => {
      var item = e.currentTarget.dataset.item;
      var token = getApp().globalData.userAuth;
      wx.request({
        url: `https://cnodejs.org/api/v1/reply/${item.id}/ups?accesstoken=${token}`,
        method: "post",
        success: (response) => {
          if (response.data.success) {
            this.data.replies.map(i => {
              if (i.id == item.id) {
                i.is_uped = !i.is_uped;
              }
            });
            this.setData({
              replies: this.data.replies
            })

            wx.showToast({
              title: item.is_uped ? "点赞已取消" : "点赞成功",
              icon: "none"
            })

          } else {
            wx.showToast({
              title: response.data.error_msg,
              icon: "none"
            })
          }
        }
      })
    })
  },
  gotoZone: function (e) {
    var avatarName = e.currentTarget.dataset.name;
    wx.customNavigateTo({
      url: `/pages/zone/index?id=${avatarName}`
    });
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
//index.js
import utils from "../../utils/util.js"
//获取应用实例
const app = getApp()

Page({
  data: {
    items: [],
    pageIndex: 1,
    curTab: "",
    userInfo: null,
    isShowMenu: false,
    messageCount: 0,
    loadingComplete: false
  },
  onShareAppMessage: function () {

  },
  //事件处理函数
  changeTab: function (e) {
    this.setData({
      curTab: e.target.dataset.tab,
      loadingComplete: false
    });
    this.data.pageIndex = 1;
    this.setData({
      items: []
    });
    this.getItems();
  },
  onLoad: function () {
    this.getItems();
  },
  onShow: function () {
    this.setData({
      userInfo: getApp().globalData.userInfo
    });
    this.getMessageCount();
  },
  getItems: function () {
    wx.request({
      url: `https://cnodejs.org/api/v1/topics?page=${this.data.pageIndex}&tab=${this.data.curTab}&limit=20&mdrender=false`,
      method: "get",
      success: (response) => {
        response.data.data.map((item) => {
          item.content = item.content.substring(0, 200);
          item.last_reply_at = new Date(item.last_reply_at).toLocaleDateString();
          item.tab = utils.formatTopicTab(item);
        });
        this.data.items = [...this.data.items, ...response.data.data];
        this.setData({
          items: this.data.items,
          loadingComplete: response.data.data.length < 20
        })
      }
    })
  },
  getMessageCount: function () {
    var accesstoken = getApp().globalData.userAuth;
    if (accesstoken) {
      wx.request({
        url: `https://cnodejs.org/api/v1/message/count?accesstoken=${accesstoken}`,
        method: "get",
        success: (response) => {
          this.setData({
            messageCount: response.data.data
          })
        }
      })
    } else {
      this.setData({
        messageCount: 0
      })
    }
  },
  onReachBottom: function (e) {
    if (!this.data.loadingComplete) {
      this.data.pageIndex += 1;
      this.getItems();
    }
  },
  gotoLogin: function () {
    this.toggleMenu();
    wx.customNavigateTo({
      url: '/pages/login/index'
    })
  },
  toggleMenu: function () {
    this.setData({
      isShowMenu: !this.data.isShowMenu
    });
  },
  loginOut: function () {
    this.toggleMenu();
    wx.removeStorage({
      key: 'cnode.userauth',
      success: function (res) { }
    });
    wx.removeStorage({
      key: 'cnode.userinfo',
      success: function (res) { }
    });
    getApp().globalData.userInfo == null;
    getApp().globalData.userauth = "";
    this.setData({
      userInfo: null
    });
  },
  gotoDetail: function (e) {
    var item = e.currentTarget.dataset.item;
    wx.customNavigateTo({
      url: `/pages/topic/index?id=${item.id}`
    })
  },
  gotoZone: function () {
    this.toggleMenu();
    wx.customNavigateTo({
      url: `/pages/zone/index?id=${this.data.userInfo.loginname}`
    });
  },
  gotoMsg: function () {
    wx.needLogin(() => {
      wx.customNavigateTo({
        url: '/pages/message/index'
      })
    });
  },
  logout: function () {
    this.toggleMenu();
    wx.removeStorage({
      key: 'cnode.userinfo',
      success: function (res) { },
    });
    wx.removeStorage({
      key: 'cnode.userauth',
      success: function (res) { },
    });
    getApp().globalData.userInfo = null;
    getApp().globalData.userAuth = "";
    this.setData({
      userInfo: null,
      messageCount: 0
    });
  },
  gotoAboutMe: function () {
    this.toggleMenu();
    wx.customNavigateTo({
      url: '/pages/aboutDeveloper/index'
    })
  },
  gotoAddTopic: function () {
    this.toggleMenu();
    wx.customNavigateTo({
      url: '/pages/addTopic/index'
    })
  }
})

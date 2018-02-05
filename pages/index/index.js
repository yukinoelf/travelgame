//index.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    flag: [],
    userFlag:"",
    user: app.globalData.userInfo
  },

  onLoad: function () {
    this.checkSettingStatu()
  },

  fetchFlagList() {
    util.getFlag(this, (res) => {
      console.log(res.data.objects)
      this.setData({
        flag: res.data.objects, // bookList array, mock data in mock/mock.js
        user: app.globalData.userInfo
      })
    })
  },

  storeResult() {
    util.addResult(this, (res) => {
      console.log(res.data.objects)
    })
  },

  showCity(e) {
    this.data.userFlag = e.target.dataset.flag;
    app.globalData.cityName = e.target.dataset.city
    app.globalData.cityImage = e.target.dataset.image
    wx.navigateTo({
      url: '../city/city'
    })
    this.storeResult()
  },

  checkSettingStatu: function (cb) {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (util.isEmptyObject(authSetting)) {
          console.log('首次授权');
          /*wx.getUserInfo({
            success: function (res) {
              this.identifySucess()
            }
          })*/
          wx.BaaS.login().then(() => {
            app.globalData.userInfo = wx.BaaS.storage.get('userinfo')
            that.fetchFlagList()
          })
        } else {
          console.log('不是第一次授权', authSetting);
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(res) {
                      console.log('openSetting success', res.authSetting);
                      /*wx.getUserInfo({
                        success: function (res) {
                          this.identifySucess()
                        }
                      })*/
                      wx.BaaS.login().then(() => {
                        app.globalData.userInfo = wx.BaaS.storage.get('userinfo')
                        that.fetchFlagList()
                      })
                    }
                  });
                }
              }
            })
          } else {
            app.globalData.userInfo = wx.BaaS.storage.get('userinfo')
            console.log(app.globalData.userInfo.nickName)
            that.fetchFlagList()
          }
        }
      }
    });
  }
})

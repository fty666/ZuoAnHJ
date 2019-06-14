// pages/myinfo/myinfo.js
var util = require('../../utils/util.js');
var template = require('../../template/template.js');
const app = getApp();
let userInforVar = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    all_order: -1,
    pending_payment: 0,
    to_be_shipped: 1,
    to_be_received: 2,
    to_be_evaluated: 3,
    self_extraction: 4,
    accomplish: 5,
    membershipPrivilege: [],
    serverUrl: app.globalData.aliyunServerURL,
    px2rpxWidth: '',//手机比例
    px2rpxHeight: '',
    cakes: '',//精品推荐
    Tid: '',//精品推荐第一个
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    template.tabbar("tabBar", 3, this, app.globalData.vipLevel); //0表示第一个tabbar
    userInforVar = wx.getStorageSync('userInfo');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 获取用户信息缓存
    // 热销,精品推荐
    util.myWxRequest(app.globalData.getGoodsBySaleCountDesc, {}, function (res) {
      let cakes = res.data.data.slice(0, 4);
      that.setData({
        cakes: cakes,
        Tid: cakes[0].id
      })
    });

    // 用户信息
    util.myWxRequest(app.globalData.getUserInfoUrl, { userId: userInforVar.id }, function (res) {
      that.setData({
        userInfo: res.data.data
      });
    });

    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function (res) {
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })

  },

  // 地址管理
  guanli: function () {
    util.myWxRequest(app.globalData.getAddrUrl, { user_id: userInforVar.id }, function (res) {
      var length = res.data.data.length
      if (length > 0) {
        wx.navigateTo({
          url: '/pages/address/insert/insert'
        })
      } else {
        wx.navigateTo({
          url: '/pages/address/address/address'
        })
      }
    });
  },

  /**
   *收藏界面 
   */
  collects: function () {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },

  /**
   *客服 
   */
  custom: function () {
    wx.makePhoneCall({
      phoneNumber: '18722405700',
    })
  },

  /**
   *申请买酒 
   */
  buy: function () {
    // 判断经销商
    if (userInforVar.vipLevel == 2) {
      wx.navigateTo({
        url: '/pages/trader/user/user'
      })
    } else {
      wx.navigateTo({
        url: '/pages/trader/select/select',
      })
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   *没有经销商敬请期待 
   */
  please: function () {
    wx.showModal({
      title: '敬请期待',
      content: '活动还未开始',
    })
  },

  /**
   *优惠券 
   */
  favour: function () {

  }
})
// pages/trader/index/index.js
const util = require('../../../utils/util.js');
const app = getApp();
const template = require('../../../template/template.js');
var input_value = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //国家循环
    goodsGroup: [],
    // 轮播图
    brand: [],
    // 相关推荐信息
    recommend: [],
    serverUrl: app.globalData.aliyunServerURL,
    page: 1,
    pageSize: 8,
    empower: true, //授权
    cakes: '', //热销
    px2rpxHeight: '', //页面高度
    px2rpxWidth: '', //页面宽度
    accredit: '', //是否授权
    sellId: '', //销售员ID
    shows: false, //显示
    Tid: '', //第一个相关推荐商品跳转
  },
  // 活动跳转事件
  activity: function() {
    wx.navigateTo({
      url: '/pages/seckill/seckill'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var scene = decodeURIComponent(options.scene)
    this.setData({
      sellId: scene
    })
    app.globalData.sellId = scene;
    if (scene == undefined || scene == 'undefined') {

    } else {
      this.setData({
        sellId: scene
      })
      setTimeout(function() {
        util.myWxRequest(app.globalData.insertSalesPersonUser, {
          userId: app.globalData.userId,
          salespersonId: scene
        }, function(res) {});
      }, 1000)
    }
    // 加载页面tarBar模块
    template.tabbar("tabBar", 0, this, app.globalData.vipLevel);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    // 获取授权的判断
    setTimeout(function() {
      if (app.globalData.accredit == '0' || 0) {
        that.setData({
          shows: true
        })
      } else {
        that.setData({
          shows: false
        })
      }
      that.setData({
        accredit: app.globalData.accredit
      })
    }, 1000)

    //  国家页面  获取分类组
    util.myWxRequest(app.globalData.getPlaceUrl, {}, function(res) {
      let country = res.data.data.slice(0, 7)
      that.setData({
        goodsGroup: country,
      });
    });

    // 相关推荐  
    util.myWxRequest(app.globalData.getGoodsType, {
      page: that.data.page,
      pageSize: that.data.pageSize
    }, function(res) {
      let arrays = res.data.data.PageInfo.list;
      that.setData({
        recommend: arrays,
        Tid: arrays[0].id
      });
    });

    // 热销
    util.myWxRequest(app.globalData.getGoodsBySaleCountDesc, {}, function(res) {
      that.setData({
        cakes: res.data.data[0].gname,
      })
    });

    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function(res) {
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })

    //获取是否授权 
    wx.getStorage({
      key: 'accredit',
      success: function(res) {
        that.setData({
          accredit: res.data,
        })
      }
    })

    //获取轮播图
    util.myWxRequest(app.globalData.getBanner, {}, function(res) {
      // console.log(res.data.data);
      that.setData({
        brand: res.data.data,
      });
    });

  },

  /**
   *判断轮播图 
   */
  getBan(e) {
    // console.log(e.target.dataset.index);
    if (e.target.dataset.index.type == 1) {
      wx.navigateTo({
        url: '/pages/goods_detail/goods_detail?id=' + e.target.dataset.index.attribute,
      })
    } else {
      util.myWxRequest(app.globalData.addCoupon, {
        couponId: e.target.dataset.index.attribute,
        userId: app.globalData.userId
      }, function(res) {
        wx.showToast({
          title: '领取成功',
        })
        wx.showModal
      });
    }
  },

  /**
   *加载数据 
   */
  scrollToLower: function() {
    let that = this;
    let pageSize = that.data.pageSize;
    pageSize += 10;
    // 相关推荐  
    util.myWxRequest(app.globalData.getGoodsType, {
      page: that.data.page,
      pageSize: pageSize
    }, function(res) {
      let arrays = res.data.data.PageInfo.list;
      that.setData({
        recommend: arrays
      });
    });
  },


  /**
   *获取微信信息 
   */
  onGotUserInfo: function(e) {
    let that = this;
    // if (e.detail.errMsg == 'getUserInfo:ok') {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      app.globalData.userInfo = e.detail.userInfo;
      app.globalData.accredit = '1';
      that.setData({
        accredit: 1,
        shows: false
      })
      // 获取
      util.myWxRequest(app.globalData.updateUserLevel, {
        userId: app.globalData.userId,
        accredit: 1
      }, function(res) {});
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/users/users/users',
        })
      }, 500)
    } else {
      wx.showToast({
        title: '授权失败',
      })
    }
    // }
  },


  /**
   *相关推荐时的跳转 
   */
  tui: function() {
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + this.data.Tid,
    })
  },

  /**
   * 搜索框失去焦点时
   */
  inputBlur: function(e) {
    let arrayVal = [];
    let cakes = this.data.cakes;
    if (e.detail.value.length == 0) {
      arrayVal.push(cakes);
      input_value = cakes;
    } else {
      arrayVal.push(e.detail.value);
      input_value = e.detail.value;
    }

    // 获取保存用户搜索数据
    util.getSetStorage(input_value, arrayVal);
  },

  /**
   * 点击完成按钮时触发
   */
  inputConfirm: function(e) {
    let cakes = this.data.cakes;
    let arrayVal = [];
    if (e.detail.value == '') {
      arrayVal.push(cakes);
    } else {
      arrayVal.push(e.detail.value);
    }
    // 搜索商品
    mySearch(e.detail.value);
    // 获取保存用户搜索数据
    util.getSetStorage(e.detail.value, arrayVal);

  },
  /**
   * 搜索商品
   */
  searchGoods: function() {
    let val = '';
    if (input_value == '') {
      val = this.data.cakes;
    } else {
      val = input_value;
    }
    mySearch(val);
  },

})

/**
 * 搜索的方法
 */
function mySearch(val) {
  wx: wx.navigateTo({
    url: '/pages/goods_list/goods_list?goodsName=' + val,
  })
}
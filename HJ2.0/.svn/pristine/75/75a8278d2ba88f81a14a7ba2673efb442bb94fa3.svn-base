// pages/goods_list/goods_list.js
var util = require('../../utils/util.js');
const app = getApp();
var multiple_flag = true;
var sales_volume_flag = true;
var new_product_flag = true;
var my_price_flag = true;
// var myclassId = 0;
var myPageSize = 20;
var myPage = 1;
var condition = 1;
var myurl = '';
var val = '';//商品名
var status = '';
var place = '';//国家
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    mysort: {
      ping: '../../images/ping.png',
      shang: '../../images/shang.png',
      xia: '../../images/xia.png'
    },
    zonghe_png: '../../images/ping.png',
    xiaoliang_png: '../../images/ping.png',
    xinpin_png: '../../images/ping.png',
    jiage_png: '../../images/ping.png',
    serverUrl: app.globalData.aliyunServerURL,
    height: '',
    px2rpxHeight: '',
    px2rpxWidth: '',
    isLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let title = '';
    if (options.goodsName) {
      title = options.goodsName;
    }
    if (options.name) {
      title = options.name;
    }

    let that = this;
    // 动态设置页面标题
    wx.setNavigationBarTitle({
      title: title,
    });
    myurl = app.globalData.getGoodsByConditionUrl;
    val = '';
    place = '';
    if (options.name) {
      place = options.name;
    }
    if (options.goodsName) {
      val = options.goodsName;
    }
    status = 'getGoodsByConditionUrl';
    getGoods(myurl, val, myPage, myPageSize, 1, that, status, place)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // console.log('height=' + res.windowHeight);
        that.setData({
          height: res.windowHeight
        })
      }
    })

    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function (res) {
        console.log(res)
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 添加到购物车按钮
   */
  addToCart: function (e) {
    let mygoodsId = e.currentTarget.dataset.id;
    let myuserId = 1;
    let mynum = 1;
    let mycartsPrice = e.currentTarget.dataset.price;
    // 调用 加入购物车 全局方法
    // console.log(mygoodsId, myuserId, mynum, mycartsPrice);
    util.addToCartFun(mygoodsId, myuserId, mynum, mycartsPrice);
  },

  /**
   * 综合排序
   */
  multiple: function () {
    let that = this;
    if (multiple_flag) {
      that.setData({
        zonghe_png: '../../images/xia.png'
      });
      getGoods(myurl, val, myPage, myPageSize, 1, that, status, place)
      condition = 1;
      multiple_flag = false;
    } else {
      that.setData({
        zonghe_png: '../../images/shang.png'
      });
      getGoods(myurl, val, myPage, myPageSize, 1, that, status, place)
      condition = 1;
      multiple_flag = true;
    }
    that.setData({
      xiaoliang_png: '../../images/ping.png',
      xinpin_png: '../../images/ping.png',
      jiage_png: '../../images/ping.png'
    });
  },

  /**
   * 销量排序
   */
  salesVolume: function () {
    var that = this;
    if (sales_volume_flag) {
      that.setData({
        xiaoliang_png: '../../images/xia.png'
      });
      getGoods(myurl, val, myPage, myPageSize, 2, that, status, place)
      condition = 2;
      sales_volume_flag = false;
    } else {
      that.setData({
        xiaoliang_png: '../../images/shang.png'
      });
      getGoods(myurl, val, myPage, myPageSize, 3, that, status, place)
      condition = 3;
      sales_volume_flag = true;
    }
    that.setData({
      zonghe_png: '../../images/ping.png',
      xinpin_png: '../../images/ping.png',
      jiage_png: '../../images/ping.png'
    });
  },

  /**
   * 新品排序
   */
  newProduct: function () {
    var that = this;
    if (new_product_flag) {
      that.setData({
        xinpin_png: '../../images/xia.png'
      });
      getGoods(myurl, val, myPage, myPageSize, 4, that, status, place)
      condition = 4;
      new_product_flag = false;
    } else {
      that.setData({
        xinpin_png: '../../images/shang.png'
      });
      getGoods(myurl, val, myPage, myPageSize, 5, that, status, place)
      condition = 5;
      new_product_flag = true;
    }
    that.setData({
      zonghe_png: '../../images/ping.png',
      xiaoliang_png: '../../images/ping.png',
      jiage_png: '../../images/ping.png'
    });
  },
  /**
   * 价格排序
   */
  myPrice: function () {
    var that = this;
    if (my_price_flag) {
      that.setData({
        jiage_png: '../../images/xia.png'
      });
      getGoods(myurl, val, myPage, myPageSize, 6, that, status, place)
      condition = 6;
      my_price_flag = false;
    } else {
      that.setData({
        jiage_png: '../../images/shang.png'
      });
      getGoods(myurl, val, myPage, myPageSize, 7, that, status, place)
      condition = 7;
      my_price_flag = true;
    }
    that.setData({
      zonghe_png: '../../images/ping.png',
      xiaoliang_png: '../../images/ping.png',
      xinpin_png: '../../images/ping.png'
    });
  },

  /**
   * 滚动到底部触发
   */
  scrollToLower: function () {
    var that = this;
    that.setData({
      isLoading: true
    });
    myPageSize += 20;
    getGoods(myurl, val, myPage, myPageSize, 1, that, status, place)

  }


});

/**
 * 排序时获取商品列表
 */
function getGoods(myurl, val, myPage, myPageSize, mySort, that, status, place) {
  let data = {
    classify: '',
    place: place,
    taste: '',
    variety: '',
    character: '',
    page: myPage,
    pageSize: myPageSize,
    price: '',
    capacity: '',
    name: val,
    condition: mySort
  }

  // 获取商品列表
  util.myWxRequest(app.globalData.getGoodsUrl, data, function (res) {
    let list = res.data.data.PageInfo.list;
    that.setData({
      goods: list,
      isLoading: false
    });
    console.log(res.data.data.PageInfo.list)
  });

}

function getGoods(myurl, val, myPage, myPageSize, mySort, that, status, place) {
  let data = {
    classify: '',
    place: place,
    taste: '',
    variety: '',
    character: '',
    page: myPage,
    pageSize: myPageSize,
    price: '',
    capacity: '',
    name: val,
    condition: mySort
  }

  // 获取商品列表
  util.myWxRequest(app.globalData.getGoodsUrl, data, function (res) {
    let list = res.data.data.PageInfo.list;
    that.setData({
      goods: list,
      isLoading: false
    });
    console.log(res.data.data.PageInfo.list)
  });

}
// pages/goods_cate/goods_cate.js
var util = require('../../utils/util.js');
var template = require('../../template/template.js');
const app = getApp();
var input_value = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsGroup: [],
    current_id: 1,
    goodsClass: '', //分类类别
    serverUrl: app.globalData.aliyunServerURL,
    shopinfo: '', //商品详情
    classify: '', //分类
    place: '', //产地
    taste: '', //口感
    variety: '', //品种
    character: '', //特性
    page: 1,
    pageSize: 20,
    price: '', //价格
    capacity: '', //容量
    name: '', //商品名
    condition: 1, //排序（1默认2销量降3销量升4创建时间降5时间升6价格降7价格升）
    chidden: false, //默认隐藏
    contact: '', //组与类挂钩
    style: 0, //样式选择
    kinds: '', //类样式
    px2rpxHeight: '', //页面手机样式
    px2rpxWidth: '',
    all: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    template.tabbar("tabBar", 1, this, app.globalData.vipLevel); //0表示第一个tabbar
    // 获取商品信息
    sinfo(that)

    // // 获取分组
    util.myWxRequest(app.globalData.getGoodClassUrl, {}, function(res) {
      // console.log(res)
      // that.setData({
      //     groupClass: res.data.data,
      // });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
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
  },

  /**
   *推荐 
   */
  recommend: function() {
    this.setData({
      chidden: false,
      style: 0,
      all: true
    });
    let that = this;
    sinfos(that)
  },

  /**
   *分类 
   */
  classifys: function() {
    let that = this;
    util.myWxRequest(app.globalData.getClassifyUrl, {}, function(res) {
      // console.log(res)
      that.setData({
        goodsClass: res.data.data,
        chidden: true,
        contact: 7,
        style: 7,
      });
    });
  },

  /**
   *产地 
   */
  places: function() {
    let that = this;
    util.myWxRequest(app.globalData.getPlaceUrl, {}, function(res) {
      // console.log(res)
      that.setData({
        goodsClass: res.data.data,
        chidden: true,
        contact: 1,
        style: 1
      });
    });
  },

  /**
   *口感 
   */
  taste: function() {
    let that = this;
    util.myWxRequest(app.globalData.getTasteUrl, {}, function(res) {
      // console.log(res)
      that.setData({
        goodsClass: res.data.data,
        chidden: true,
        contact: 4,
        style: 4
      });
    });
  },

  /**
   *品种 
   */
  variety: function() {
    let that = this;
    util.myWxRequest(app.globalData.getVarietyUrl, {}, function(res) {
      // console.log(res)
      that.setData({
        goodsClass: res.data.data,
        chidden: true,
        contact: 5,
        style: 5
      });
    });
  },

  /**
   *特性 
   */
  character: function() {
    let that = this;
    util.myWxRequest(app.globalData.getCharacterUrl, {}, function(res) {
      // console.log(res)
      that.setData({
        goodsClass: res.data.data,
        chidden: true,
        contact: 6,
        style: 6
      });
    });
  },

  /**
   *价格 
   */
  price: function() {
    let that = this;
    util.myWxRequest(app.globalData.getPriceUrl, {}, function(res) {
      // console.log(res)
      that.setData({
        goodsClass: res.data.data,
        chidden: true,
        contact: 2,
        style: 2
      });
    });
  },

  /**
   *年份
   */
  year: function() {
    let that = this;
    util.myWxRequest(app.globalData.getWineAgeUrl, {}, function(res) {
      // console.log(res)
      that.setData({
        goodsClass: res.data.data,
        chidden: true,
        contact: 8,
        style: 8
      });
    });
  },

  /**
   *容量 
   */
  capacity: function() {
    let that = this;
    util.myWxRequest(app.globalData.getCapacityUrl, {}, function(res) {
      // console.log(res)
      that.setData({
        goodsClass: res.data.data,
        chidden: true,
        contact: 3,
        style: 3
      });
    });
  },

  /**
   *商品详情 
   */
  shopinfo: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + id,
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   *监听页面滑动事件 
   */
  handletouchmove: function(event) {
    this.setData({
      chidden: false
    })
  },


  /**
   *传递规格参数 
   */
  concrete: function(e) {
    this.setData({
      kinds: e.currentTarget.dataset.index
    })
    // console.log(e)
    let that = this;
    let contact = that.data.contact; //分组id        
    let names = e.currentTarget.dataset.gname; //选取的分组信息
    // console.log(names)
    // console.log(contact)
    switch (contact) {
      case 1:
        let group = [];
        console.log(typeof(group))
        group.push(names);
        group = group.join() + ',';
        console.log(group)
        that.setData({
          place: group
        })
        break;
      case 2:
        let groups = [];
        groups.push(names);
        console.log(groups)
        groups = groups.join() + ',';
        that.setData({
          price: groups
        })
        break;
      case 3:
        let group3 = [];
        group3.push(names);
        console.log(group3)
        group3 = group3.join() + ',';
        that.setData({
          capacity: group3
        })
        break;
      case 4:
        let group4 = [];
        group4.push(names);
        console.log(group4)
        group4 = group4.join() + ',';
        that.setData({
          taste: group4
        })
        break;
      case 5:
        let group5 = [];
        group5.push(names);
        console.log(group5)
        group5 = group5.join() + ',';
        that.setData({
          variety: group5
        })
        break;
      case 6:
        let group6 = [];
        group6.push(names);
        console.log(group6)
        group6 = group6.join() + ',';
        that.setData({
          character: group6
        })
        break;
      case 7:
        let group7 = [];
        group7.push(names);
        console.log(group7)
        group7 = group7.join() + ',';
        that.setData({
          classify: group7
        })
        break;
      case 8:
        let group8 = [];
        group8.push(names);
        console.log(group8)
        group8 = group8.join() + ',';
        that.setData({
          classify: group8
        })
        break;
    }

    // 重新获取数据
    sinfo(that);
    // that.setData({
    //     kinds:''
    // })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 点击类别组获取类别
   */
  goodsGroup: function(e) {
    var that = this;
    // 获取组id
    var id = e.currentTarget.dataset.id;
    that.setData({
      current_id: id
    });
    // 获取类别
    util.myWxRequest(app.globalData.getGoodsClassUrl, {
      groupId: id
    }, function(res) {
      that.setData({
        goodsClass: res.data.data,
      });
      // console.log(res.data.data)
    });

  },

  /**
   * 搜索框失去焦点时
   */
  inputBlur: function(e) {
    input_value = e.detail.value;
    let arrayVal = [];
    arrayVal.push(e.detail.value);
    // 获取保存用户搜索数据
    util.getSetStorage(app.globalData.userId, e.detail.value, arrayVal);
  },

  /**
   * 搜索商品
   */
  searchGoods: function() {
    let val = input_value;
    mySearch(val);
  },
  /**
   * 点击完成按钮时触发
   */
  inputConfirm: function(e) {
    // 获取输入的值
    var val = e.detail.value;
    let arrayVal = [];
    arrayVal.push(val);
    // 获取保存用户搜索数据
    util.getSetStorage(app.globalData.userId, val, arrayVal);
    // 搜索
    mySearch(val);
  },

  /**
   * 点击类别跳转到商品
   */
  classToGoods: function(e) {
    var that = this;
    // 获取类别id
    var id = e.currentTarget.dataset.classid;
    var classname = e.currentTarget.dataset.classname;
    wx.navigateTo({
      url: '../goods_list/goods_list?classid=' + id + '&classname=' + classname
    });
  },

  /**
   *加载数据 
   */
  scrollToLower: function() {
    let that = this;
    let pageSize = that.data.pageSize;
    let all = that.data.all;
    pageSize += 20;
    that.setData({
      pageSize: pageSize
    })
    if (all) {
      sinfos(that)
    } else {
      sinfo(that)

    }
  },

});

/**
 * 搜索的方法
 */
function mySearch(val) {
  wx: wx.navigateTo({
    url: '/pages/goods_list/goods_list?goodsName=' + val,
  })
}

/**
 *获取商品列表 
 */
function sinfo(that) {
  // 获取分类组
  let data = {
    classify: that.data.classify,
    place: that.data.place,
    taste: that.data.taste,
    variety: that.data.variety,
    character: that.data.character,
    page: that.data.page,
    pageSize: that.data.pageSize,
    price: that.data.price,
    capacity: that.data.capacity,
    name: that.data.name,
    condition: that.data.condition
  }
  // 获取商品列表
  util.myWxRequest(app.globalData.getGoodsUrl, data, function(res) {
    that.setData({
      shopinfo: res.data.data.PageInfo.list
    });
    // console.log(that.data.shopinfo.length)
    // console.log(res.data.data.PageInfo.list)
  });
}

function sinfos(that) {
  // 获取分类组
  let data = {
    classify: '',
    place: '',
    taste: '',
    variety: '',
    character: '',
    page: that.data.page,
    pageSize: that.data.pageSize,
    price: '',
    capacity: '',
    name: '',
    condition: ''
  }
  // 获取商品列表
  util.myWxRequest(app.globalData.getGoodsUrl, data, function(res) {
    that.setData({
      shopinfo: res.data.data.PageInfo.list
    });
    // console.log(that.data.shopinfo.length)
    // console.log(res.data.data.PageInfo.list)
  });
}
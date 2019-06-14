// pages/myorder/myorder.js
const util = require('../../utils/util.js');
const app = getApp();
var page = 1;
var pageSize = 10;
var Xstatus = '';
// var all_order = -1;      // 全部
// var pending_payment = 0; // 待支付
// var to_be_shipped = 1;   // 待发货
// var to_be_received = 2;  // 待收货
// var to_be_evaluated = 3; // 待评价
// var self_extraction = 4; // 自提
// var accomplish = 5;      // 已完成	
// remove==7                取消的订单
Page({
  /**
   * 页面的初始数据
   */
  data: {
    all_order: -1,
    pending_payment: 0,
    to_be_shipped: 1,
    to_be_received: 2,
    to_be_evaluated: 3,
    self_extraction: 4,
    accomplish: 5,
    remove: 7,
    myorder: null,
    current_orderStatus: -1,
    commet_afterSale: true,
    index: null,
    serverUrl: app.globalData.aliyunServerURL,
    bj: 1,//页面经销商和普通用户背景
    px2rpxHeight: '',
    px2rpxWidth: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // 触发提醒发货
    util.myWxRequest(app.globalData.updateTiXingZT, { userId: app.globalData.userId }, function (res) {
    });

    if (options.dealerCode == 'null') {
      this.setData({
        bj: 2
      })
    } else {
      this.setData({
        bj: 1
      })
    }
    let that = this;
    let mystatus = '';
    if (options.status) {
      mystatus = options.status;
    } else {
      mystatus = -1;
    }
    // console.log(mystatus)
    // 获取订单
    queryOrder(mystatus, that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
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
   * 全部
   */
  allOrders: function (e) {
    let that = this;
    let mystatus = -1;
    Xstatus = mystatus;
    // console.log(mystatus);
    // 获取订单
    queryOrder(mystatus, that);
  },

  /**
   *客服电话 
   */
  custom: function () {
    wx.makePhoneCall({
      phoneNumber: '18722405700',
    })
  },

  /**
   *去付款 
   */
  pays: function (e) {
    let index = e.currentTarget.dataset.index;
    app.globalData.buyGoods = this.data.myorder[index];
    wx.nextTick(function () {
      wx.navigateTo({
        url: '/pages/commit_order/commit_order',
      })
    })
  },

  /**
   *跳转详情 
   */
  info: function (e) {
    let index = e.currentTarget.dataset.index;
    app.globalData.buyGoods = this.data.myorder[index];
    wx.navigateTo({
      url: '/pages/orderInfo/orderInfo',
    })
  },

  /**
   * 待发货
   */
  toBeShipped: function (e) {
    let that = this;
    let mystatus = e.currentTarget.dataset.mystatus;
    Xstatus = mystatus;
    // 获取订单
    queryOrder(mystatus, that);
  },

  /**
   *待收货
   */
  toBeReceived: function (e) {
    let that = this;
    let mystatus = e.currentTarget.dataset.mystatus;
    Xstatus = mystatus;
    // 获取订单
    queryOrder(mystatus, that);
  },

  /**
   * 待评价
   */
  toBeEvaluated: function (e) {
    let that = this;
    let mystatus = e.currentTarget.dataset.mystatus;
    Xstatus = mystatus;
    // 获取订单
    queryOrder(mystatus, that);

  },

  /**
   *取消订单 
   *
   */
  cancel: function (e) {
    let that = this;
    util.myWxRequest(app.globalData.updateOrderStatus, { uuid: e.currentTarget.dataset.orderid, status: 7 }, function (res) {
      wx.showToast({
        title: '取消成功',
      })
      // 获取订单
      queryOrder(mystatus, that);
    });
  },
  /**
   * 自提
   */
  toBeSelf: function (e) {
    var that = this;
    that.setData({
      current_orderStatus: that.data.self_extraction
    });
  },

  /**
   * 查看物流
   */
  checkLogistics: function (e) {
    var orderId = e.currentTarget.dataset.orderid;
  },

  /**
   *删除订单 
   */
  del: function (e) {
    let that = this;
    util.myWxRequest(app.globalData.updateOrderStatus, { uuid: e.currentTarget.dataset.orderid, isUse: 0 }, function (res) {
      let mystatus = e.currentTarget.dataset.status;
      // 获取订单
      queryOrder(mystatus, that);
      wx.showToast({
        title: '删除成功',
      })

    });
  },

  /**
   * 提醒发货
   */
  reminderDelivery: function (e) {
    var orderId = e.currentTarget.dataset.orderid;
    // 提醒发货
    util.myWxRequest(app.globalData.updateRemind, { uuid: e.currentTarget.dataset.orderid }, function (res) {
    });
    // 发送web
    sendSocket();
    wx.showToast({
      icon: 'success',
      title: '成功提醒卖家',
    });
  },

  /**
   * 确认收货
   */
  confirmReceipt: function (e) {
    var orderId = e.currentTarget.dataset.orderid;
    let that = this;
    wx.showModal({
      title: '确认收货',
      content: '确认您已经收到货物',
      success: function (res) {
        if (res.confirm) {
          //确认收货 
          util.myWxRequest(app.globalData.updateOrderStatus, { uuid: orderId, status: 3 }, function (res) {
            wx.showToast({
              icon: 'success',
              title: '收货成功',
            });
            queryOrder(2, that)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  /**
   * 申请售后按钮
   */
  afterSaleBtn: function (e) {
    var that = this;
    // 获取索引
    let index = parseInt(e.currentTarget.dataset.index);
    let myorder = that.data.myorder;
    let uuid = e.currentTarget.dataset.orderid;
    console.log(uuid)
    wx.navigateTo({
      url: '/pages/after_sale/after_sale?uuid=' + uuid,
    })
  },

  /**
   * 评价按钮
   */
  insertCommentBtn: function (e) {
    var that = this;
    // 获取索引
    let index = e.currentTarget.dataset.index;
    let uuID = e.currentTarget.dataset.uuid;
    wx.navigateTo({
      url: '/pages/comment/comment?uuids=' + uuID,
    })
  },

  /**
   *滚动到底部触发事件 
   */
  scrollToLower: function () {
    let that = this;
    pageSize += 10;
    let mystatus = '';
    queryOrder(Xstatus, that);
  },

})

/**
 * 根据状态获取订单
 */
function queryOrder(mystatus, that) {
  mystatus = parseInt(mystatus)
  let mydata = null;
  switch (mystatus) {
    // 待付款
    case that.data.pending_payment:
      mydata = {
        page: page, pageSize: pageSize, userId: app.globalData.userId, status: that.data.pending_payment
      }
      break;
    // 待发货
    case that.data.to_be_shipped:
      mydata = {
        page: page, pageSize: pageSize, userId: app.globalData.userId, status: that.data.to_be_shipped
      }
      break;
    // 待收货
    case that.data.to_be_received:
      mydata = {
        page: page, pageSize: pageSize, userId: app.globalData.userId, status: that.data.to_be_received
      }
      break;
    // 待评价
    case that.data.to_be_evaluated:
      mydata = {
        page: page, pageSize: pageSize, userId: app.globalData.userId, status: that.data.to_be_evaluated
      }
      break;
    // 自提
    case that.data.self_extraction:
      mydata = {
        page: page, pageSize: pageSize, userId: app.globalData.userId, status: that.data.self_extraction
      }
      break;
    // 已完成
    case that.data.accomplish:
      mydata = {
        page: page, pageSize: pageSize, userId: app.globalData.userId, status: that.data.accomplish
      }
      break;
    // 默认为 全部
    default:
      mydata = {
        page: page, pageSize: pageSize, userId: app.globalData.userId, status: ''
      }
      break;
  }
  // 获取订单
  util.myWxRequest(app.globalData.getOrdersUrl, mydata, function (res) {
    // 获取订单
    let order = res.data.data.PageInfo.list;
    // for (let i = 0; i < order.length; i++) {
    //     let goods = order[i].orders;
    //     let len = goods.length;
    //     // var sumPrice = 0;
    //     for (let j = 0; j < len; j++) {
    //         order[i].status = goods[j].status;
    //         order[i].createTime = goods[j].createTime;
    //         // sumPrice += parseInt(goods[j].num) * parseFloat(goods[j].price);
    //         order[i].soldPrice = goods[j].soldPrice;
    //         order[i].uuid = goods[j].uuid;
    //         order[i].goodsnum = len;
    //     }
    //     // order[i].sumPrice = sumPrice;
    // }
    // console.log(order);
    that.setData({
      myorder: order,
      current_orderStatus: mystatus
    });
    // console.log(that.data.myorder)
  });

}
// 提醒发货
function sendSocket() {
  let now = util.formatDate(new Date().getTime());
  let userno = + app.globalData.userId;
  let mymessage = "时间" + now + '发送人' + userno;
  let socketOpen = false;
  let socketMsgQueue = [];
  let message = '1' + '|' + mymessage + '|' + 'PingTai';
  if (!util.isEmpty(message)) {
    socketMsgQueue.push(message);
  }
  wx.connectSocket({
    url: 'ws://www.zuoancellar.com/redwine/websocket/' + userno,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: "GET"
  })
  wx.onSocketOpen(function (res) {
    socketOpen = true
    for (var i = 0; i < socketMsgQueue.length; i++) {
      if (socketOpen) {
        // console.log(socketMsgQueue[i])
        wx.sendSocketMessage({
          data: socketMsgQueue[i]
        })
      } else {
        socketMsgQueue.push(socketMsgQueue[i])
      }
    }
    socketMsgQueue = []
  });

  wx.onSocketError(function (res) {
    socketOpen = false;
    // console.log('WebSocket连接打开失败，请检查！')
  });
}
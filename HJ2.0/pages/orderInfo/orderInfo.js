// pages/commit_order/commit_order.js
var util = require('../../utils/util.js');
const math = require('../../utils/calculate.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    commit_order: {},
    receipt: '',
    msg: '',
    payment: true,
    enterPaymentPassword: true,
    serverUrl: app.globalData.aliyunServerURL,
    ids: '',//地址id
    summoney: '',//总价
    px2rpxHeight: '',//手机比例
    px2rpxWidth: '',
    delivery: '',//邮费集合
    franking: '',//邮费价钱
    franks: '',//邮费价格
    addrCity: '',//地址城市
    ZFuuid: '',//订单ID
    gnames: '',//商品名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let goodsInfo = [];
    let commit_order = {};
    let prevUrl = util.getPrevPageUrl();
    if (prevUrl == 'pages/address/insert/insert') {
      let prevUrls = util.getLastPageUrl();//获取上俩也的参数            
    }
    // 通过商品详情传过来的
    if (prevUrl == 'pages/goods_detail/goods_detail' || prevUrl == 'pages/address/insert/insert') {
      let commit_order = app.globalData.buyGoods;
      that.setData({
        commit_order: commit_order,
        shows: 1,
        way: 0,
        dpay: 2,
      });

    } else if (prevUrl == 'pages/cart/cart' || prevUrl == 'pages/address/insert/insert') {
      // 通过购物车传过来的
      let buygoods = app.globalData.buyGoods;
      that.setData({
        commit_order: buygoods,
        shows: 1,
        way: 1,
        dpay: 2,
      });
    } else if (prevUrl == 'pages/myorder/myorder' || prevUrl == 'pages/address/insert/insert') {
      // 通过订单也传过来的
      let commit_order = app.globalData.buyGoods;
      that.setData({
        commit_order: commit_order,
        shows: 2,
        way: 0,
        dpay: 2,
      });
    }
    // 获取地址
    if (app.globalData.buyGoods.addressId) {
      // 通过地址id获取地址
      util.myWxRequest(app.globalData.getAddrByIdUrl, { id: app.globalData.buyGoods.addressId }, function (res) {
        that.setData({
          address: res.data.data,
          ids: res.data.data.id,
          addCity: res.data.addrCity
        });
      });
    } else {
      // 获取默认地址
      util.myWxRequest(app.globalData.getAddrByDefaultUrl, { user_id: app.globalData.userId }, function (res) {
        if (res.data.data.phone == '') {
          wx.showModal({
            title: '提示',
            content: '您还没有默认地址，请填写地址',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/address/add/add',
                })
              } else if (res.cancel) {

              }
            }
          })

          return false;
        }
        that.setData({
          address: res.data.data,
          ids: res.data.data.id,
          addCity: res.data.addrCity
        });

      });
    }
  },

  /**
   *订单直接支付接口 
   */
  payOrder: function () {
    app.globalData.buyGoods = '';
    let orders = this.data.commit_order.orders;
    let that = this;
    let len = orders.length;
    let gnames = '';
    let uuid = '';
    for (let r = 0; r < len; r++) {
      gnames += orders[r].goodsName + ',';
      uuid += orders[r].uuid + ',';
    }
    uuid = uuid.slice(0, uuid.lastIndexOf(','));
    gnames = gnames.slice(0, gnames.lastIndexOf(','));
    // 微信支付
    let mydata = {
      body: gnames,
      uuid: that.data.commit_order.order_uuid,
      money: that.data.summoney,
      openid: app.globalData.weChat,
    }
    // 微信支付
    util.myWxRequest(app.globalData.wxPayUrl, mydata, function (res) {
      // 微信支付，调用接口拿取返回的参数，进行支付
      wx.requestPayment({
        'timeStamp': res.data.data.timeStamp,
        'nonceStr': res.data.data.nonceStr,
        'package': res.data.data.package,
        'signType': 'MD5',
        'paySign': res.data.data.paySign,
        'success': function (res) {
          // 支付成功通知商家
          let now = util.formatDate(new Date().getTime());
          let userno = + app.globalData.userId;
          sendSocket(("时间：" + now + ' 发送人：'), userno);
          wx.navigateTo({
            url: '/pages/pay_success/pay_success'
          })
        },
        'fail': function (res) {
        }
      });
    })


    this.setData({
      dpay: 2,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    if (that.data.commit_order.orders) {
      that.setData({
        franking: that.data.commit_order.postageNum,
        summoney: that.data.commit_order.money
      })
    } else {
      frank(that);
    }

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
   * 选择地址
   */
  selectAddress: function () {
    wx.navigateTo({
      url: '/pages/address/insert/insert?userId=' + app.globalData.userId
    })
  },

  /**
   * 发票信息
   */
  receiptInfo: function (e) {
    this.setData({
      receipt: e.detail.value,
    });
  },


  /**
   * 发票信息
   */
  switch2: function (e) {
    if (e.detail.value == true) {
      this.setData({
        bill: true,
        is_invoice: 1
      })
    } else {
      this.setData({
        bill: false,
        is_invoice: 0
      })
    }
  },

  // 发票类型 types
  types: function (e) {
    this.setData({
      types: e.detail.value
    })
  },

  // 发票抬头
  heads: function (e) {
    this.setData({
      head: e.detail.value,
    })

    if (e.detail.value == 2) {
      this.setData({
        shops: true
      })
    } else {
      this.setData({
        shops: false
      })
    }
  },

  // 商品明细
  details: function (e) {
    this.setData({
      detail: e.detail.value
    })
  },

  // 手机号
  mobile: function (e) {
    let phones = e.detail.value;
    if (!util.checkReg(1, phones)) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none'
      })
      return false;
    }
    this.setData({
      mobile: e.detail.value
    })
  },

  //邮箱
  email: function (e) {
    let mails = e.detail.value;
    if (!util.checkReg(6, mails)) {
      wx.showToast({
        title: '邮箱信息有误',
        icon: 'none'
      })
      return false;
    }
    this.setData({
      mailbox: e.detail.value
    })
  },

  //单位名称
  units: function (e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '单位名称不能为空',
        icon: 'none'
      })
      return false;
    }
    this.setData({
      unit: e.detail.value
    })
  },

  // 纳税人号码
  payer: function (e) {
    let payers = e.detail.value;
    if (!util.checkReg(7, payers)) {
      wx.showToast({
        title: '输入有误',
        icon: 'none'
      })
      return false;
    }
    this.setData({
      numbers: e.detail.value
    })
  },

  /**
   * 备注
   */
  msg: function (e) {
    this.setData({
      msg: e.detail.value
    });
  },
  /**
   * 提交订单
   */
  commitOrder: function () {
    var that = this;
    // 添加是否需要发票
    let mydatas = {};
    if (that.data.is_invoice == 1) {
      mydatas = {
        userId: app.globalData.userId,
        addrId: that.data.address.id,
        carriage: that.data.franking,
        is_invoice: 1,
        types: that.data.types,
        head: that.data.head,
        unit: that.data.unit,
        numbers: that.data.numbers,
        mobile: that.data.mobile,
        mailbox: that.data.mailbox,
        detail: that.data.detail,
        orderUUId: that.data.ZFuuid
      }
    } else {
      mydatas = {
        userId: app.globalData.userId,
        addrId: that.data.address.id,
        carriage: that.data.franking,
        is_invoice: 0,
        orderUUId: that.data.ZFuuid
      }
    }
    util.myWxRequest(app.globalData.addInvoiceUrl, mydatas, function (res) {
    })

    // 微信支付
    let mydata = {
      body: that.data.gnames,
      uuid: that.data.ZFuuid,
      money: that.data.summoney,
      openid: app.globalData.weChat
    }
    util.myWxRequest(app.globalData.wxPayUrl, mydata, function (res) {
      // 微信支付，调用接口拿取返回的参数，进行支付
      wx.requestPayment({
        'timeStamp': res.data.data.timeStamp,
        'nonceStr': res.data.data.nonceStr,
        'package': res.data.data.package,
        'signType': 'MD5',
        'paySign': res.data.data.paySign,
        'success': function (res) {
          app.globalData.buyGoods = '';
          // 支付成功通知商家
          let now = util.formatDate(new Date().getTime());
          let userno = app.globalData.userId;
          sendSocket(("时间：" + now + ' 发送人：'), userno);
          wx.navigateTo({
            url: '/pages/pay_success/pay_success'
          })
        },
        'fail': function (res) {
        }
      });
    })
  },
})

/**
 *直接购买+购物车 
 */
function frank(that) {
  let orders = that.data.commit_order;
  console.log(orders)
  let adds = that.data.address;
  let data = '';
  let num = '';
  let goodsId = '';
  let addrId = '';
  let goodTotal = '';//商品价格，没邮费
  let youfei = '';  // 邮费
  let activityId = '';//折扣ID
  let addrCity = that.data.addrCity;//地址城市
  let gnames = '';//每个商品的商品名
  /**
   *  直接购买商品
   */
  if (orders.away) {
    num += orders.goodsInfo[0].num;
    goodsId += orders.goodsInfo[0].gid;
    addrId += orders.addressId + ',';
    let unitPrice = orders.goodsInfo[0].unitPrice;//商品单个价
    //储存商品名
    that.setData({
      gnames: orders.goodsInfo[0].name
    })
    // 判断是否存在地址城市
    if (util.isEmpty(addrCity)) {
      addrCity = orders.addrCity;
    }
    // 判断是否有折扣ID
    if (orders.goodsInfo[0].discountId) {
      activityId = orders.goodsInfo[0].discountId;
    } else {
      activityId = -1;
    }
    //判断完成 
    // 添加订单，获取直接购买商品总价格
    util.myWxRequest(app.globalData.addOrder, { type: 0, activityId: activityId, num: num, goodsId: goodsId, price: unitPrice, userId: app.globalData.userId }, function (res) {
      goodTotal = res.data.data.moneys;
      let uuid = res.data.data.orderUUId;
      // 储存支付ID
      that.setData({
        ZFuuid: uuid
      })
      //根据地址来计算邮费
      util.myWxRequest(app.globalData.carriageUrl, { num: num, addrCity: addrCity, goodsId: goodsId, uuid: uuid }, function (res) {
        // 计算总邮费
        let postage = res.data.data.postage;
        // 计算总价钱
        let nummomey = orders.soldPrice;
        let summoney = math.calcAdd(nummomey, postage)
        that.setData({
          franking: postage,
          summoney: summoney,
          delivery: res.data.data
        })
      });
    });
  } else if (orders.orderUUId) {
    /**
     *订单代付款走来的 
     */
    let len = orders.goods.length;
    // 根据id获取收货地址
    util.myWxRequest(app.globalData.getAddrByDefaultUrl, { user_id: app.globalData.userId }, function (res) {
      let ress = res.data.data;
      let addrCity = '';
      if (app.globalData.buyGoods.addrCity) {
        addrCity = app.globalData.buyGoods.addrCity;
      } else {
        addrCity = res.data.data.addrCity
      }
      addrId = ress.id;
      // 购物车需要传的参数
      for (let i = 0; i < len; i++) {
        num += orders.goods[i].num + ',';
        goodsId += orders.goods[i].goodsId + ',';
        gnames += orders.goods[i].goodsName + ',';
      }
      // 获取总价钱
      let cartMony = orders.moneys;
      let uuid = orders.orderUUId;
      // 储存支付ID
      that.setData({
        ZFuuid: uuid
      })
      //计算邮费
      util.myWxRequest(app.globalData.carriageUrl, { num: num, addrCity: addrCity, goodsId: goodsId, uuid: uuid }, function (res) {
        // 计算邮费总价格，获取传来的参数
        let delivery = res.data.data;
        let len = delivery.length;
        // 总邮费
        let youfei = res.data.data.postage;
        // 计算总邮费
        let nummomey = cartMony;
        let summoney = math.calcAdd(nummomey, youfei)
        that.setData({
          franking: youfei,
          summoney: summoney
        })
        that.setData({
          delivery: res.data.data,
        });
      });
    });
  } else {
    /**
     *购物车来的商品 
     */
    let len = '';
    let carts = '';//购物车ID
    let cartMony = '';//购物车总价钱
    let gnames = '';//商品名
    if (orders.goodsInfo) {
      len = orders.goodsInfo.length;
    }
    // 根据id获取收货地址
    util.myWxRequest(app.globalData.getAddrByDefaultUrl, { user_id: app.globalData.userId }, function (res) {
      let ress = res.data.data;
      let addrCity = '';
      if (app.globalData.buyGoods.addrCity) {
        addrCity = app.globalData.buyGoods.addrCity;
      } else {
        addrCity = res.data.data.addrCity
      }
      addrId = ress.id;
      // 购物车需要传的参数
      for (let q = 0; q < len; q++) {
        if (orders.goodsInfo) {
          num += orders.goodsInfo[q].num + ',';
          goodsId += orders.goodsInfo[q].gid + ',';
          // goodTotal += orders.goodsInfo[q].sumPrice;
          carts += orders.goodsInfo[q].cartsId + ',';
          gnames += orders.goodsInfo[q].name + ',';
        } else {
          num += orders.orders[q].num + ',';
          goodsId += orders.orders[q].goodsId + ',';
          goodTotal += orders.orders[q].cartsPrice + ',';
        }
      }
      // 获取总价钱
      util.myWxRequest(app.globalData.addOrder, { type: 1, cartsId: carts }, function (res) {
        cartMony = res.data.data.moneys;
        let uuid = res.data.data.orderUUId
        // 储存支付ID
        that.setData({
          ZFuuid: uuid
        })
        //计算邮费
        util.myWxRequest(app.globalData.carriageUrl, { num: num, addrCity: addrCity, goodsId: goodsId, uuid: uuid }, function (res) {
          // 计算邮费总价格，获取传来的参数
          let delivery = res.data.data;
          let len = delivery.length;
          // 总邮费
          let youfei = res.data.data.postage;
          // 计算总邮费
          let nummomey = cartMony;
          let summoney = math.calcAdd(nummomey, youfei)
          that.setData({
            franking: youfei,
            summoney: summoney
          })
          that.setData({
            delivery: res.data.data,
          });
        });
      })
    });
  }
}

/**
 * WebSocket-发送
 */
function sendSocket(mymessage, userno) {
  let socketOpen = false;
  let socketMsgQueue = [];
  let message = mymessage + '|' + 'PingTai';
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
    console.log('WebSocket连接打开失败，请检查！')
  });
}
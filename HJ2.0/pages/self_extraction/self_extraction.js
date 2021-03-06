// pages/commit_order/commit_order.js
var utils = require('../../utils/util.js');
const app = getApp();
var num = '';//商品数量
var goodsId = '';//商品ID
var name = '';//买的商品
var addrCity = '';//城市
var franking = '';//邮费
var ZFuuid = '';//订单Id
var addIds = '';//地址ID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {
    },
    order: null,
    receipt: '',
    msg: '',
    serverUrl: app.globalData.aliyunServerURL,
    px2rpxHeight: '',//比例
    px2rpxWidth: '',
    frank: '',//邮费
    depotId: '',
    num:'',//商品数量
    Xuuid:'',//小订单号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      goods_num: options.goods_num
    })
    let that = this;
    let buy = app.globalData.buyGoods;
    console.log(app.globalData.buyGoods);
    // 邮费所需的条件
    num = buy.goodsInfo[0].amount;
    goodsId = buy.goodsInfo[0].gid;
    name = buy.goodsInfo[0].name;
    // 获取订单信息
    that.setData({
      order: app.globalData.buyGoods
    });
    // 地址信息
    utils.myWxRequest(app.globalData.getAddrByIdUrl, { id: app.globalData.buyGoods.addressId }, function (res) {
      that.setData({
        address: res.data.data
      });
      // console.log(res.data.data)
      addIds = res.data.data.id;

      addrCity = res.data.data.addrCity;
      console.log(addrCity)
      console.log(addIds)
      that.youfei();
    });

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
        // console.log(res)
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
   * 备注
   */
  msg: function (e) {
    this.setData({
      msg: e.detail.value
    });
  },
  /**
   * 支付
   */
  commitOrder: function () {
    // 添加邮费发票
    let goods = this.data.order;
    let mydatas = {
      userId: app.globalData.userId,
      addrId: addIds,
      carriage: franking,
      is_invoice: 0,
      orderUUId: this.data.Xuuid,
      goodsId: goods.goodsInfo[0].gid,
      depotId: this.data.depotId,
      num:this.data.num
    }
    console.log(goods.goodsInfo[0].gid)
    utils.myWxRequest(app.globalData.addInvoiceUrl, mydatas, function (res) {
    })


    // 测试支付
    utils.myWxRequest(app.globalData.huidiao, { out_trade_no: ZFuuid }, function (res) {
    })
    wx.navigateTo({
      url: '/pages/pay_success/pay_success'
    })

    // 微信支付
    // let mydata = {
    //   body: name,
    //   uuid: ZFuuid,
    //   money: franking,
    //   openid: app.globalData.weChat
    // }
    // utils.myWxRequest(app.globalData.wxPayUrl, mydata, function (res) {
    //   // 微信支付，调用接口拿取返回的参数，进行支付
    //   wx.requestPayment({
    //     'timeStamp': res.data.data.timeStamp,
    //     'nonceStr': res.data.data.nonceStr,
    //     'package': res.data.data.package,
    //     'signType': 'MD5',
    //     'paySign': res.data.data.paySign,
    //     'success': function (res) {
    //       app.globalData.buyGoods = '';
    //       wx.navigateTo({
    //         url: '/pages/pay_success/pay_success'
    //       })
    //     },
    //     'fail': function (res) {
    //     }
    //   });
    // })
  },

  /**
   *获取邮费 
   */
  youfei: function () {
    var that = this;
    let commit_order = that.data.order;
    console.log(commit_order);
    let goodsInfo = commit_order.goodsInfo[0];
    console.log(that.data.address);
    let gid = goodsInfo.gid;  // 商品id
    let amount = goodsInfo.amount;  // 商品数量
    let price = goodsInfo.price; // 商品价格
    let mystatus = 0;  // 没有购物车编号
    let dealerCode = commit_order.dealerCode;//经销商编码
    let mydata = { goodsId: gid, num: amount, userId: app.globalData.userId, soldPrice: commit_order.soldPrice, status: mystatus, price: price, addrId: addIds, dealerCode: dealerCode }
    // console.log(mydata)
    utils.myWxRequest(app.globalData.insertOwnOrderUrl, mydata, function (res) {
      console.log(res)
      ZFuuid = res.data.data;//订单Id
      // 小订单需要的参数
      let Xnum = "";
      let Uuid = "";
      let Ggid = "";
      utils.myWxRequest(app.globalData.getOrdersUUIDByPayUUID, { orderUUId: ZFuuid }, function (res) {
        console.log(res)
        let Xdata = res.data.data;
        let len = Xdata.length;
        for (let y = 0; y < len; y++) {
          Ggid += Xdata[y].goodsId + ',';
          Xnum += Xdata[y].num + ',';
          Uuid += Xdata[y].uuid + ',';
        }
        that.setData({
          Xuuid: Xdata[0].uuid
        })
        //根据地址来计算邮费
        utils.myWxRequest(app.globalData.carriageUrl, { num: Xnum, addrCity: addrCity, goodsId: Ggid, uuid: Uuid }, function (res) {
          console.log(res)
          franking = res.data.data.postage;//邮费
          that.setData({
            frank: franking,
            depotId: res.data.data.sendAddr[0].depotId,
            num: res.data.data.sendAddr[0].num
          })
        });

      });
    })
  }
})
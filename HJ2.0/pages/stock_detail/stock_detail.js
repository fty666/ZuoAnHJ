const utils = require('../../utils/util.js');
const app = getApp();
var repurchaseReason_index = 0;  // 回购原因的索引
var lastNum = '';//回购数量
var price = '';//回购价格
var recordId = '';//回购ID
var selectHG = '';//选择回购的id
var Times = '';//回购传的参数
var huiName = 1;//显示回购的数量
var addNum = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {},
    commentInfo: null,
    goods_num: 1,
    repurchaseReason: [
    ],
    covering_layer_hidden: true,
    immediate_sale_hidden: true,
    serverUrl: app.globalData.aliyunServerURL,
    gid: '',//商品id
    stock: '',//商品总库存量
    putaway: '',//可上架数量
    noWsell: '',//正在销售中数量
    px2rpxHeight: '',//比例
    px2rpxWidth: '',
    soldOut: '',//回购参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商品id
    let gid = options.gid;
    let dealerCode = options.dealerCode;
    console.log(options)
    this.setData({
      gid: gid,
      dealerCode: dealerCode
    })
    // 获取商品详情
    let that = this;

    // 获取商品信息
    utils.myWxRequest(app.globalData.getGoodsDetailByStockUrl, { id: gid, userId: app.globalData.userId }, function (res) {
      let goodsInfo = res.data.data;
      let commentInfo = goodsInfo.comment;
      for (let i = 0; i < commentInfo.length; i++) {
        commentInfo[i].img = commentInfo[i].img.split(',');
      }
      that.setData({
        goodsInfo: goodsInfo,
        commentInfo: commentInfo
      });
    });

    // 获取默认地址
    utils.myWxRequest(app.globalData.getAddrByDefaultUrl, { user_id: app.globalData.userId }, function (res) {
      that.setData({
        address: res.data.data
      });
    });

    // 获取正在销售中的数量
    utils.myWxRequest(app.globalData.getDealerNum, { goodsId: gid, dealerCode: dealerCode }, function (res) {
      that.setData({
        noWsell: res.data.data.num
      })
    });

    // 获取自己可以上架的数量
    utils.myWxRequest(app.globalData.getDealerShock, { goodsId: gid, dealerCode: dealerCode }, function (res) {
      that.setData({
        putaway: res.data.data.dealer_stock
      })
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

  // 增加数量
  addCount: function (e) {
    let num = parseInt(this.data.goods_num);
    console.log(num)
    num = num + 1;
    this.setData({
      goods_num: num
    });

  },
  // 减少数量
  minusCount: function (e) {
    let num = parseInt(this.data.goods_num);
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    this.setData({
      goods_num: num
    });
  },
  /**
   * 修改商品数量
   */
  inputNum: function (e) {
    var that = this;
    // if (e.detail.value == '') {
    //   that.setData({
    //     goods_num: 1
    //   });
    // } else {
    that.setData({
      goods_num: e.detail.value
    });
    // }
  },
  blurNum: function (e) {
    var that = this;
    that.setData({
      goods_num: e.detail.value
    });
  },

  /**
  * 查看全部评论
  */
  viewAllComment: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/all_comment/all_comment?goodsId=' + that.data.goodsInfo.id
    });
  },
  /**
   *选择回购 
   */
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    let soldOut = this.data.soldOut;
    let lens = soldOut.length;
    selectHG = e.detail.value;
    let len = selectHG.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < lens; j++) {
        soldOut[selectHG[i]].checked = true;
      }
    }
    this.setData({
      soldOut: soldOut
    })
  },

  /**
   * 申请回购
   */
  application_for_repurchase: function (e) {
    this.setData({
      covering_layer_hidden: false
    });
    // 查询回购信息
    let that = this;
    let data = {
      dealerCode: that.data.dealerCode,
      goodsId: that.data.gid,
    }
    utils.myWxRequest(app.globalData.getBuybackNumPriceListUrl, data, function (res) {
      let ress = res.data.data;
      let len = ress.length;

      for (let i = 0; i < len; i++) {
        ress[i].checked = false;
        Times += ress[i].lastTime + ',';
        ress[i].huiTime = ress[i].lastTime;
        ress[i].lastTime = ress[i].lastTime.slice(0, 10);
        ress[i].Num = ress[i].lastNum;
        ress[i].lastNum = parseInt(ress[i].lastNum);
      }
      console.log(ress)
      that.setData({
        soldOut: ress
      })
    });
  },

  /**
   *增加回购 
   */
  addHui: function (e) {
    let id = parseInt(e.currentTarget.dataset.index);
    let soldOut = this.data.soldOut;
    let num = parseInt(soldOut[id].Num);
    console.log(num)
    addNum = addNum + 1;
    console.log(addNum)
    if (addNum > num) {
      addNum = num;
    }
    console.log(addNum)
    soldOut[id].lastNum = addNum;
    if (soldOut.checked == true) {
      lastNum += addNum + ',';
    }
    console.log(soldOut)
    this.setData({
      soldOut: soldOut
    });
  },

  /**
   *减少回购 
   */
  jianHui: function (e) {
    let id = parseInt(e.currentTarget.dataset.index);
    let soldOut = this.data.soldOut;
    let num = parseInt(soldOut[id].lastNum);
    let addNum = 0;
    addNum = num - 1;
    if (addNum < 1) {
      addNum = 1;
    }
    soldOut[id].lastNum = addNum;
    if (soldOut.checked == true) {
      lastNum += addNum + ',';
    }
    this.setData({
      soldOut: soldOut
    });
  },

  huiNum: function (e) {
    // let maxNum = e.currentTarget.dataset.maxnum;
    // let index =parseInt(e.currentTarget.dataset.index);
    // let inputNum = parseInt(e.detail.value);
    // let soldOut = this.data.soldOut;
    // let that = this;
    // if (inputNum > maxNum) {
    //   inputNum = maxNum;
    // } else if (inputNum < 1){
    //   inputNum = 1;
    // }
    // if ( !(/^\d$/.test(inputNum)) ){
    //   inputNum = 1;
    // }
    // soldOut[index].lastNum = inputNum;    
    // return inputNum;
    // that.setData({
    //   soldOut: soldOut
    // })
  },

  blurHuiNum: function (e) {
    let maxNum = e.currentTarget.dataset.maxnum;
    let index = parseInt(e.currentTarget.dataset.index);
    let inputNum = parseInt(e.detail.value);
    let soldOut = this.data.soldOut;
    let that = this;
    if (inputNum > maxNum) {
      inputNum = maxNum;
    } else if (inputNum < 1) {
      inputNum = 1;
    }
    if (!(/^\d$/.test(inputNum))) {
      inputNum = 1;
    }
    soldOut[index].lastNum = inputNum;
    return inputNum;
    that.setData({
      soldOut: soldOut
    })
  },

  /**
   * 选择回购原因
   */
  radio_change: function (e) {
    // 获取回购原因的索引
    repurchaseReason_index = e.detail.value;
  },

  /**
   * 确认回购
   */
  formSubmit: function (e) {
    let that = this;
    let soldOut = this.data.soldOut;
    let dealerCode = '';
    let goodsId = this.data.gid;
    let lastNum = '';
    let price = '';
    let recordId = '';
    let lastTime = '';
    console.log(soldOut)
    let len = soldOut.length;
    for (let i = 0; i < len; i++) {
      if (soldOut[i].checked) {
        dealerCode = soldOut[i].dealerCode;
        lastNum += soldOut[i].lastNum + ',';
        price += soldOut[i].price + ',';
        recordId += soldOut[i].id + ',';
        lastTime += soldOut[i].huiTime + ',';
      }
    }
    // 提交
    let datas = {
      dealerCode: dealerCode,
      goodsId: goodsId,
      lastNum: lastNum,
      price: price,
      recordId: recordId,
      lastTime: lastTime
    }
    Times = "";
    utils.myWxRequest(app.globalData.addBuyBack, datas, function (res) {
      that.setData({
        covering_layer_hidden: true
      });
      wx.showToast({
        title: '申请售后成功',
      })
    });
  },

  /**
   * 取消回购
   */
  cancel_repurchase: function () {
    this.setData({
      covering_layer_hidden: true
    });
  },

  /**
   * 自提按钮
   */
  self_extraction: function (e) {
    let imgs = e.currentTarget.dataset.imgs
    let amount = this.data.goods_num;//自提的数量
    let noWsell = this.data.noWsell;//比较自提的正在出售中的
    if (amount > noWsell) {
      wx.showToast({
        title: '自提的数量过多，先上架在自提',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let mygoodsInfo = {};
    mygoodsInfo.gid = this.data.goodsInfo.id;  // 商品id
    mygoodsInfo.name = this.data.goodsInfo.gname;  // 商品名称
    mygoodsInfo.amount = amount; // 商品数量
    mygoodsInfo.price = this.data.goodsInfo.price; // 商品价格
    mygoodsInfo.img = imgs;  // 商品图片
    let addrId = this.data.address.id;
    let mysoldPrice = this.data.goodsInfo.price * amount;  // 商品总价
    let dealerCode = this.data.dealerCode;//经销商编码
    mygoodsInfo = [mygoodsInfo];
    app.globalData.buyGoods = { goodsInfo: mygoodsInfo, soldPrice: mysoldPrice, addressId: addrId, dealerCode: dealerCode };
    wx.navigateTo({
      // url: '/pages/commit_order/commit_order?goodsId='+goodsId+'&num='+num+'&totalPrice='+totalPrice,
      url: '/pages/self_extraction/self_extraction?goods_num=' + this.data.goods_num
    })
  },

  /**
   *修改地址 
   */
  address: function () {
    wx.navigateTo({
      url: '/pages/address/insert/insert',
    })
  },

  /**
   * 立即出售按钮
   */
  immediate_sales: function () {
    this.setData({
      immediate_sale_hidden: false
    });
  },
  cancel_sale: function () {
    this.setData({
      immediate_sale_hidden: true
    });
  },

  /**
   * 确认出售
   */
  confirmation_of_sale: function (e) {
    let that = this;
    let goods_num = parseInt(that.data.goods_num);
    let putaway = parseInt(that.data.putaway);
    //判断上架数量是否充足
    if (putaway < goods_num) {
      wx.showToast({
        title: '可上架数量不足',
        icon: 'none'
      })
      return false;
    }
    let dealerCode = that.data.dealerCode;
    let goods_id = that.data.gid;
    let data = {
      goodsId: goods_id,
      num: goods_num,
      dealerCode: dealerCode
    }
    utils.myWxRequest(app.globalData.insertDealerStockUrl, data, function () {
      wx.showToast({
        title: '出售成功',
        icon: 'success',
      });
      that.setData({
        immediate_sale_hidden: true,
        goods_num: 1
      })


      // 获取正在销售中的数量
      utils.myWxRequest(app.globalData.getDealerNum, { goodsId: that.data.gid, dealerCode: that.data.dealerCode }, function (res) {
        that.setData({
          noWsell: res.data.data.num
        })
      });

      // 获取自己可以上架的数量
      utils.myWxRequest(app.globalData.getDealerShock, { goodsId: that.data.gid, dealerCode: that.data.dealerCode }, function (res) {
        that.setData({
          putaway: res.data.data.dealer_stock
        })
      });


    })

    //   重新获取数据
    let gid = that.data.gid;
    utils.myWxRequest(app.globalData.getGoodsDetailByStockUrl, { id: gid, userId: app.globalData.userId }, function (res) {
      let goodsInfo = res.data.data;
      let commentInfo = goodsInfo.comment;
      commentInfo.slice(0, 2);
      for (let i = 0; i < commentInfo.length; i++) {
        commentInfo[i].img = commentInfo[i].img.split(',');
      }
      that.setData({
        goodsInfo: goodsInfo,
        commentInfo: commentInfo
      });
    });

  }

})
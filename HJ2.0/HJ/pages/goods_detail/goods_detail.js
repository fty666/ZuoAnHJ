// pages/goods_detail/goods_detail.js
var util = require('../../utils/util.js');
var math = require('../../utils/calculate.js');
const app = getApp();
// const myuserId = app.globalData.userId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {},
    goods_num: 1,
    goods_price: 0,
    commentInfo: [],
    address: {},
    youLike: [],
    changePrice: false,
    serverUrl: app.globalData.aliyunServerURL,
    myuserId: app.globalData.userId,
    px2rpxWidth: '',
    px2rpxHeight: '',
    id: '',
    jion: '',//判断收藏按钮
    addrCity: '',//地址城市
    show: 1,//是否收藏
    px2rpxHeight: '',//手机尺寸
    px2rpxWidth: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
    })
    if (options.addrId) {
      this.setData({
        addrId: options.addrId,
        goods_num: 1,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.globalData.shopId = '';
    let that = this;
    let id = that.data.id;
    let addrId = that.data.addrId;
    let goods_id = '';
    // 获取商品信息
    util.myWxRequest(app.globalData.getGoodsDetailUrl, { id: id, userId: app.globalData.userId }, function (res) {
      console.log(res)
      let goodsInfo = res.data.data;
      let commentInfo = res.data.data.comment;
      let len = res.data.data.comment.length;
      if (len > 2) {
        commentInfo = commentInfo.slice(0, 2);
      }
      for (let i = 0; i < commentInfo.length; i++) {
        commentInfo[i].img = commentInfo[i].img.split(',');
      }
      that.setData({
        goodsInfo: res.data.data,
        commentInfo: commentInfo,
        goods_price: res.data.data.price
      });
      // 猜你喜欢
      let data = {
        classify: that.data.goodsInfo.classify,
        place: '',
        taste: '',
        variety: '',
        character: '',
        page: 1,
        pageSize: 3,
        price: '',
        capacity: '',
        name: '',
        condition: ''
      }
      util.myWxRequest(app.globalData.getGoodsUrl, data, function (res) {
        that.setData({
          youLike: res.data.data.PageInfo.list
        });
      });
    });

    // 获取商品总库存量
    if (addrId) {
      // 换地址 getAddrByIdUrl
      util.myWxRequest(app.globalData.getAddrByIdUrl, { id: addrId }, function (res) {
        that.setData({
          address: res.data.data,
          addrCity: res.data.data.addrCity
        });
      });
    } else {
      // 获取用户的默认地址
      util.myWxRequest(app.globalData.getAddrByDefaultUrl, { user_id: app.globalData.userId }, function (res) {
        that.setData({
          address: res.data.data,
          addrCity: res.data.data.addrCity
        });
      });
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

  // 增加数量
  addCount: function (e) {
    let that = this;
    let num = parseInt(this.data.goods_num);
    num = num + 1;
    this.setData({
      goods_num: num
    });
    // 经销商购买商品达到一定数量,单价优惠
    let status = that.data.goodsInfo.status;
    if (status == 1) {
      judgeGoodsNum(status, num, that);
    }
  },
  // 减少数量
  minusCount: function (e) {
    let that = this;
    let num = parseInt(this.data.goods_num);
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    this.setData({
      goods_num: num
    });
    // 经销商购买商品达到一定数量,单价优惠
    let status = that.data.goodsInfo.status;
    if (status == 1) {
      judgeGoodsNum(status, num, that);
    }
  },

  /**
   * 修改商品数量
   */
  inputNum: function (e) {
    let that = this;
    that.setData({
      goods_num: e.detail.value
    });
    // }
    let num = that.data.goods_num;
    // 经销商购买商品达到一定数量,单价优惠
    let status = that.data.goodsInfo.status;
    if (status == 1) {
      judgeGoodsNum(status, num, that);
    }

  },
  blurNum: function (e) {
    let that = this;
    let num = e.detail.value;

    if (/^[1-9]+[0-9]*]*$/.test(num)) {
      that.setData({
        goods_num: num
      });
    } else {
      that.setData({
        goods_num: 1
      });
    }
    // 经销商购买商品达到一定数量,单价优惠
    let status = that.data.goodsInfo.status;
    if (status == 1) {
      judgeGoodsNum(status, num, that);
    }
  },


  /**
   * 猜你喜欢
   */
  clickToGoodsDetail: function (e) {
    let that = this;
    let goodsId = e.currentTarget.dataset.id;
    // 获取点击商品详情
    util.myWxRequest(app.globalData.getGoodsDetailUrl, { userId: app.globalData.userId, id: goodsId }, function (res) {
      let goodsInfo = res.data.data;
      let commentInfo = goodsInfo.comment;
      for (let i = 0; i < commentInfo.length; i++) {
        commentInfo[i].img = commentInfo[i].img.split(',');
      }
      that.setData({
        goodsInfo: goodsInfo,
        commentInfo: commentInfo
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 100
      });
    });

  },

  /**
   * 添加到购物车
   */
  addToCart: function (e) {
    var that = this;
    console.log(e)
    let mygoodsId = e.currentTarget.dataset.id;
    // 折扣满减ID
    let activityId = e.currentTarget.dataset.activityid;
    let myuserId = app.globalData.userId;
    let mynum = that.data.goods_num;
    let status = that.data.goodsInfo.status;
    // if (mynum == 1 || status == 1) {
    //     judgeGoodsNum(status, mynum, that);
    // }
    let goods_price = that.data.goods_price;
    // 购买总价
    let mycartsPrice = math.calcMul(goods_price, mynum)
    //判断是否满减
    // let goodsInfo = that.data.goodsInfo;
    // if (goodsInfo.full) {
    //     if (mycartsPrice > goodsInfo.full) {
    //         mycartsPrice = math.calcReduce(mycartsPrice, goodsInfo.reductionPrice) // 商品总价
    //     }
    // }
    // 调用 加入购物车 全局方法
    util.addToCartFun(mygoodsId, myuserId, mynum, mycartsPrice, activityId);
  },

  /**
   * 加入收藏
   */
  joinTheCollection: function (e) {
    var that = this;
    let goodsId = that.data.goodsInfo.id;
    let id = e.currentTarget.dataset.goodsid;
    if (goodsId == id) {
      if (that.data.jion == '') {
        util.myWxRequest(app.globalData.insertCollectionUrl, { identify: id, userId: app.globalData.userId, mytype: 1 }, function (res) {
          that.setData({
            jion: 'show'
          })
          wx.showToast({
            icon: 'success',
            title: '收藏成功'
          });
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '已经收藏了'
        });
      }

    } else {
      wx.showToast({
        icon: 'none',
        title: '已经收藏了'
      });
    }
  },

  /**
   * 查看全部评论
   */
  viewAllComment: function () {
    var that = this;
    wx: wx.navigateTo({
      url: '/pages/all_comment/all_comment?goodsId=' + that.data.goodsInfo.id
    });
  },

  /**
  * 立即购买
  */
  immediatePurchase: function () {
    app.globalData.shopId = this.data.id;
    let mynum = this.data.goods_num;
    let status = this.data.goodsInfo.status;
    let mygoodsInfo = {};
    let goodsInfo = this.data.goodsInfo;
    let soldPrice = 0;
    //判断购买数量是否满足经销商
    if (mynum >= 1) {
      judgeGoodsNum(status, mynum, this);
      mygoodsInfo.price = this.data.goodsInfo.price; // 商品价格
      // 判断折扣
      let discount = 0;
      if (goodsInfo.discount) {
        discount = parseInt(goodsInfo.discount) * 0.1;

        // mygoodsInfo.price = math.calcMul(this.data.goods_price, mynum);
        mygoodsInfo.price = math.calcMul(this.data.goods_price, discount);
      }
      // soldPrice = math.calcMul(this.data.goods_price, mynum) // 商品总价
      soldPrice = math.calcMul(mygoodsInfo.price, mynum) // 商品总价
    }
    //判断是否满减
    if (goodsInfo.full) {
      if (soldPrice > goodsInfo.full) {
        soldPrice = math.calcReduce(soldPrice, goodsInfo.reductionPrice) // 商品总价
      }
    }
    // goods.num >= goods.goods.dealerTerm && goods.status == 1
    mygoodsInfo.gid = this.data.goodsInfo.id;  // 商品id
    mygoodsInfo.name = this.data.goodsInfo.gname;  // 商品名称
    mygoodsInfo.num = mynum; // 商品数量
    mygoodsInfo.dealerTerm = this.data.goodsInfo.dealerTerm; //经销商达到购买数量
    mygoodsInfo.dealerPrice = this.data.goodsInfo.dealerPrice; //经销商价格
    mygoodsInfo.status = this.data.goodsInfo.status; //经销商价格
    mygoodsInfo.soldPrice = soldPrice; //商品总价
    mygoodsInfo.isDealer = this.data.goodsInfo.is_dealer; //是否是经销商
    mygoodsInfo.img = this.data.goodsInfo.ListPicture.img;  // 商品图片
    mygoodsInfo.unitPrice = this.data.goodsInfo.price;  // 商品图片
    let away = 1;//判断是否是立即购买
    let addrCity = this.data.addrCity;
    let addrId = '';  // 地址id
    if (this.data.address) {
      addrId = this.data.address.id;
    } else {
      addrId = 0;
    }

    // let mysoldPrice = this.data.goods_price * mynum; 

    // 满减Id
    let reductionId = '';
    if (this.data.goodsInfo.reductionId) {
      reductionId = this.data.goodsInfo.reductionId;
      mygoodsInfo.reductionId = this.data.goodsInfo.reductionId;  // 商品图片
      mygoodsInfo.full = this.data.goodsInfo.full;
      mygoodsInfo.reductionPrice = this.data.goodsInfo.reductionPrice;

    } else {
      mygoodsInfo.reductionId = '';
    }
    // 折扣
    let discountId = '';
    if (this.data.goodsInfo.discountId) {
      discountId = this.data.goodsInfo.discountId;
      mygoodsInfo.discountId = this.data.goodsInfo.discountId;  // 商品图片
      mygoodsInfo.discount = this.data.goodsInfo.discount;  // 折扣价
    } else {
      mygoodsInfo.discountId = '';
    }
    mygoodsInfo = [mygoodsInfo];

    app.globalData.buyGoods = { goodsInfo: mygoodsInfo, soldPrice: soldPrice, addressId: addrId, reductionId: reductionId, discountId: discountId, addrCity: addrCity, away: away };
    wx.navigateTo({
      // url: '/pages/commit_order/commit_order?goodsId='+goodsId+'&num='+num+'&totalPrice='+totalPrice,
      url: '/pages/commit_order/commit_order'
    })
  },

})

/**
 * 购买商品达到一定数量,单价优惠
 */
function judgeGoodsNum(status, num, that) {
  if (status == 1) {
    let dealerTerm = that.data.goodsInfo.dealerTerm;
    let price = that.data.goodsInfo.price;
    let dealerPrice = that.data.goodsInfo.dealerPrice;

    if (num >= dealerTerm) {
      that.setData({
        changePrice: true,
        goods_price: dealerPrice
      });
    } else if (num < that.data.goodsInfo.dealerTerm) {
      that.setData({
        changePrice: false,
        goods_price: price
      });
    }
  } else {
    let price = that.data.goodsInfo.price;
    that.setData({
      changePrice: false,
      goods_price: price
    })
  }

}
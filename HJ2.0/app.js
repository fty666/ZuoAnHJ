//app.js
var baseUrl = 'https://www.zuoancellar.com/';
// var baseUrl = 'http://39.105.187.204:8080/';
// var baseUrl = 'http://192.168.1.154:8080/';
const uploadAliyun = require('./weixinFileToaliyun/uploadAliyun.js');
const env = require('./weixinFileToaliyun/env.js');
const amapFile = require('./utils/amap-wx.js');
const mtjwxsdk = require('./utils/mtj-wx-sdk.js');
// 高德地图key 
const wxGaodeMapKey = 'f097b7e83e12c21712873861d39ac6a5'
App({
  onLaunch: function() {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://www.zuoancellar.com/redwine/user/userLogin',
            // url: 'http://39.105.187.204:8080/redwine/user/userLogin',
            // url: 'http://192.168.1.154:8080//redwine/user/userLogin',
            method: 'POST',
            data: {
              code: res.code,
              scene: ''
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(data) {
              // 把用户信息加入缓存
              wx.setStorageSync('userInfo', data.data.data);
              that.globalData.userId = data.data.data.id;
              that.globalData.agency = data.data.data.vipLevel;
              that.globalData.weChat = data.data.data.weChat;
              that.globalData.userInfo = data.data.data;
              that.globalData.accredit = data.data.data.accredit;
              that.globalData.nickName = data.data.data.nickName;
              wx.setStorage({
                key: "accredit",
                data: data.data.data.accredit
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.globalData.userInfo = res.userInfo;
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取页面信息
    let systemInfo = wx.getSystemInfoSync();
    wx.setStorageSync('PX_TO_RPX', {
      px2rpxWidth: systemInfo.windowWidth / 750,
      px2rpxHeight: systemInfo.screenHeight / 1334
    });
  },
  //更新下载 
  onLoad() {
    // 用户版本更新
    if (wx.canIUse("getUpdateManager")) {
      let updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate);
      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            } else if (res.cancel) {
              return false;
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.hideLoading();
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        });
      });
    }
  },
  /**
   * 上传图片二次封装
   */
  myUpload: function(sufun) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      // 上传文件
      success: function(res) {
        let tempFilePaths = res.tempFilePaths;
        // 临时文件路径
        let filePath = tempFilePaths[0];
        console.log(filePath)
        let ext = filePath.slice(filePath.lastIndexOf('.') + 1);
        let extArr = ['png', 'jpg', 'jpeg', 'gif'];
        if (extArr.indexOf(ext) > -1) {
          wx.uploadFile({
            url: app.globalData.UploadFiles,
            filePath: filePath,
            method: 'POST',
            header: {
              "Content-Type": "multipart/form-data",
            },
            name: 'file',
            formData: {
              'user': 'test'
            },
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: '图片格式不正确'
          });
        }
        that.setData({
          immediate_sale_hidden: true
        })
      }
    })
  },

  /**
   * 获取定位二次封装
   */
  amapFilePackage(sucFun, errFun) {
    let myAmapFun = new amapFile.AMapWX({
      key: wxGaodeMapKey
    });
    myAmapFun.getRegeo({
      success: function(data) {
        //成功回调
        sucFun(data)
      },
      fail: function(info) {
        //失败回调
        errFun(info);
      }
    })
  },

  globalData: {
    prcirCounp: '', //判断是否能使用优惠券
    SQjin: '', //判断申请经销商
    userInfo: null,
    buyGoods: null,
    orderGoods: null,
    // 用户id
    userId: '',
    // oppid
    weChat: '',
    // 用户名
    nickName: '',
    // 授权
    empower: true,
    // 判断闪购
    flashbuy:'',
    accredit: '',
    // 传递用户ID
    sellId: '',
    // 用户会员等级
    vipLevel: 1,
    //经销商等级
    agency: '',
    // 商品ID
    shopId: '',
    // 阿里云OOS地址
    aliyunServerURL: 'https://zuoanzac.oss-cn-beijing.aliyuncs.com/',
    // 支付信息
    payInfo: null,
    // 经销商
    dealerCode: '',
    // 猜你喜欢
    youLike: null,
    globalDataBaseUrl: baseUrl,
    // 获取所有评论
    getAllCommetnUrl: baseUrl + 'redwine/order/QueryComment',
    // 获取商品组
    getGroupUrl: baseUrl + 'redwine/goodsGroup/getGroup',
    // 获取商品类
    getGoodsClassUrl: baseUrl + 'redwine/goodsClass/getGoodsClass',
    getGoodsByClassUrl: baseUrl + 'redwine/goods/getGoodsByClass',
    // 获取商品详情
    getGoodsDetailUrl: baseUrl + 'redwine/goods/getGoodsDetail',
    // 查询单个商品的评论
    QueryCommentUrl: baseUrl + 'redwine/order/QueryComment',
    // 加入收藏
    insertCollectionUrl: baseUrl + 'redwine/collection/insertCollection',
    // 相关推荐
    getGoodsBySaleCountUrl: baseUrl + 'redwine/goods/getGoodsBySaleCount',
    // 获取默认地址
    getAddrByDefaultUrl: baseUrl + 'redwine/addr/getAddrByDefault',
    getCartsUrl: baseUrl + 'redwine/carts/getCarts',
    deleteCartsUrl: baseUrl + 'redwine/carts/deleteCarts',
    InsertOrderUrl: baseUrl + 'redwine/order/InsertOrder',
    getAddrUrl: baseUrl + 'redwine/addr/getAddr',
    QueryOrderUrl: baseUrl + 'redwine/order/QueryOrder',
    InsertCommentUrl: baseUrl + '/redwine/order/InsertComment',
    insertCartsUrl: baseUrl + 'redwine/carts/insertCarts',
    updateCartsUrl: baseUrl + 'redwine/carts/updateCarts',
    getGoodsByConditionUrl: baseUrl + 'redwine/goods/getGoodsByCondition',
    // 库存
    getCountUrl: baseUrl + 'redwine/dealer/getCount',
    // 库存详情
    getGoodsDetailByStockUrl: baseUrl + 'redwine/goods/getGoodsDetailByStock',
    insertOwnOrderUrl: baseUrl + 'redwine/dealer/insertOwnOrder',
    //修改个人信息
    updateUserInfoUrl: baseUrl + 'redwine/userInfo/updateUserInfo',
    // 修改呢称
    updateUserInfoNickName: baseUrl + 'redwine/userInfo/updateUserInfoNickName',
    //修改性别
    updateUserInfoSex: baseUrl + 'redwine/userInfo/updateUserInfoSex',
    //修改生日
    updateUserInfoBirth: baseUrl + 'redwine/userInfo/updateUserInfoBirth',
    // 修改头像
    updateUserInfoPhotoUrl: baseUrl + 'redwine/userInfo/updateUserInfoPhoto',
    // 添加地址
    addAddrUrl: baseUrl + 'redwine/addr/addAddr',
    //删除地址
    deleteAddrUrl: baseUrl + 'redwine/addr/deleteAddr',
    //获取单个地址
    getAddrByIdUrl: baseUrl + 'redwine/addr/getAddrById',
    // 修改地址
    updateAddrUrl: baseUrl + 'redwine/addr/updateAddr',
    //设置默认
    updateAddrDefault: baseUrl + 'redwine/addr/updateAddrDefault',
    // 正在销售页面
    getIsSaleUrl: baseUrl + 'redwine/dealer/getIsSale',
    // 订单明细
    getsaleTrackUrl: baseUrl + 'redwine/saleTrack/getsaleTrack',
    // 按月份查找数据
    getSaleTrackByMonthkUrl: baseUrl + 'redwine/saleTrack/getSaleTrackByMonth',
    // 下架
    updateStockUrl: baseUrl + 'redwine/goods/updateStock',
    // 获取商品列表，分类下单商品
    getGoodsUrl: baseUrl + '/redwine/goods/getGoods',
    // 获取用户信息
    getUserInfoUrl: baseUrl + '/redwine/userInfo/getUserInfo',
    // 申请回购
    getBuyBackNumUrl: baseUrl + '/redwine/user/buyBack',
    //按月份查找金额
    // getBuyBackNumUrl: baseUrl + 'redwine/saleTrack/getSaleTrackByMonth',
    // 查询总金额
    getAllSaleMoneyUrl: baseUrl + 'redwine/saleTrack/getAllSaleMoney',
    // 获取物流信息
    getTransInfoUrl: baseUrl + 'redwine/transInfo/getTransInfo',
    // 获取物流公司
    getCompanyUrl: baseUrl + 'redwine/transInfo/getCompany',
    // 根据分组id获取分组信息
    getGroupById: baseUrl + 'redwine/goodsGroup/getGroupById',
    // 查看收藏页面
    getCollectionUrl: baseUrl + 'redwine/collection/getCollection',
    // 取消收藏
    deleteCollectionUrl: baseUrl + 'redwine/collection/deleteCollection',
    // 活动专区
    selectActivityUrl: baseUrl + 'redwine/activity/selectActivity',
    // 立即出售
    isSaleUrl: baseUrl + 'redwine/admin/isSale',
    // 自提商品
    getMyOrder: baseUrl + 'redwine/dealer/getMyOrder',
    // 查询默认银行卡
    getCardByDefaultUrl: baseUrl + 'redwine/card/getCardByDefault',
    // 查询银行卡
    getCardByUserUrl: baseUrl + 'redwine/card/getCardByUser',
    // 删除银行卡
    deleteCardUrl: baseUrl + 'redwine/card/deleteCard',
    // 添加银行卡
    insertCardUrl: baseUrl + 'redwine/card/insertCard',
    // 设置默认（多个）
    updateCardDefaultUrl: baseUrl + 'redwine/card/updateCardDefault',
    // 设置默认（单个）
    updateCardDefaultByOneUrl: baseUrl + 'redwine/card/updateCardDefaultByOne',
    // 查询分类
    getClassifyUrl: baseUrl + 'redwine/goodsClass/getClassify',
    // 查询产地
    getPlaceUrl: baseUrl + 'redwine/goodsClass/getPlace',
    // 查询口感
    getTasteUrl: baseUrl + 'redwine/goodsClass/getTaste',
    // 查询品种
    getVarietyUrl: baseUrl + 'redwine/goodsClass/getVariety',
    // 查询价格
    getPriceUrl: baseUrl + 'redwine/goodsClass/getPrice',
    // 查询容量
    getCapacityUrl: baseUrl + 'redwine/goodsClass/getCapacity',
    // 查询特性
    getCharacterUrl: baseUrl + 'redwine/goodsClass/getCharacter',
    // 经销商下架商品
    deleteDealerStockUrl: baseUrl + 'redwine/dealer/deleteDealerStock',
    // 经销商上架商品
    insertDealerStockUrl: baseUrl + 'redwine/dealer/insertDealerStock',
    // 商品总库存量
    getAllStockUrl: baseUrl + 'redwine/goods/getAllStock',
    // 申请经销售
    insertDealerUrl: baseUrl + 'redwine/dealer/insertDealer',
    // 查看分类
    getGoodClassUrl: baseUrl + '/redwine/admin/getGoodClass',
    // 查询价格
    getWineAgeUrl: baseUrl + 'redwine/goodsClass/getWineAge',
    // 获取手机验证码
    getSmsUrl: baseUrl + 'redwine/user/getSms',
    // 验证手机验证码
    verificationSmsUrl: baseUrl + 'redwine/user/verificationSms',
    //添加手机号
    updateUserInfoMobileUrl: baseUrl + 'redwine/userInfo/updateUserInfoMobile',
    //热销  
    getGoodsBySaleCountDesc: baseUrl + 'redwine/goods/getGoodsBySaleCountDesc ',
    createwxaqrcode: baseUrl + 'redwine/user/createwxaqrcode',
    //查询满减
    updateUserInfoMobileUrl: baseUrl + 'redwine/userInfo/updateUserInfoMobile',
    //满减活动
    getReductionUrl: baseUrl + 'redwine/reduction/getReduction',
    //折扣商品
    getDiscount: baseUrl + 'redwine/discount/getDiscount',
    // 经销商推荐列表
    checkDealerGoods: baseUrl + 'redwine/dealer/checkDealerGoods',
    // 修改经销商状态
    updateDealerGoodsStatus: baseUrl + 'redwine/dealer/updateDealerGoodsStatus',
    // 修改订单状态
    updateOrderStatus: baseUrl + 'redwine/order/updateOrderStatus',
    // 退货换货
    returnOrderUrl: baseUrl + 'redwine/order/returnOrder',
    // 计算邮费
    getOrderPostage: baseUrl + 'redwine/transInfo/getOrderPostage',
    // 支付页面
    wxPayUrl: baseUrl + 'redwine/order/wxPay',
    // 修改等级
    updateUserLevel: baseUrl + 'redwine/user/updateUserLevel',
    // 销售人员ID和用户绑定
    insertSalesPersonUser: baseUrl + 'redwine/user/insertSalesPersonUser',
    // 提醒发货
    webSocketPingTaiUrl: baseUrl + 'redwine/order/webSocketPingTai',
    // 满减
    getGoodsByReductionUrl: baseUrl + 'redwine/goods/getGoodsByReduction',
    // 查询折扣商品（正确的）
    getAcGoodsUrl: baseUrl + '/redwine/admin/getAcGoods',
    // 查询活动列表
    getActivityUrl: baseUrl + '/redwine/admin/getActivity',
    // 查询满减商品
    getActivityGoods: baseUrl + '/redwine/admin/getActivityGoods',
    // 提醒发货
    updateTiXingZT: baseUrl + '/redwine/order/updateTiXingZT',
    //添加留言
    addLeave: baseUrl + '/redwine/user/addLeave',


    // --------------------------2.0----------------------------
    // 查询申请经销商的酒
    getRecommendGoodsUrl: baseUrl + '/redwine/dealer/getRecommendGoods',
    // 提交选取经销商的酒
    insertDealerUrl: baseUrl + 'redwine/dealer/insertDealer',
    // 查询是否是经销商
    getAuditDealerUrl: baseUrl + 'redwine/adminUser/getAuditDealer',
    //添加订单（2.0改的正确的） 
    addOrder: baseUrl + 'redwine/order/addOrder',
    // 库存可以上架的数量
    getDealerShock: baseUrl + 'redwine/dealer/getDealerShock',
    // 库存正在销售中的数量
    getDealerNum: baseUrl + 'redwine/dealer/getDealerNum',
    // 经销商下架
    deleteDealerStock: baseUrl + 'redwine/dealer/deleteDealerStock',
    // 添加发票信息
    addInvoiceUrl: baseUrl + 'redwine/order/addInvoice',
    // 计算邮费
    carriageUrl: baseUrl + 'redwine/order/carriage',
    // 查询可回购商品信息
    getBuybackNumPriceListUrl: baseUrl + 'redwine/adminUser/getBuybackNumPriceList',
    // 查询订单
    getOrdersUrl: baseUrl + 'redwine/order/getOrders1',
    // 修改购物车数量
    updateCartsNumUrl: baseUrl + 'redwine/order/updateCartsNum',
    // 确认回购
    addBuyBack: baseUrl + 'redwine/adminUser/addBuyBack',
    // 回购邮费
    updateZiTiStatus: baseUrl + 'redwine/order/updateZiTiStatus',
    //经销商体验商品 
    getDealerGoods: baseUrl + 'redwine/dealer/getDealerGoods',
    // 回购商品
    getDealerBuyBackList: baseUrl + 'redwine/adminUser/getDealerBuyBackList',
    //图片上传接口
    UploadFiles: baseUrl + 'redwine/user/UploadFiles',
    // 提醒发货2.0
    updateRemind: baseUrl + 'redwine/order/updateRemind',
    //首页显示精品商品
    getGoodsType: baseUrl + 'redwine/goods/getGoodsType',
    // 查询经销商销售额
    getBusiness: baseUrl + 'redwine/dealer/getBusiness',
    //查询可以提现的金额
    getBalance: baseUrl + 'redwine/dealer/getBalance',
    // 提现接口
    addDealerWithdraw: baseUrl + 'redwine/dealer/addDealerWithdraw',
    //查看经销商订单
    getDealerOrders: baseUrl + 'redwine/dealer/getDealerOrders',
    // 获取订单2.0
    getOrdersByPayUUID: baseUrl + 'redwine/order/getOrdersByPayUUID',
    // 查看小订单
    getOrdersUUIDByPayUUID: baseUrl + 'redwine/order/getOrdersUUIDByPayUUID',

    //-------------------测试支付-------------- 
    huidiao: baseUrl + 'redwine/order/huidiao',
    // -------------------------3.0------------------------------
    // 查询轮播图
    getBanner: baseUrl + 'redwine/ad/getAd',
    // 添加优惠券
    addCoupon: baseUrl + 'redwine/user/getCoupon',
    // 查询用户优惠券
    selecCoupon: baseUrl + 'redwine/user/selectCouponByUser',
    // 优惠券id加入订单
    updateOrderCoupon: baseUrl + 'redwine/order/updateOrderCoupon',
    // 判断闪购
    distribution: baseUrl + 'redwine/order/distribution'
  },
})
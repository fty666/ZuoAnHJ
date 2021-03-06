// pages/address/add/add.js
var util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    area: '',//具体地址
    address: {},
    location: '',//经度纬度
    px2rpxHeight: '',
    px2rpxWidth: '',
  },

  // 选择地区
  bindRegionChange: function (e) {
    this.setData({
      diqu: e.detail.value
    })
  },
  // 地址提交数据
  formSubmit: function (e) {
    var addrCity = e.detail.value.addrCity;
    var addrDetail = e.detail.value.addrDetail;
    var phone = e.detail.value.phone;
    if (!util.checkReg(1, phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    var receiveName = e.detail.value.receiveName;
    // if (e.detail.value.checkbox[0] == 'true') {
      var defaults = 1;
    // } else {
    //   var defaults = 0;
    // }
    util.myWxRequest(app.globalData.addAddrUrl, {
      user_id: app.globalData.userId,
      receiveName: receiveName,
      phone: phone,
      addrCity: addrCity,
      addrDetail: addrDetail,
      is_default: defaults
    }, function (res) {
      if (app.globalData.shopId != '') {
        wx.showToast({
          icon: 'success',
          title: '添加成功'
        })
        wx.navigateTo({
          url: '/pages/goods_detail/goods_detail?id=' + app.globalData.shopId,
          // url: '/pages/commit_oirder/commit_order?id=' + app.globalData.shopId,
        })
        // wx.navigateBack({
        //   url: '/pages/commit_oirder/commit_order',
        // })
      } else {
        wx.showToast({
          icon: 'success',
          title: '添加成功'
        });
        wx.redirectTo({
          url: '/pages/myinfo/myinfo',
        })
      }
    });
  },
  /**
   *定位 
   */
  location: function () {
    let that = this;
    let address = that.data.address;
    app.amapFilePackage((data) => {
      // console.log(data)
      address.area_detail = data[0].regeocodeData.pois[0].name;
      let longitude_latitude = data[0].regeocodeData.pois[0].location.split(',');
      address.longitude = longitude_latitude[0];
      address.latitude = longitude_latitude[1];
      that.setData({
        diqu: data[0].regeocodeData.addressComponent.province + data[0].regeocodeData.addressComponent.district,
        location: data[0].regeocodeData.pois,
        address: address,
        area: data[0].regeocodeData.pois[0].name
      });
    }, () => { });
  },


  /**
  * 选择定位地址
  */
  getLocation: function (e) {
    let that = this;
    let address = that.data.address;
    let locationName = e.currentTarget.dataset.locationname;
    let longitude_latitude = e.currentTarget.dataset.titude.split(',');
    address.area_detail = locationName;
    address.longitude = longitude_latitude[0];
    address.latitude = longitude_latitude[1];
    that.setData({
      address: address,
      area: address.area_detail
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

})
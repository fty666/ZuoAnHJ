// pages/users/users/users.js
var util = require('../../../utils/util.js');
const app = getApp();
var env = require('../../../weixinFileToaliyun/env.js');
var uploadAliyun = require('../../../weixinFileToaliyun/uploadAliyun.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userinfo: '',
    // 生日
    date: "生日有礼填写后不可修改",
    // 性别
    baomi: 0,
    array: ['不可见 > ', '男', '女'],
    sex: '不可见',
    // 呢称
    necheng: "还没有设置呢称",
    // 头像
    img: "",
    covering_layer_hidden: true,
    immediate_sale_hidden: true,
    serverUrl: app.globalData.aliyunServerURL,
    // 手机号
    tel: null,
    send_code: '点击获取验证码',
    disabled: false,
    mobels: '请输入手机号码',
  },

  // 日期单击事件
  bindPicker: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  cancel_sale: function () {
    this.setData({
      immediate_sale_hidden: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 呢称修改设置
    if (options.nechen) {
      this.setData({
        necheng: options.nechen
      })
    }
  },

  // 修改性别
  update: function (e) {
    var date = e.detail.value
    util.myWxRequest(app.globalData.updateUserInfoSex, { userId: app.globalData.userId, sex: date }, function (res) {
      wx.showToast({
        icon: 'success',
        title: '修改成功'
      });
    });
    this.setData({
      baomi: e.detail.value
    })
  },

  //修改生日
  birthday: function (e) {
    var date = e.detail.value;
    util.myWxRequest(app.globalData.updateUserInfoBirth, { userId: app.globalData.userId, birth: date }, function (res) {
      wx.showToast({
        icon: 'success',
        title: '修改成功'
      });
    });
    this.setData({
      date: e.detail.value
    })
  },

  // 修改图片
  images: function () {
    util.myWxRequest(app.globalData.updateUserInfoUrl, { userId: app.globalData.userId, photo: this.data.img }, function (res) {
      wx.showToast({
        icon: 'success',
        title: '修改成功'
      });
    });
  },

  //拍摄照片
  photo: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
    this.setData({
      immediate_sale_hidden: true
    });
  },

  // 本地上传
  local: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      // 上传文件
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        // 临时文件路径
        let filePath = tempFilePaths[0];
        console.log(filePath)
        let ext = filePath.slice(filePath.lastIndexOf('.')+1);
        let extArr = ['png', 'jpg', 'jpeg', 'gif'];
        if ( extArr.indexOf(ext) > -1 ) {
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
            success(res) {
              console.log(res)
              let imgs = res.data;
              // 头像上传数据库
              util.myWxRequest(app.globalData.updateUserInfoPhotoUrl, { userId: app.globalData.userId, photo: res.data }, function (res) {
                console.log(res)
                that.setData({
                  img: imgs
                })
                wx.showToast({
                  icon: 'success',
                  title: '修改成功'
                });
              })
            }
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

  // 头像上传事件
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


  // 地址管理
  guanli: function () {
    util.myWxRequest(app.globalData.getAddrUrl, { user_id: app.globalData.userId }, function (res) {
      var length = res.data.data.length
      if (length > 0) {
        wx.navigateTo({
          url: '/pages/address/insert/insert'
        })
      } else {
        wx.navigateTo({
          url: '/pages/address/address/address'
        })
      }
    });
  },

  /**
   *手机号 
   */
  getTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },

  /**
   *发送验证码 
   */
  sendCode: function (e) {
    let that = this;
    // 验证手机号
    if (!util.checkReg(1, that.data.tel)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // 验证码倒计时
    let i = 120;
    let cleat_set = null;
    cleat_set = setInterval(function () {
      that.setData({
        send_code: '重新发送（' + i + ')',
        disabled: true
      })
      i--;
      if (i < 0) {
        clearInterval(cleat_set);
        that.setData({
          send_code: '点击获取验证码',
          disabled: false
        })
        i = 120;
      }
    }, 1000)

    // 获取验证码
    util.myWxRequest(app.globalData.getSmsUrl, { mobile: that.data.tel }, function (res) {
      console.log(res)
      wx.showToast({
        title: '已发送，注意查收',
      })
    })
  },

  /**
   *验证手机验证码 
   */
  codes: function (e) {
    let that = this;
    let codes = e.detail.value;
    let len = codes.length;
    console.log(len)
    if (len == 6) {
      console.log(codes)
      // 获取验证码
      util.myWxRequest(app.globalData.verificationSmsUrl, { mobile: that.data.tel, smsCode: codes }, function (res) {
        console.log(res)
        if (res.data.data == 1) {
          // 获取验证码
          util.myWxRequest(app.globalData.updateUserInfoMobileUrl, { mobile: that.data.tel, userId: app.globalData.userId }, function (res) {
            console.log(res)
            wx.showToast({
              title: '输入成功',
            })
          })
        } else {
          wx.showToast({
            title: '验证码有误',
            icon: 'none'
          })
          return false;
        }
      })
    }

  },

  /**
   *提交信息 
   */
  formSubmit: function () {
    let last = util.getPrevPageUrl();
    console.log(last);
    let lasts = '';
    if (last == 'pages/users/nechen/nechen') {
      lasts = util.getLastPageUrl();
      console.log(lasts)
    }
    if (last == 'pages/myinfo/myinfo' || lasts == 'pages/myinfo/myinfo') {
      wx.navigateTo({
        url: '/pages/myinfo/myinfo',
      })
    } else if (last == 'pages/trader/user/user' || lasts == 'pages/trader/user/user') {
      wx.navigateTo({
        url: '/pages/trader/user/user',
      })
    } else {
      wx.navigateTo({
        url: '/pages/trader/index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    // let userInfo = wx.getStorageSync('userInfo');
    let userInfo = app.globalData.userInfo;
    let url = util.getPrevPageUrl();
    if (url == 'pages/trader/index/index') {
      // 修改呢城
      util.myWxRequest(
        app.globalData.updateUserInfoNickName,
        { userId: app.globalData.userId, nickName: userInfo.nickName },
        function (res) {
          that.setData({
            necheng: userInfo.nickName
          })
        });
      // 修改头像
      util.myWxRequest(
        app.globalData.updateUserInfoPhotoUrl,
        { userId: app.globalData.userId, photo: userInfo.avatarUrl },
        function (res) {
          that.setData({
            img: userInfo.avatarUrl
          })
        })
    } else {
      //   获取用户信息
      util.myWxRequest(app.globalData.getUserInfoUrl, { userId: app.globalData.userId }, function (res) {
        console.log(res)
        let serverUrl = that.data.serverUrl;
        that.setData({
          userinfo: res.data.data,
          img: res.data.data.photo,
          necheng: res.data.data.nickName,
          date: res.data.data.birth,
          mobels: res.data.data.mobile
        })
        if (res.data.data.sex == 1) {
          that.setData({
            sex: '男'
          })
        }
        if (res.data.data.sex == 0) {
          that.setData({
            sex: "不可见"
          })
        }
        if (res.data.data.sex == 2) {
          that.setData({
            sex: '女'
          })
        }
      });
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})
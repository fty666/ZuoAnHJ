var env = require('../../weixinFileToaliyun/env.js');
var uploadAliyun = require('../../weixinFileToaliyun/uploadAliyun.js');
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {
      id: 1,
      img: '../../images/comment-img.png',
      gname: '奔富洛神山庄设拉子赤霞珠红葡萄酒750ml进口红酒葡萄酒'
    },
    commentDetail: '',
    commentImg: '',
    src: [],
    serverUrl: app.globalData.aliyunServerURL,
    imgs: [], //数据库里存的
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/normal.png',
    selectedSrc: '../../images/selected.png',
    halfSrc: '../../images/half.png',
    px2rpxHeight: '',
    px2rpxWidth: '',
    qos: '',//服务态度
    logistics: '',//物流服务
    key: '',
    uuid: '',//订单ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    let goodsInfo = { id: options.goodsId, gname: options.goodsName, img: options.goodsImg, uuid: options.uuids };
    that.setData({
      goodsInfo: goodsInfo,
      uuid: options.uuids
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
   *获取服务态度评分
   */
  //点击右边,半颗星
  qosLeft: function (e) {
    let key = e.currentTarget.dataset.key
    if (this.data.key == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      this.setData({
        qos: 0,
        key: key + 1
      })
    } else {
      this.setData({
        qos: key,
        key: key
      })
    }
    console.log(key)
  },


  /**
   *  获取物流评分
   */
  wuliusLeft: function (e) {
    let key = e.currentTarget.dataset.key
    if (this.data.key == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      this.setData({
        logistics: 0,
        key: key + 1
      })
    } else {
      this.setData({
        logistics: key,
        key: key
      })
    }
  },

  /**
   * 获取评论
   */
  bindTextAreaBlur: function (e) {
    this.setData({
      commentDetail: e.detail.value
    });
  },

  /**
   * 添加图片
   */
  addImg: function () {
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
            success(res) {
              console.log(res)
              let pic = res.data;//返回的图片
              let src = that.data.src;
              let imgs = that.data.imgs;
              src.push(pic)
              imgs.push(pic)
              that.setData({
                src: src,
                imgs: imgs
              })
            }
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: '图片格式不正确'
          });
        }
      }
    })
  },


  /**
   * 删除图片
   */
  cancleImg: function (e) {
    var index = e.currentTarget.dataset.src;
    var src = this.data.src;
    src.splice(index, 1);
    console.log(src)
    this.setData({
      src: src
    });
  },

  /**
   * 发表评论
   */
  publishComment: function (e) {
    var commentDetail = this.data.commentDetail;
    var myurl = app.globalData.InsertCommentUrl;
    console.log(this.data.src)
    let logistics = this.data.logistics;
    let qos = this.data.qos;
    if (util.isEmpty(qos)) {
      qos = 5;
    }
    if (util.isEmpty(logistics)) {
      logistics = 5;
    }
    var mydata = {
      userId: app.globalData.userId,  // 用户id
      // goodsId: this.data.uuid, // 商品id 
      detail: this.data.commentDetail, // 评论内容
      describes: '',  // 描述相符
      logistics: this.data.logistics,  // 物流服务
      QoS: this.data.qos,  // 服务态度
      img: this.data.imgs,// 评论图片 
      orderUUId: this.data.uuid
    };
    util.myWxRequest(myurl, mydata, function (res) {
      wx.showToast({
        icon: 'success',
        title: '评论成功'
      });
      
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myorder/myorder',
        })
      }, 1000)

    });
  }
})
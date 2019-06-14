// pages/after_sale/after_sale.js
const app = getApp();
var utils = require('../../utils/util.js');
let uploadUrl = app.globalData.UploadFiles;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {
      img: '../../images/comment-img.png',
      gname: '奔富洛神山庄设拉子赤霞珠红葡萄酒750ml进口红酒葡萄酒',
      specification: '750ml 6*1箱'
    },
    serverUrl: app.globalData.aliyunServerURL,
    back: '',//退换货
    uuid: '',//订单号
    status: '',//5退货6换货
    px2rpxHeight: '',
    px2rpxWidth: '',
    src: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      uuid: options.uuid
    })
    let that = this;
    let goodsInfo = { id: options.goodsId, gname: options.goodsName, img: options.goodsImg, specification: options.specification };
    that.setData({
      goodsInfo: goodsInfo
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
            // url: app.globalData.UploadFiles,
            url: uploadUrl,
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
              src.push(pic)
              that.setData({
                src: src,
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
   *退换货原因 
   */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let content = e.detail.value.content;
    let that = this;

    // 获取商品信息
    utils.myWxRequest(app.globalData.addLeave, {
      details: content,
      img: that.data.src,
      userId: app.globalData.userId
    }, function (res) {
      sendSocket()
      wx.showToast({
        title: '留言成功',
      })

      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myinfo/myinfo',
        })
      }, 1000)
    });

  },


  /**
*客服 
*/
  custom: function () {
    wx.makePhoneCall({
      phoneNumber: '022-27357010',
    })
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

  }
})

function sendSocket() {
  let now = utils.formatDate(new Date().getTime());
  let userno = + app.globalData.userId;
  let mymessage = "时间" + now + '发送人' + userno;
  let socketOpen = false;
  let socketMsgQueue = [];
  let message = '2' + '|' + mymessage + '|' + 'PingTai';
  if (!utils.isEmpty(message)) {
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
        console.log(socketMsgQueue[i])
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
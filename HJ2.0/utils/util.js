const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

/*获取上一页url*/
function getPrevPageUrl() {
  let pages = getCurrentPages(); //获取加载的页面
  let prevPage = pages[pages.length - 2]; //获取上一级页面的对象
  let url = prevPage.route; //上一个页面url
  return url;
}

/*获取上俩页url*/
function getLastPageUrl() {
  let pages = getCurrentPages(); //获取加载的页面
  console.log(pages)
  let prevPage = pages[pages.length - 4]; //获取上一级页面的对象
  let url = prevPage.route; //上一个页面url
  return url;
}

// function getPrevPage() {
//     //获取加载的页面
//     var pages = getCurrentPages();
//     //获取上一级页面的对象
//     var porevPage = pages[pages.length - 2];
//     if (porevPage) {
//         // //获取上一级页面的url
//         var url = prevPage.route;
//         if (url == 'pages/cart/cart') {
//             this.setData({
//                 btnText: '提交订单'
//             });
//         }
//     }
// }


/**
 * 加入购物车
 * @param id 商品id
 * @param price 商品价格
 * @param price 商品数量
 */
function addToCartFun(mygoodsId, myuserId, mynum, mycartsPrice, activityId) {
  let myurl = getApp().globalData.insertCartsUrl;
  let mydata = { goodsId: mygoodsId, userId: myuserId, num: mynum, cartsPrice: mycartsPrice, activityId: activityId }
  myWxRequest(myurl, mydata, function (res) {
    wx.showToast({
      title: '加入购物车成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    });
  });

}


/**
 * wx.request二次封装
 */
function myWxRequest(myurl, mydata, mysufun) {
  wx.request({
    url: myurl,
    method: 'POST',
    data: mydata,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.data.state == 1) {
        mysufun(res);
      } else {
        wx.showToast({
          icon: 'none',
          //    title: '您的网络太差'
          title: res.data.message,
          duration: 2000
        });

      }
    }
  });
}

/**
 *库存不足 
 */
function kumyWxRequest(myurl, mydata, mysufun) {
  wx.request({
    url: myurl,
    method: 'POST',
    data: mydata,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.data.state == 1) {
        mysufun(res);
      } else {

        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 3000)

        wx.showToast({
          icon: 'none',
          //    title: '您的网络太差'
          duration: 5000,
          title: res.data.message,
        });
      }
    }
  });
}


/**
 * 格式化时间戳 
 */
function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
  var date = new Date(time);

  var year = date.getFullYear(),
    month = date.getMonth() + 1,//月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
    return '0' + index;
  });////开个长度为10的数组 格式为 00 01 02 03

  var newTime = format.replace(/YY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec);

  return newTime;
  // console.log(formatDate(new Date().getTime()));//2017-05-12 10:05:44
  // console.log(formatDate(1527253460000, 'YY年MM月DD日'));//2017年05月12日
  // console.log(formatDate(1527253460000, '今天是YY/MM/DD hh:mm:ss'));//今天是2017/05/12 10:07:45
}

/**
 * 验证正则
 */
function checkReg(flag, data) {
  let reg = null;
  switch (flag) {
    case 1:
      // 手机号
      reg = /^1[34578]\d{9}$/;
      break;
    case 2:
      // 身份证号
      reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      break;
    case 3:
      // 银行卡号
      reg = /^([1-9]{1})(\d{15}|\d{18})$/;
    case 4:
      // 带小数的金额
      reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      break;
    case 5:
      // 折扣正则(如8.8)
      reg = /[1-9](\.[1-9])?|0\.[1-9]/;
      break;
    case 6:
      reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      break;
    case 7:
      reg = /^[a-zA-Z0-9]{18,22}$/;
      break;
  }
  return reg.test(data);
}


/**
 * m-n之间的随机数
 */
function rand(m, n) {
  return Math.ceil(Math.random() * (n - m + 1)) + (m - 1);
}

/**
 * 上传文件
 */
function myUploadFile(myurl, sufun) {
  wx.chooseImage({
    success: function (res) {
      var tempFilePaths = res.tempFilePaths
      const uploadTask = wx.uploadFile({
        url: myurl,
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success: function (res) {
          if (res.status == 1) {
            sufun(res);
          } else {
            wx.showToast({
              icon: 'none',
              title: '上传失败'
            });
          }

        }
      });
      // uploadTask.onProgressUpdate((res) => {
      //     console.log('上传进度', res.progress)
      //     console.log('已经上传的数据长度', res.totalBytesSent)
      //     console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      // })
      // uploadTask.abort() // 取消上传任务
    }
  })
}

/**
 * 获取缓存,保存缓存
 */
function getSetStorage(inputVal, arrayVal) {
  // 获取用户缓存
  let storageVal = [];
  wx.getStorage({
    key: 'goods',
    success: function (res) {
      console.log(res)
      storageVal = res.data;
      if (storageVal != '') {
        storageVal.push(inputVal);
        console.log(storageVal);
      } else {
        storageVal = arrayVal;
      }
      // 保存缓存
      wx.setStorage({
        key: 'goods',
        data: storageVal
      });
    },
    fail: function () {
      // 保存缓存
      wx.setStorage({
        key: 'goods',
        data: arrayVal
      });
    }
  });
}

/**
 * 计算数组出现次数最多的元素
 */
function mostValue(arr) {
  if (!Array.isArray(arr)) return;
  if (arr.length === 1) return 1;
  let temp = [];//对象数组
  let i;
  temp[0] = { value: arr[0], index: 1 };//保存数组元素出现的次数和值
  arr.sort();
  for (i = 1; i < arr.length; i++) {
    if (arr[i] == arr[i - 1]) {
      temp[temp.length - 1].index++;
    } else {//不相同则新增一个对象元素
      temp.push({ index: 1, value: arr[i] });
    }
  }
  temp.sort(function (a, b) {
    //按照出现次数从大到小排列
    return a.index < b.index;
  })
  // var max = temp[0].index;//最多的次数
  var maxV = temp[0].value;//出现最多的元素
  // var second = temp[1].index;//第二多的次数
  // var secondV = temp[1].value;//出现第二多的元素
  // return { max, maxV, second, secondV };
  return maxV;
}

/**
 * 判断值是否为空
 * @param data
 * @returns {boolean}
 */
function isEmpty(data) {
  if (data === "" || data === 0 || data === "0" || data === null || data === false || typeof data === 'undefined') {
    return true;
  }

  if (typeof data == 'object') {
    for (key in data) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * WebSocket-发送
 */
function sendSocket(mymessage, ToSendUserno) {
  let socketOpen = false;
  let socketMsgQueue = [];
  let message = mymessage + '|' + ToSendUserno;
  if (!util.isEmpty(message)) {
    socketMsgQueue.push(message);
  }
  wx.connectSocket({
    url: 'wss://://www.zuoancellar.com/order/webSocketPingTai' + ToSendUserno,
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
          message: socketMsgQueue[i]
        })
      } else {
        socketMsgQueue.push(socketMsgQueue[i])
      }
    }
    socketMsgQueue = []
  });

  wx.onSocketError(function (res) {
    socketOpen = false;
  });

}

module.exports = {
  formatTime: formatTime,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  getPrevPageUrl: getPrevPageUrl,
  addToCartFun: addToCartFun,
  myWxRequest: myWxRequest,
  formatDate: formatDate,
  myUploadFile: myUploadFile,
  rand: rand,
  getSetStorage: getSetStorage,
  mostValue: mostValue,
  getLastPageUrl: getLastPageUrl,
  checkReg: checkReg,
  sendSocket: sendSocket,
  isEmpty: isEmpty,
  kumyWxRequest: kumyWxRequest
}

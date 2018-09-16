
const getData = (url, timeout) => {
  if (!/^(\/\/|http)/.test(url)) url = 'https://' + url;
  if (/^\/\//.test(url)) url = 'https:' + url;
  if (!/https:\/\/feed\.iam\.gy/.test(url)) {
    url = 'https://feed.iam.gy/oth/?url=' + url;
  } else if (!/type=json/.test(url)) {
    url = url + '?type=json';
  }
  console.log(url, timeout);
  return new Promise((resolve, reject) => {
    timeout = timeout || 60;
    let isBack = false;
    setTimeout(() => {
      if (!isBack) {
        isBack = true;
        reject('获取内容超时');
      }
    }, timeout * 1000);
    wx.request({
      url: url,
      success: function (result) {
        if (!isBack) {
          isBack = true;
          if (result && result.statusCode >= 200 && result.statusCode < 300 && result.data) {
            resolve(result.data);
          } else {
            reject("源错误");
          }
        }
      },
      fail: function () {
        if (!isBack) {
          isBack = true;
          reject("源错误");
        }
      }
    });
  });
}

module.exports = {
  getData
}
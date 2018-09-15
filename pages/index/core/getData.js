
const getData = url => {
  if (!/^(\/\/|http)/.test(url)) url = 'http://' + url;
  if (/^\/\//.test(url)) url = 'http:' + url;
  if (!/https:\/\/feed\.iam\.gy/.test(url)) {
    url = 'https://feed.iam.gy/oth/?url=' + url;
  } else if (!/type=json/.test(url)) {
    url = url + '?type=json';
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      success: function (result) {
        resolve(result.data);
      }
    });
  });
}

module.exports = {
  getData
}
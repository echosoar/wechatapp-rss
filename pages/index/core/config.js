const setConfig = (newConfig) => {
  return new Promise((resolve, reject) => {
    getConfig().then(config => {
      config = Object.assign(config, newConfig);
      wx.setStorage({
        key: 'config',
        data: config,
        success: () => {
          resolve(config);
        },
        fail: () => {
          resolve(config);
        }
      });
    });
  });
}

const getConfig = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'config',
      success: (data) => {
        if (!data || data.data == null) {
          resolve({});
        } else {
          resolve(data.data);
        }
      },
      fail: () => {
        resolve({});
      }
    });
  });
}
module.exports = {
  getConfig,
  setConfig
}
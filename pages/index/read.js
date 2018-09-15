const Origin = require('./core/origin.js');
const config = require('core/config.js');
const ImageReg = /^\[图(\d+).*?feedIamGy\]$/i;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    config: {
      contentTitleSize: 18,
      contentTextSize: 12
    }
  },

  onLoad: function (query) {
    config.getConfig().then(config => {
      this.setData({
        config: Object.assign(this.data.config, config)
      });
    });
    Origin.getArticleById(query.origin, query.oneId).then(data => {
      let imgs = data.data.imgs || [];
      let text = (data.data.text || []).map(para => {
        if (ImageReg.test(para)) {
          let imgIndex = ImageReg.exec(para)[1] - 1;
          let img = imgs[imgIndex];
          imgs[imgIndex] = null;
          return { t: 'image', value: img };
        }
        return { t: 'text', value: para };
      });

      data.data.text = text;
      data.data.imgs = imgs.filter(v => v);

      this.setData({
        item: data
      });
    })
  },
  viewImg(e) {
    wx.previewImage({
      urls: [e.target.dataset.src],
      current: e.target.dataset.src
    });
  },
})
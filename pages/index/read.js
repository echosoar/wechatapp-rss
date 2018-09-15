const Origin = require('./core/origin.js');
const ImageReg = /^\[图(\d+).*?feedIamGy\]$/i;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {}
  },

  onLoad: function (query) {
    Origin.getArticleById(query.origin, query.oneId).then(data => {
      console.log(data)
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
})
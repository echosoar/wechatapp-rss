// pages/index/components/content.js
Component({
  properties: {
    content: {
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        console.log(newVal);
        this.setData({
          content: newVal
        });
      }
    },
    config: {
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        this.setData({
          config: newVal
        });
      }
    }
  },
  data: {}
})

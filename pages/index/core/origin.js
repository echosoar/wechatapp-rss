const TimeFormat = require('./time.js');
const getOrigin = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'origin',
      success: (data) => {
        if (!data || data.data == null) {
          autoInitOrigin(resolve, reject);
        } else {
          resolve(data.data);
        }
      },
      fail: () => {
        autoInitOrigin(resolve, reject);
      }
    });
  });
}

const autoInitOrigin = (resolve, reject) => {
  wx.setStorage({
    key: 'origin',
    data: {},
    success: () => {
      getOrigin().then(data => {
        resolve(data);
      });
    },
    fail: () => {
      reject('初始化源对象失败');
    }
  })
}

const add = originInfo => {
  return new Promise((resolve, reject) => {
    getOrigin().then(origin => {
      let id = Date.now() * 1000;
      originInfo.addTime = Date.now();
      originInfo.updateTime = Date.now();
      originInfo.id = id;
      origin[id] = originInfo;
      wx.setStorage({
        key: 'origin',
        data: origin,
        success: () => {
          resolve(id);
        },
        fail: () => {
          reject('添加失败');
        }
      })
    }).catch(reject); 
  })
}

const getById = (id, page, length) => {
  let isSlice = true;
  if (!page || !length) isSlice = false;
  return new Promise((resolve, reject) => {
    getOrigin().then(origin => {
      let data = origin[id] || {};
      let start = ((page || 1) - 1) * length;
      if (data.list && isSlice) data.list = data.list.slice(start, start + length);
      resolve(data);
    }).catch(reject);
  });
}

const size = 30;

const getByIds = (ids, page) => {
  page = page || 1;
  let everyOriginLength = Math.ceil(size / (ids.length || 1));
  if (everyOriginLength > size) everyOriginLength = size;
  if (everyOriginLength < 5) everyOriginLength = 5;
  return Promise.all(ids.map(id => {
    return getById(id, page, everyOriginLength);
  })).then(data => {
    let result = [];
    let resultMap = {};
    data.map(originData => {
      if (!originData.list) return;
      originData.list.map(msg => {
        msg.origin = originData.title;
        msg.originId = originData.id;
        try {
          msg.pubTime = new Date(msg.pubDate);
        } catch(e) {
          msg.pubTime = new Date('1970/01/01');
        }
        
        msg.pubStamp = msg.pubTime - 0;
        msg.timeMap = TimeFormat.toArr(msg.pubTime);

        let dayDateStr = msg.timeMap.slice(0, 3).join('/');
        if (!resultMap[dayDateStr]) {
          resultMap[dayDateStr] = {
            date: msg.timeMap.slice(0, 3),
            timeStamp: new Date(dayDateStr) - 0,
            child: []
          }
        }
        resultMap[dayDateStr].child.push(msg);
      });
    });

    Object.keys(resultMap).map(key => {
      resultMap[key].child.sort((a, b) => {
        return b.pubStamp - a.pubStamp;
      })
      result.push(resultMap[key]);
    });
    return result.sort((a, b) => {
      return b.timeStamp - a.timeStamp;
    });
  });
}

const getArticleById = (originId, oneId) => {
  return new Promise((resolve) => {
    getById(originId).then(origin => {
      let msg = origin.list.find(item => item.oneId == oneId);
      try {
        msg.pubTime = new Date(msg.pubDate);
      } catch (e) {
        msg.pubTime = new Date('1970/01/01');
      }
      msg.timeMap = TimeFormat.toArr(msg.pubTime);
      msg.origin = origin.title;
      msg.originId = origin.id;
      resolve(msg);
    });
  });
}

const getByIdsOnlyInfo = ids => {
  return Promise.all(ids.map(id => {
    return getById(id);
  }));
}

const deleteOrigin = id => {
  return new Promise((resolve, reject) => {
    getOrigin().then(origin => {
      delete origin[id];
      wx.setStorage({
        key: 'origin',
        data: origin,
        success: () => {
          resolve(id);
        },
        fail: () => {
          reject('删除失败');
        }
      })
    }).catch(reject);
  });
}

const updateOrigin = (id, newData) => {
  return new Promise((resolve, reject) => {
    getOrigin().then(origin => {
      origin[id] = newData;
      wx.setStorage({
        key: 'origin',
        data: origin,
        success: () => {
          resolve(id);
        },
        fail: () => {
          reject('更新失败');
        }
      })
    }).catch(reject);
  });
}

const clearCacheById = (id) => {
  return new Promise((resolve, reject) => {
    getOrigin().then(origin => {
      
      origin[id].linkMap = {};
      origin[id].list = [];

      wx.setStorage({
        key: 'origin',
        data: origin,
        success: () => {
          resolve(id);
        },
        fail: () => {
          reject('清楚失败');
        }
      })
    }).catch(reject);
  });
}

const getAllOriginCacheSize = () => {
  return new Promise((resolve, reject) => {
    getOrigin().then(origin => {
      let sum = 0;
      Object.keys(origin).map(key => {
        sum += origin[key].list.length;
      });
      resolve(sum);
    }).catch(reject);
  });
}

module.exports = {
  getOrigin,
  add,
  deleteOrigin,
  updateOrigin,
  getById,
  getByIds,
  getArticleById,
  getByIdsOnlyInfo,
  clearCacheById,
  getAllOriginCacheSize
}
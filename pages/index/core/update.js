const Origin = require('./origin.js');
const Get = require('./getData.js');
// 每个来源最多存贮300条数据
const MaxLength = 300;
// 10s内只能更新一次
const UpdateTimeout = 10000;

const updateById = id => {
  return new Promise((resolve) => {
    Origin.getById(id).then(originInfo => {
      let originLink = originInfo.originLink;
      if (Date.now() - originInfo.updateTime < UpdateTimeout) {
        resolve(0);
        return;
      }
      if (!originLink) {
        resolve(0);
        return;
      }
      Get.getData(originLink).then(data => {
        let dataItemIdPrefix = Date.now() + '-' + Math.random() + '-';
        let newItems = (data.items || []).filter((item, index )=> {
          if (originInfo.linkMap[item.link]) return false;
          item.oneId = dataItemIdPrefix + index;
          originInfo.linkMap[item.link || item.oneId] = true;
          return true;
        });

        let updateSize = newItems.length;

        if (updateSize) {
          // 删除要删除的map
          originInfo.list.slice(MaxLength - updateSize).map(item => {
            delete originInfo.linkMap[item.link || item.oneId];
          });
          originInfo.list = newItems.concat(originInfo.list.slice(0, MaxLength - updateSize));
        }
        
        originInfo.updateTime = Date.now();

        Origin.updateOrigin(id, originInfo).then(() => {
          resolve(updateSize);
        }).catch(e => {
          resolve(0);
        });
        
      }).catch(() => {
        resolve(0);
      });
    }).catch(e => {
      resolve(0);
    });
  });
}

const update = (ids) => {
  let doingStep = ids.slice(0, 3);
  let needToGet = ids.slice(3);
  
  return new Promise((resolve) => {
    Promise.all(doingStep.map(id => {
      return updateById(id);
    })).then(data => {
      let sum = data.reduce((a, b) => a + b, 0);
      if (needToGet.length) {
        update(needToGet).then(sum2 => {
          resolve(sum + sum2);
        });
      } else {
        resolve(sum);
      }
    });
  });
}

module.exports = {
  update
}
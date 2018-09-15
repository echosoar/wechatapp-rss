const toArr = (dateObj) => {
  return [
    addZero(dateObj.getFullYear(), -4),
    addZero(dateObj.getMonth() + 1),
    addZero(dateObj.getDate()),
    addZero(dateObj.getHours()),
    addZero(dateObj.getMinutes()),
    addZero(dateObj.getSeconds())
  ];
}

const addZero = (str, size) => {
  return ('0' + str).slice(size || -2);
}

const toArrByStamp = (stamp) => {
  let time;
  try {
    time = new Date(stamp);
  } catch (e) {
    time = new Date('1970/01/01');
  }
  return toArr(time);
}
module.exports = {
  toArr,
  addZero,
  toArrByStamp
}
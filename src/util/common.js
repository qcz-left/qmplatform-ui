/**
 * http 响应成功
 * @param res
 * @returns {boolean}
 */
export function respSuccess(res) {
  return res.code === 200;
}

/**
 * 从对象数组中获取指定属性
 * @param array
 * @param attrName 属性名
 * @returns {[]}
 */
export function getAttrFromArray(array, attrName) {
  let attr = [];
  array.forEach(item => {
    attr.push(item[attrName]);
  })
  return attr;
}

/**
 * 通过逗号拼接字符串数组
 * @param array
 * @returns {*}
 */
export function joinMulti(array) {
  let result = "";
  let arrLen = array.length;
  for (let i = 0; i < arrLen; i++) {
    if (i > 2) {
      break;
    }
    result += "," + array[i];
  }
  return result.substring(1);
}

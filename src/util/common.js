import jwt from 'jsonwebtoken'
import {Msg} from "./constant";
import {Message} from "element-ui";

/**
 * http 响应成功
 * @param res
 * @returns {boolean}
 */
export function respSuccess(res) {
  return res.code === 200;
}

export function respMsg(res, successMsg, failMsg, successCallback, failCallback) {
  if (respSuccess(res)) {
    Message.success(res.msg || successMsg || Msg.OPERATE_SUCCESS)
    if (typeof(successCallback) == "function") {
      successCallback()
    }
  } else {
    Message.error(res.msg || failMsg || Msg.OPERATE_FAILURE)
    if (typeof(failCallback) == "function") {
      failCallback()
    }
  }
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
export function joinMulti(array, split) {
  split = split || ',';
  let result = "";
  let arrLen = array.length;
  for (let i = 0; i < arrLen; i++) {
    if (i > 2) {
      break;
    }
    result += split + array[i];
  }
  return result.substring(1);
}

export function getAuth() {
  let token = window.sessionStorage.getItem('token');
  return jwt.decode(token);
}

export function getUserName() {
  return getAuth()['sysUserName'];
}

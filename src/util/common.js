import jwt from 'jsonwebtoken'
import {Msg} from "./constant";
import {Message} from "element-ui";
import {get} from "./http";

/**
 * http 响应成功
 * @param res
 * @returns {boolean}
 */
export function respSuccess(res) {
  return res.code === 200 || res.code === 201;
}

export function respMsg(res, successMsg, failMsg, successCallback, failCallback) {
  if (respSuccess(res)) {
    Message.success(res.msg || successMsg || Msg.OPERATE_SUCCESS)
    if (typeof (successCallback) == "function") {
      successCallback()
    }
  } else {
    Message.error(res.msg || failMsg || Msg.OPERATE_FAILURE)
    if (typeof (failCallback) == "function") {
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

/**
 * 获取解析的token载荷信息
 * @returns {null|{payload: *, signature: *, header: *}}
 */
export function getAuth() {
  let token = window.sessionStorage.getItem('token');
  return jwt.decode(token);
}

/**
 * 获取登录用户名称
 * @returns {*}
 */
export function getUserName() {
  return getAuth()['sysUserName'];
}

/**
 * 获取所有权限码
 * @returns {any[]}
 */
export function getAuthorities() {
  let authorities = window.sessionStorage.getItem('authorities');
  if (!authorities) {
    authorities = getAuth()['authorities'];
    window.sessionStorage.setItem('authorities', authorities);
  }
  return authorities || [];
}

/**
 * 是否有该权限
 * @param code
 * @returns {boolean}
 */
export function hasAuthority(code) {
  return getAuthorities().includes(code);
}

/**
 * 刷新token
 */
export async function refreshToken() {
  let res = await get('/oauth2/refreshToken', {
    refreshToken: window.sessionStorage.getItem('refreshToken')
  })
  window.sessionStorage.removeItem('authorities');
  window.sessionStorage.setItem('token', res.data.accessToken);
  window.sessionStorage.setItem('refreshToken', res.data.refreshToken);
}

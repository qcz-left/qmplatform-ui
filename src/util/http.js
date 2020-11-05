import axios from 'axios'
import Vue from "vue"
import {refreshToken} from "./common"

axios.defaults.baseURL = '/api'
Vue.prototype.$axios = axios

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 在最后必须 return config
  return config
});

axios.interceptors.response.use(response => {
  let statusCode = response.data.code;
  if (statusCode === 201) {
    // 快过期了，续期token
    refreshToken().then(r => {

    })
  }
  if (statusCode === 401) {
    redirectLogin();
  }
  return response;
}, error => {
  if (error.response.status === 401) {
    redirectLogin();
  }
});

/**
 * token过期，重定向到登录页面
 */
export function redirectLogin() {
  window.sessionStorage.removeItem('token');
  window.sessionStorage.removeItem('refreshToken');
  window.sessionStorage.removeItem('authorities');
  window.location.href = '/';
  return;
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, JSON.stringify(params), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data)
    })
  });
}

export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, JSON.stringify(params), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data)
    })
  });
}

export function patch(url, params) {
  return new Promise((resolve, reject) => {
    axios.patch(url, JSON.stringify(params), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data)
    })
  });
}

export function del(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

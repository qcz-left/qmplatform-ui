import {Loading} from 'element-ui';

export function showLoading(msg) {
  return Loading.service({
    lock: true,
    text: msg || '正在操作，请稍等...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.8)'
  });
}

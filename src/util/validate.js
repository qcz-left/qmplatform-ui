// 手机号验证
export function validPhone(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (!isValidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
// 邮箱验证
export function validEmail(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入邮箱'))
  } else if (!isValidEmail(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

function isValidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}

function isValidEmail(str) {
  const reg = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/
  return reg.test(str)
}

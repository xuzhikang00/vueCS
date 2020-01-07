import http from './httpUrl.js'
export const userLogin = (params) => {
  return http.fetchPost('/member/login', params)
}
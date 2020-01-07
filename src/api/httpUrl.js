import axios from 'axios'
import router from '@/router/index'
import {
  Loading,
  Message
} from 'element-ui';
import qs from "qs"; //

let loading =
  'https://www.baidu.com/s?wd=qs&rsv_spt=1&rsv_iqid=0x95f1dc7600015202&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1&rsv_dl=tb&inputT=1203&rsv_t=900bX5pYqb%2BuyjrjlC5QirkfWvgc4EAQErXix4407A7E%2BPPTzg2%2BNWYEqUTWtZEjzDWF&gpc=stf%3D1546828715%2C1578364715%7Cstftype%3D1&tfflag=1'
loading = qs.parse(loading)
console.log(loading)
const service = axios.create({
  baseURL: process.env.url_api, // api的base_url
  crossDomain: true, //设置cross跨域
  withCredentials: true, //设置cross跨域 并设置访问权限 允许跨域携带cookie信息
  timeout: 5000 // 请求超时时间
});
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 发起请求前
let loadingInstance = null;
// 状态码错误信息
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};


// 添加请求拦截器
service.interceptors.request.use(

  (config) => {
    // 默认开启loading
    if (!config.LOADINGHIDE) {
      loadingInstance = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
    if (config.method.toUpperCase() !== "GET") {
      config.data = qs.stringify(config.data);
    }
    return config
  },
  (error) => {
    Message({
      showClose: true,
      message: '加载超时',
      type: 'warning'
    })
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // loading close...
    loadingInstance && loadingInstance.close();
    return response
  },
  (error) => {
    // loading close...
    loadingInstance && loadingInstance.close();
    if (error) {
      // 请求配置发生的错误
      if (!error.response) {
        return console.log('Error', error.message);
      }
      // 获取状态码
      const status = error.response.status;
      const errortext = codeMessage[status] || error.response.statusText;

      // 提示错误信息
      Message({
        showClose: true,
        message: errortext,
        type: 'error'
      })
      // 错误状态处理
      if (status === 401) {
        router.push('/login')
      } else if (status === 403) {
        router.push('/login')
      } else if (status >= 404 && status < 422) {
        router.push('/404')
      }
    }
    return Promise.reject(error);
  }
)

export default {
  fetchGet(url, params = {}) {
    return new Promise((resolve, reject) => {
      service.get(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchPost(url, params = {}) {
    return new Promise((resolve, reject) => {
      service.post(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

// export default class Axios {
//   axios(method, url, params, config) {
//     return new Promise((resolve, reject) => {
//       if (typeof params !== "object") params = {};
//       let _option = Object.assign({
//           method,
//           url,
//           baseURL: envconfig.baseURL,
//           timeout: 10000,
//           headers: {}
//           // withCredentials: true, //是否携带cookies发起请求
//         },
//         config
//       );
//       // 添加token 
//       _option.headers = {
//         ..._option.headers,
//         'authorization': 'Bearer ' + store.getters.token
//       }
//       // 处理get、post传参问题
//       method.toUpperCase() !== "GET" ?
//         (_option.data = params) :
//         (_option.params = params);

//       // 请求成功后服务器返回二次处理
//       axiosInstance.request(_option).then(
//         res => {
//           resolve(res.data);
//         },
//         error => {
//           if (error.response) {
//             reject(error.response.data);
//           } else {
//             reject(error);
//           }
//         }
//       );
//     });
//   }
// }

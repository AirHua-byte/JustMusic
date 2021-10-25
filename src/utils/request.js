import axios from 'axios';
// import { getCookie } from '@/utils/auth'

let baseURL = '';

const service = axios.create({
  baseURL,
  // 跨域请求时是否需要使用凭证,是否携带cookie
  withCredentials: true,
  timeout: 15000,
});

// 请求拦截器（在请求之前进行一些配置）
service.interceptors.request.use(function (config) {
  if(!config.params) config.params = {};

  const proxy = JSON.parse(localStorage.getItem('settings')).proxyConfig;
  if(['HTTP', 'HTTPS'].includes(proxy.protocol)) {
    config.params.proxy = `${proxy.protocol}://${proxy.server}:${proxy.port}`;
  }

  return config;
})

// 响应了拦截器（在响应之后对数据进行一些处理）
service.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
import axios from 'axios';
import { getCookie } from '@/utils/auth'

let baseURL = '';

const service = axios.create({
  baseURL,
  // 跨域请求时是否需要使用凭证
  withCredentials: true,
  timeout: 15000,
});
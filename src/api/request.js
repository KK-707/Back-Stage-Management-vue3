import axios from "axios";
import config from "../config";
import { ElMessage } from "element-plus"; // 网络提示

const NETWORK_ERROR = "网络请求异常,请稍后尝试";
// 创建一个axios实例对象
const service = axios.create({
  baseURL: config.baseApi,
});

// 在请求之前做一些事情
service.interceptors.request.use((req) => {
  // 可以自定义header
  // jwt-token认证的时候
  return req;
});

// 在请求之后做一些事情
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data;
  // 根据后端 协商 视情况而定
  if (code == 200) {
    return data;
  } else {
    // 网络请求错误,返回错误信息或自定义信息
    ElMessage.error(msg || NETWORK_ERROR);
    return Promise.reject(msg || NETWORK_ERROR);
  }
});

// 封装的核心函数
function request(options) {
  // {}
  // {
  //     method:'get',
  //     data:{

  //     }
  // }
  options.method = options.method || "get";
  if (options.method.toLowerCase() == "get") {
    options.params = options.data;
  }
  // 对mock的处理
  let isMock = config.mock;
  if (typeof options.mock !== "undefined") {
    isMock = options.mock;
  }
  // 对线上环境做处理,线上不使用mock
  if (config.env == "prod") {
    // 如果线上环境,不给你用到mock的机会
    service.defaults.baseURL = config.baseApi;
  } else {
    // 根据是否开启isMock选择mockApi或baseApi
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }
  return service(options);
}

export default request;

import axios from "axios";
import { Message } from "element-ui";

const http = axios.create({
  timeout: 5000, // 请求超时时间
  baseURL:
    process.env.NODE_ENV === "development" ? "http://26274230uh.51vip.biz" : "",
  withCredentials: true
});
http.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

// 响应拦截器

http.interceptors.response.use(
  response => {
    return +response.data.status === 200
      ? Promise.resolve(response.data)
      : Promise.reject(response.data);
  },
  error => {
    const { response } = error;
    Message.error(ErrorMsgMap.get(response.status) || response.data.msg);
    return Promise.reject(error);
  }
);

// 错误提示信息

const ErrorMsgMap = new Map([
  [403, "登录过期，请重新登录"],
  [404, "请求的资源不存在"],
  [405, "请求方式错误"],
  [500, "服务端错误"]
]);

export default http;

// 环境配置文件，一般在企业级有三个环境
// 开发环境，测试环境，线上环境

// 当前的环境
const env = import.meta.env.MODE || "prod";

// 三种环境对应不同的api
const EnvConfig = {
  development: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/c4db4516e0866d5117d696824ed6bb56/api",
  },
  test: {
    baseApi: "//test.future.com/api",
    mockApi:
      "https://www.fastmock.site/mock/c4db4516e0866d5117d696824ed6bb56/api",
  },
  pro: {
    baseApi: "//future.com/api",
    mockApi:
      "https://www.fastmock.site/mock/c4db4516e0866d5117d696824ed6bb56/api",
  },
};

export default {
  env,
  // mock总开关
  mock: true,
  ...EnvConfig[env], // 解构
};

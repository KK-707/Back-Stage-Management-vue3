<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/images/user.png" alt="" />
          <div class="userInfo">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <div class="loginInfo">
          <p>上次登录时间<span>2023-5-26</span></p>
          <p>上次登录地点<span>佛山</span></p>
        </div>
      </el-card>
      <el-card shadow="hover" style="margin-top: 20px" height="450px">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          :body-style="{ display: 'flex', padding: 0 }"
          v-for="item in countData"
          :key="item.name"
        >
          <component
            class="icons"
            :is="item.icon"
            :style="{ background: item.color }"
          ></component>
          <div class="detail">
            <p class="num">${{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 折线图 -->
      <el-card style="height: 280px">
        <div ref="echart" style="height: 280px"></div>
      </el-card>
      <!-- 柱状图和饼状图 -->
      <div class="graph">
        <el-card style="height: 260px">
          <div ref="userechart" style="height: 240px"></div>
        </el-card>
        <el-card style="height: 260px">
          <div ref="videoechart" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
  reactive,
} from "vue";
import * as echarts from "echarts";
import axios from "axios";
export default defineComponent({
  setup() {
    // getCurrentInstance() 函数用于获取当前组件实例
    // 使用 {proxy} = getCurrentInstance() 来获取 proxy 代理对象
    const { proxy } = getCurrentInstance();
    let tableData = ref([]);
    let countData = ref([]);
    const tableLabel = {
      name: "品牌",
      todayBuy: "今日购买",
      monthBuy: "本月购买",
      totalBuy: "总购买",
    };
    // 获取首页table数据
    const getTableList = async () => {
      //   await axios
      //     .get(
      //       "https://www.fastmock.site/mock/c4db4516e0866d5117d696824ed6bb56/api/home/getTableData"
      //     )
      //     .then((res) => {
      //       console.log(res);
      //       if (res.data.code == 200) {
      //         tableData.value = res.data.data;
      //       }
      //     });
      let res = await proxy.$api.getTableData();
      tableData.value = res;
    };
    // 获取首页count数据
    const getCountData = async () => {
      let res = await proxy.$api.getCountData();
      countData.value = res;
    };

    // 关于echarts 表格的渲染部分
    // 折线图和柱状图的echarts配置
    let xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
    });
    // 饼状图的echarts配置
    let pieOptions = reactive({
      tooltip: {
        trigger: "item",
      },
      color: [
        "#0f78f4",
        "#dd536b",
        "#9462e5",
        "#a6a6a6",
        "#e1bb22",
        "#39c362",
        "#3ed1cf",
      ],
      series: [],
    });
    // 折线图
    let orderData = reactive({
      xData: [],
      series: [],
    });
    // 柱状图
    let userData = reactive({
      xData: [],
      series: [],
    });
    // 饼状图
    let videoData = reactive({
      series: [],
    });

    const getChartData = async () => {
      let result = await proxy.$api.getChartData();
      // console.log(result);
      // 分别对应三个图表
      let res = result.orderData;
      let userRes = result.userData;
      let videoRes = result.videoData;

      // 折线图进行渲染的过程
      orderData.xData = res.date;
      const keyArray = Object.keys(res.data[0]);
      const series = [];
      keyArray.forEach((key) => {
        series.push({
          name: key,
          data: res.data.map((item) => item[key]),
          type: "line",
        });
      });
      orderData.series = series;
      xOptions.xAxis.data = orderData.xData;
      xOptions.series = orderData.series;
      let hEcharts = echarts.init(proxy.$refs["echart"]);
      hEcharts.setOption(xOptions); // setOption 方法用于设置图表的配置项和数据

      // 柱状图进行渲染的过程
      userData.xData = userRes.map((item) => item.date);
      userData.series = [
        {
          name: "新增用户",
          data: userRes.map((item) => item.new),
          type: "bar",
        },
        {
          name: "活跃用户",
          data: userRes.map((item) => item.active),
          type: "bar",
        },
      ];
      xOptions.xAxis.data = userData.xData;
      xOptions.series = userData.series;
      let uEcharts = echarts.init(proxy.$refs["userechart"]);
      uEcharts.setOption(xOptions);

      // 饼状图进行渲染的过程
      videoData.series = [
        {
          data: videoRes,
          type: "pie",
        },
      ];
      pieOptions.series = videoData.series;
      let vEcharts = echarts.init(proxy.$refs["videoechart"]);
      vEcharts.setOption(pieOptions);
    };

    onMounted(() => {
      getTableList();
      // 获取count数据
      getCountData();
      // 获取echarts表格数据
      getChartData();
    });

    return {
      tableData,
      tableLabel,
      countData,
    };
  },
});
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
  }
  .loginInfo {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    // 弹性容器主轴对齐,space-between 值表示两端对齐，项目之间的间隔都相等
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      // 子元素按列排布（竖向排布）
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 30px;
        margin-bottom: 30px;
      }
      .txt {
        font-size: 14px;
        text-align: center;
        color: #999;
      }
    }
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
    }
  }
}
</style>

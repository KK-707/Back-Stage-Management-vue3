<template>
  <!-- 搜索按钮 -->
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">+新增</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input v-model="formInline.keyword" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 表格 -->
  <div class="table">
    <el-table :data="list" style="width: 100%" height="500px">
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 125"
      />
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :total="config.total"
      @current-change="changePage"
      class="pager mt-4"
    />
  </div>
  <!-- 新增按钮或编辑按钮 -->
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
    <el-form :inline="true" :model="formUser" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="姓名"
            prop="name"
            :rules="[
              {
                required: true,
                message: '姓名是必填项',
              },
            ]"
          >
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="年龄"
            prop="age"
            :rules="[
              {
                required: true,
                message: '年龄是必填项',
              },
              {
                type: 'number',
                message: '年龄是必须是数字',
              },
            ]"
          >
            <el-input
              v-model.number="formUser.age"
              placeholder="请输入年龄"
            /> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="性别"
            prop="sex"
            :rules="[
              {
                required: true,
                message: '性别是必选项',
              },
            ]"
          >
            <el-select v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="出生日期"
            prop="birth"
            :rules="[
              {
                required: true,
                message: '出生日期是必选项',
              },
            ]"
          >
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              label="出生日期"
              placeholder="请输入"
              style="width: 100%"
            /> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="地址"
          prop="addr"
          :rules="[
            {
              required: true,
              message: '地址是必填项',
            },
          ]"
        >
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确定
        </el-button>
      </span>
    </template> -->
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
  reactive,
} from "vue";

export default defineComponent({
  setup() {
    // 获取当前组件实例，proxy是该实例的属性
    const { proxy } = getCurrentInstance();
    // 实现响应式
    const list = ref([]);
    const tableLabel = reactive([
      {
        prop: "name",
        label: "姓名",
      },
      {
        prop: "age",
        label: "年龄",
      },
      {
        prop: "sexLabel",
        label: "性别",
      },
      {
        prop: "birth",
        label: "出生日期",
        width: 200,
      },
      {
        prop: "addr",
        label: "地址",
        width: 320,
      },
    ]);
    onMounted(() => {
      getUserData(config);
    });
    const config = reactive({
      total: 0,
      page: 1, // 当前页
      name: "", // 传递的搜索值
    });
    // 获取table表格
    const getUserData = async (config) => {
      let res = await proxy.$api.getUserData(config);
      // console.log(res);
      config.total = res.count; // 覆盖当前页数
      // list.value = res.list;
      list.value = res.list.map((item) => {
        // 这段代码的作用是根据 item.sex 的值来设置 item.sexLabel 的值
        item.sexLabel = item.sex === 0 ? "女" : "男";
        return item;
      });
    };
    // 切换页
    const changePage = (page) => {
      console.log(page); // 获取点击页数的坐标
      config.page = page;
      getUserData(config);
    };
    const formInline = reactive({
      keyword: "",
    });
    // 搜索用户
    const handleSearch = () => {
      config.name = formInline.keyword;
      getUserData(config);
    };
    // 控制模态框的显示隐藏
    const dialogVisible = ref(false);
    // 弹出框的叉
    const handleClose = (done) => {
      ElMessageBox.confirm("你确定关闭吗？")
        .then(() => {
          dialogVisible.value = false; // 隐藏框
          proxy.$refs.userForm.resetFields(); // 重置数据
        })
        .catch(() => {
          // catch error
        });
    };
    // 添加用户的form数据
    const formUser = reactive({
      name: "", // 添加用户的姓名
      age: "",
      sex: "",
      birth: "",
      addr: "",
    });
    // 处理日期格式
    const timeFormat = (time) => {
      var time = new Date(time);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      function add(m) {
        return m < 10 ? "0" + m : m;
      }
      return year + "-" + add(month) + "-" + add(date);
    };
    // 添加完用户后的确定
    const onSubmit = () => {
      proxy.$refs.userForm.validate(async (valid) => {
        if (valid) {
          // 新增的接口
          if (action.value == "add") {
            formUser.birth = timeFormat(formUser.birth); // 日期格式替换
            let res = await proxy.$api.addUser(formUser);
            console.log(res);
            // 重置框
            if (res) {
              dialogVisible.value = false; // 隐藏框
              proxy.$refs.userForm.resetFields(); // 重置数据
              getUserData(config); // 调用自定义getUserData获取模拟数据
            }
          } else {
            // 编辑的接口
            // console.log(formUser);
            formUser.sex == "男" ? (formUser.sex = 1) : (formUser.sex = 0);
            let res = await proxy.$api.editUser(formUser);
            // 重置框
            if (res) {
              dialogVisible.value = false; // 隐藏框
              proxy.$refs.userForm.resetFields(); // 重置数据
              getUserData(config); // 调用自定义getUserData获取模拟数据
            }
          }
        } else {
          ElMessage({
            showClose: true,
            message: "请输入正确的内容",
            type: "error",
          });
        }
      });
    };
    // 弹出框的取消按钮
    const handleCancel = () => {
      dialogVisible.value = false; // 隐藏框
      proxy.$refs.userForm.resetFields(); // 重置数据
    };
    // 区分编辑和新增
    const action = ref("add");
    // 编辑用户
    const handleEdit = (row) => {
      // console.log(row);
      action.value = "edit";
      dialogVisible.value = true;
      row.sex == 1 ? (row.sex = "男") : (row.sex = "女");
      proxy.$nextTick(() => {
        Object.assign(formUser, row); // 浅拷贝
      });
    };
    // 新增用户
    const handleAdd = () => {
      action.value = "add";
      dialogVisible.value = true;
    };
    // 删除用户
    const handleDelete = (row) => {
      ElMessageBox.confirm("你确定删除吗？")
        .then(async () => {
          dialogVisible.value = false; // 隐藏框
          await proxy.$api.deleteUser({ id: row.id });
          ElMessage({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
          getUserData(config); // 调用自定义getUserData获取模拟数据
        })
        .catch(() => {
          // catch error
        });
    };

    return {
      list,
      tableLabel,
      config,
      changePage,
      formInline,
      handleSearch,
      dialogVisible,
      handleClose,
      formUser,
      onSubmit,
      handleCancel,
      handleEdit,
      handleAdd,
      action,
      handleDelete,
    };
  },
});
</script>

<style lang="less" scoped>
.table {
  position: relative;
  height: 520px;
  .pager {
    position: absolute;
    right: 0;
    bottom: -20px;
  }
}
.user-header {
  display: flex;
  justify-content: space-between;
}
</style>

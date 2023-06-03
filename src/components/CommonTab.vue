<template>
  <div class="tags">
    <el-tag
      :key="tag.name"
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      @click="changeMenu(tag)"
      @close="handleClose(tag, index)"
      >{{ tag.label }}</el-tag
    >
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const router = useRouter(); // 用于切换路由（编程式导航）
    const route = useRoute(); // 用于访问当前路由的信息（如路径、参数）
    const tags = store.state.tabsList;
    const changeMenu = (item) => {
      router.push({ name: item.name });
    };
    const handleClose = (tag, index) => {
      // 为了下标一致性
      let length = tags.length - 1;
      // 处理vuex中的tabsList
      store.commit("closeTab", tag);
      // 做第一个判断：当前所在路由route不等于即将点击删除路由tag
      if (tag.name !== route.name) {
        return;
      }
      // 做第二个判断：当前所在是最末的一个
      if (index === length) {
        router.push({
          name: tags[index - 1].name,
        });
      } else {
        // 做第三个判断：当前所在处于中间
        router.push({
          name: tags[index].name,
        });
      }
    };
    return { tags, changeMenu, handleClose };
  },
};
</script>

<style lang="less" scoped>
.tags {
  padding: 20px;
  width: 100%;
  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>

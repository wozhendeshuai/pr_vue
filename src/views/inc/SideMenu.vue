<template>
  <el-menu
      :default-active="this.$store.state.menus.editableTabsValue"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
  >
    <router-link to="/index">
      <el-menu-item
          index="Index"
          @click="selectMenu({ name: 'Index', title: '首页' })"
      >
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </template>
      </el-menu-item>
    </router-link>

    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-s-operation"></i>
        <span>项目管理</span>
      </template>
      <router-link to="/project/repo">
        <el-menu-item
            index="projectRepo"
            @click="selectMenu({ name: 'projectRepo', title: '项目大盘' })"
        >
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span slot="title">项目大盘</span>
          </template>
        </el-menu-item>
      </router-link>

      <el-menu-item index="1-2">
        <template slot="title">
          <i class="el-icon-rank"></i> <span slot="title">团队管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="1-3">
        <template slot="title">
          <i class="el-icon-menu"></i> <span slot="title">用户画像</span>
        </template>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-s-tools"></i> <span>Pull-Request</span>
      </template>
      <el-menu-item index="2-1">
        <template slot="title">
          <i class="el-icon-s-order"></i> <span slot="title">PR排序列表</span>
        </template>
      </el-menu-item>
      <el-menu-item index="2-2">
        <template slot="title">
          <i class="el-icon-s-order"></i> <span slot="title">排序模型管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="2-3">
        <template slot="title">
          <i class="el-icon-s-order"></i> <span slot="title">查看PR详情</span>
        </template>
      </el-menu-item>
      <el-menu-item index="2-4">
        <template slot="title">
          <i class="el-icon-s-order"></i> <span slot="title">评审PR</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "SideMenu",
  data() {
    return {};
  },
  computed: {
    menuList: {
      get() {
        return this.$store.state.menus.menuList;
      },
    },
  },
  methods: {
    selectMenu(item) {
      this.$store.commit("addTab", item);
    },
  },
};
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
}
</style>

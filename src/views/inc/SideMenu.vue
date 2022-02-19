<template>
  <el-menu
      :default-active="this.$store.state.menus.editableTabsValue"
      class="el-menu-vertical-demo"
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
      <router-link to="/project/team">
        <el-menu-item index="projectTeam"
                      @click="selectMenu({ name: 'projectTeam', title: '团队管理' })">
          <template slot="title">
            <i class="el-icon-rank"></i> <span slot="title">团队管理</span>
          </template>
        </el-menu-item>
      </router-link>

      <router-link to="/project/user">
        <el-menu-item index="projectUser"
                      @click="selectMenu({ name: 'projectUser', title: '用户画像' })">
          <template slot="title">
            <i class="el-icon-menu"></i> <span slot="title">用户画像</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-s-tools"></i> <span>Pull-Request</span>
      </template>

      <router-link to="/pr/list">
        <el-menu-item index="prList"
                      @click="selectMenu({ name: 'prList', title: 'PR排序列表' })">
          <template slot="title">
            <i class="el-icon-s-order"></i> <span slot="title">PR排序列表</span>
          </template>
        </el-menu-item>
      </router-link>
      <router-link to="/pr/model">
        <el-menu-item index="prModel"
                      @click="selectMenu({ name: 'prModel', title: '排序模型管理' })">
          <template slot="title">
            <i class="el-icon-s-order"></i> <span slot="title">排序模型管理</span>
          </template>
        </el-menu-item>
      </router-link>
      <router-link to="/pr/detail">
        <el-menu-item index="prDetail"
                      @click="selectMenu({ name: 'prDetail', title: '查看PR详情' })">
          <template slot="title">
            <i class="el-icon-s-order"></i> <span slot="title">查看PR详情</span>
          </template>
        </el-menu-item>
      </router-link>
      <router-link to="/pr/review">
        <el-menu-item index="prReview"
                      @click="selectMenu({ name: 'prReview', title: '评审PR' })">
          <template slot="title">
            <i class="el-icon-s-order"></i> <span slot="title">评审PR</span>
          </template>
        </el-menu-item>
      </router-link>
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
  text-underline: none;
}
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>

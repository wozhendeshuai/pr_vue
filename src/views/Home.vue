<template>
  <el-container>
    <el-aside width="200px">

      <SideMenu></SideMenu>

    </el-aside>
    <el-container>
      <el-header>
        <strong>Pull-Request(PR)优先级排序工具</strong>

        <div class="header-avatar">

          <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>

          <el-dropdown>
						<span class="el-dropdown-link">
						{{ userInfo.userName }}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{name: 'UserCenter'}">个人中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>

      </el-header>
      <el-main>
        <Tabs></Tabs>
        <div style="margin: 0 15px;">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "./inc/SideMenu";
import Tabs from "./inc/Tabs";

export default {
  name: "Home",
  components: {
    SideMenu, Tabs
  },
  data() {
    return {
      userInfo: {
        email: "",
        githubToken: "",
        password: "12345678",
        userId: "",
        userName: "",
        userRoleInTeam: ""
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/project/user/userInfo?userName=" + localStorage.getItem("token")).then(res => {
        console.log(res)
        this.userInfo = res.data.data

      })
    },
    logout() {
      localStorage.clear()
      sessionStorage.clear()

      this.$store.commit("resetState")

      this.$router.push("/login")
      // this.$axios.post("/logout").then(res => {
      //   localStorage.clear()
      //   sessionStorage.clear()
      //
      //   this.$store.commit("resetState")
      //
      //   this.$router.push("/login")
      // })
    }
  }
}
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}

.header-avatar {
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-header {
  background-color: #7491ec;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #8abbef;
  color: #333;
  line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0;
}

a {
  text-decoration: none;
}
</style>
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:403px;">
          <div class="user-info">
            <img src="../../assets/devopsLogo.png" class="user-avator" alt/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>2019-11-01</span>
          </div>
          <div class="user-info-list">
            用户角色列表：
            <span>东莞</span>
          </div>
        </el-card>

      </el-col>
      <el-col :span="16">
        <el-card shadow="hover" style="height:403px;">
          <div slot="header" class="clearfix">
            <span>项目列表</span>
            <el-button style="float: right; padding: 5px 10px" type="primary">添加项目</el-button>
          </div>
          <el-table border :data="userRepoList" style="width:100%;" height="390">
            <el-table-column
                prop="userName"
                label="项目名称"
            >
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
            >
              <template slot-scope="scope">
                <el-button @click="isUpdatePower(scope.row)" type="primary" size="small">查看详情</el-button>
                <el-button @click="handleClick(scope.row)" type="warning" size="small">手动同步</el-button>
                <el-button @click="isUpdatePower(scope.row)" type="danger" size="small">定时任务</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" style="height:252px;">
          <div slot="header" class="clearfix">
            <span>语言详情</span>
          </div>
          Vue
          <el-progress :percentage="71.3" color="#42b983"></el-progress>
          JavaScript
          <el-progress :percentage="24.1" color="#f1e05a"></el-progress>
          CSS
          <el-progress :percentage="13.7"></el-progress>
          HTML
          <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">1234</div>
                  <div>用户数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-upload grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">321</div>
                  <div>提交次数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-order grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">5000</div>
                  <div>开放状态PR</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-card v-if="repoUserOptions.datasets.length!=0" shadow="hover">
        <schart ref="line" class="schart" canvasId="bar" :options="repoUserOptions"></schart>
      </el-card>
      <el-card v-if="repoCommitOptions.datasets.length!=0" shadow="hover">
        <schart ref="line" class="schart" canvasId="bar"
                :options="repoCommitOptions"></schart>
      </el-card>
      <el-card v-if="repoOpenPROptions.datasets.length!=0" shadow="hover">
        <schart ref="line" class="schart" canvasId="bar"
                :options="repoOpenPROptions"></schart>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import Schart from 'vue-schart';

export default {
  name: 'dashboard',
  data() {
    return {
      userName: localStorage.getItem('token'),
      //存储用户仓库对象
      userRepoList: [],
      repoBaseEntity: {},
      repoDayEntity: {},
      userLanguage: [],

      repoUserOptions: {
        type: 'line',
        title: {
          text: '最近一月项目用户变化'
        },
        xRorate: 25,
        labels: ['周一', '周二', '周三', '周四', '周五'],
        datasets: [
          {
            label: '家电',
            data: [234, 278, 270, 190, 230]
          },
        ]
      },
      repoCommitOptions: {
        type: 'line',
        title: {
          text: '最近一月提交次数变化'
        },
        xRorate: 25,
        labels: ['周一', '周二', '周三', '周四', '周五'],
        datasets: [
          {
            label: '家电',
            data: [234, 278, 270, 190, 230]
          },
        ]
      },
      repoOpenPROptions: {
        type: 'line',
        title: {
          text: '最近一月开放PR变化'
        },
        xRorate: 25,
        labels: ['周一', '周二', '周三', '周四', '周五'],
        datasets: [
          {
            label: '家电',
            data: [234, 278, 270, 190, 230]
          },
        ]
      },
    };
  },
  components: {
    Schart
  },
  computed: {
    role() {
      return this.name === 'admin' ? '超级管理员' : '普通用户';
    }
  },
  // created() {
  //     this.handleListener();
  //     this.changeDate();
  // },
  // activated() {
  //     this.handleListener();
  // },
  // deactivated() {
  //     window.removeEventListener('resize', this.renderChart);
  //     bus.$off('collapse', this.handleBus);
  // },
  methods: {
    changeDate() {
      const now = new Date().getTime();
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000);
        item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      });
    },
    getUserRepoList() {

    },
    getRepoBaseEntity(val) {

    },
    getRepoDayEntity(val) {

    },
    setRepoUserOptions(val) {

    },
    setRepoCommitOptions(val) {

    },
    setRepoOpenPROptions(val) {

    },

  }
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>

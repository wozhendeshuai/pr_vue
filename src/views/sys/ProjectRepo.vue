<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:403px;">
          <div class="user-info">
            <img src="../../assets/devopsLogo.png" class="user-avator" alt/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ userName }}</div>
              <div></div>
            </div>
          </div>
          <div class="user-info-list">
            登录时间：
            <span>2022-2-25</span>
          </div>
          <div class="user-info-list">
            用户操作记录：
            <span>2022-2-25 手动同步tajo数据</span>
          </div>
        </el-card>

      </el-col>
      <el-col :span="16">
        <el-card shadow="hover" style="height:403px;">
          <div slot="header" class="clearfix">
            <span>项目列表</span>
            <el-button @click="toAddRepo()" style="float: right; padding: 5px 10px" type="primary">添加项目</el-button>
          </div>
          <el-table border :data="userRepoList" style="width:100%;" height="390">
            <el-table-column
                prop="repoName"
                label="项目名称"
            >
            </el-table-column>
            <el-table-column
                prop="teamName"
                label="团队名称"
            >

            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
            >
              <template slot-scope="scope">
                <el-button @click="getRepoDate(scope.row)" type="primary" size="small">查看详情</el-button>
                <el-button @click="handleSynData(scope.row)" type="warning" size="small">手动同步</el-button>
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

          <div id="chart" style="float:left;width:100%;height: 252px"></div>

        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ newRepoDayEntity.contributorNum }}</div>
                  <div>贡献成员数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-view grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ newRepoDayEntity.starsNum }}</div>
                  <div>star数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-order grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ newRepoDayEntity.watchersNum }}</div>
                  <div>设置邮件提醒数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-bottom-right grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ newRepoDayEntity.forksNum }}</div>
                  <div>分支数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}" @click.native="setRepoOpenPROptions()">
              <div class="grid-content grid-con-1">
                <i class="el-icon-document grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ newRepoDayEntity.openPrNum }}</div>
                  <div>当前处于打开状态PR数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-document grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ repoBaseEntity.teamName }}</div>
                  <div>所属团队</div>
                </div>
              </div>
            </el-card>
          </el-col>

        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-card shadow="hover">
        <div id="lineChart" style="float:left;width:100%;height: 252px"></div>
      </el-card>
    </el-row>
    <el-dialog
        title="添加项目"
        :visible.sync="isAddRepo"
        width="60%"
        center>
      <el-row align="center">
        <el-form :model="synDataForm" ref="loginForm" label-width="80px">
          <el-form-item label="项目名称: " prop="repoName" style="width: 390px;">
            <el-input v-model="synDataForm.repoName"></el-input>
          </el-form-item>
          <el-form-item label="团队名称: " prop="teamName" style="width: 390px;">
            <el-input v-model="synDataForm.teamName"></el-input>
          </el-form-item>
          <el-form-item label="PR编号：" prop="maxPRNum" style="width: 390px;">
            <el-input v-model="synDataForm.maxPRNum"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <el-button type="danger" @click="isAddRepo = false">取 消</el-button>
      <el-button type="primary" @click="addRepo()">确 定</el-button>

    </el-dialog>
    <el-dialog
        title="手动同步项目数据"
        :visible.sync="isSynData"
        width="60%"
        center>
      <el-row align="center">
        <el-form :model="synDataForm" ref="loginForm" label-width="80px">
          <el-form-item label="项目名称: " prop="repoName" style="width: 390px;" v-model="synDataForm.repoName">
            {{ choiceRepoName }}
          </el-form-item>
          <el-form-item label="团队名称: " prop="teamName" style="width: 390px;" v-model="synDataForm.teamName">
            {{ choiceTeamName }}
          </el-form-item>
          <el-form-item label="PR编号：" prop="maxPRNum" style="width: 390px;">
            <el-input v-model="synDataForm.maxPRNum"></el-input>
          </el-form-item>

        </el-form>
      </el-row>
      <el-button type="danger" @click="isSynData = false">取 消</el-button>
      <el-button type="primary" @click="trueSynData()">确 定</el-button>

    </el-dialog>
  </div>
</template>

<script>
import Schart from 'vue-schart';
import * as echarts from "echarts";

export default {
  name: 'dashboard',
  data() {
    return {
      isAddRepo: false,
      synDataForm: {
        repoName: '',
        teamName: '',
        maxPRNum: 0,
      },
      choiceRepoName: '',
      choiceTeamName: '',
      userName: localStorage.getItem('token'),
      //存储用户仓库对象
      userRepoList: [],
      repoBaseEntity: {},
      repoDayEntityList: [],
      newRepoDayEntity: {},
      languages: {},
      isSynData: false,
      repoUserOptions: {
        title: {
          text: '项目贡献者变化情况',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'line',
            stack: 'Total',

          }
        ]
      },


      myChart: null, // 定义变量用来存放echarts实例
      languageOption: {
        title: {
          text: '项目所用语言情况',

          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left'
        // },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
    };
  },
  components: {
    Schart
  },

  created() {
    this.$axios.get("/project/repo/userProject?userName=" + localStorage.getItem("token")).then(res => {
      console.log("res.data.data")
      console.log(res.data.data)
      this.userRepoList = res.data.data
      this.userName = localStorage.getItem("token")
    })
  },
  //调用
  mounted() {
    // 第二步，在页面加载渲染的时候执行echarts画图方法
    this.drawEcharts();

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
    addRepo() {
      console.log(this.synDataForm)

      console.log("传过去的参数是：")

      console.log(this.synDataForm)

      this.$axios.get('/project/repo/addNewRepo?userName=' + this.userName
          + '&repoName=' + this.synDataForm.repoName
          + '&ownerName=' + this.synDataForm.teamName
          + '&maxPRNum=' + this.synDataForm.maxPRNum)
          .then(res => {
            alert(res.data.data)
          })
      this.isAddRepo = false
    },
    toAddRepo() {
      this.isAddRepo = true
    },
    trueSynData() {
      this.synDataForm.repoName = this.choiceRepoName
      this.synDataForm.teamName = this.choiceTeamName
      console.log("传过去的参数是：")

      console.log(this.synDataForm)

      this.$axios.get('/project/repo/reSynRepoData?repoName=' + this.synDataForm.repoName +
          '&userName=' + this.userName
          + '&maxPRNum=' + this.synDataForm.maxPRNum)
          .then(res => {
            alert(res.data.data)
          })
      this.isSynData = false
    },
    handleSynData(val) {
      this.isSynData = true
      this.choiceRepoName = val.repoName
      this.choiceTeamName = val.teamName

    },
    getRepoDate(val) {
      console.log(val)
      this.languages = JSON.parse(val.languages)
      var tempArr = new Array()
      for (var index in this.languages) {
        console.log('key=', index, 'value=', this.languages[index])
        var tempObj = {}

        tempObj["value"] = this.languages[index]
        tempObj["name"] = index
        // console.log(tempObj)
        tempArr.push(tempObj)
      }
      console.log(tempArr)
      console.log(tempObj)
      this.languageOption.series[0].data = tempArr
      console.log(this.languageOption.series[0].data)
      this.drawEcharts()
      this.repoBaseEntity = val
      console.log(this.repoBaseEntity)
      this.getRepoDayEntity(this.repoBaseEntity.repoName)


    },
    getUserRepoList() {

    },
    getRepoBaseEntity(val) {

    },
    getRepoDayEntity(val) {
      console.log(val)
      this.$axios.get('/project/repoData/getRepoDataList?userName=' + this.userName
          + '&repoName=' + val).then(res => {
        this.repoDayEntityList = res.data.data
        console.log(this.repoDayEntityList)
        this.newRepoDayEntity = this.repoDayEntityList[0]
        this.setRepoUserOptions(res.data.data)
      })
    },
    setRepoUserOptions(val) {
      // console.log(val)
      var tempLabels = []
      var tempData = []
      for (var index in val) {
        // console.log(val[index])
        tempLabels.push(val[index].dateDay)
        tempData.push(val[index].contributorNum)
      }
      tempLabels.reverse()
      tempData.reverse()
      this.repoUserOptions.xAxis.data = tempLabels
      console.log(this.repoUserOptions.xAxis.data)
      this.repoUserOptions.series[0].data = tempData
      console.log(this.repoUserOptions.series[0].data)
      this.drawLineEcharts()
    },
    setRepoCommitOptions(val) {

    },
    setRepoOpenPROptions(val) {
      var tempLabels = []
      var tempData = []
      for (var index = 0; index < this.repoDayEntityList.length; index++) {
        console.log(this.repoDayEntityList[index])
        tempLabels.push(this.repoDayEntityList[index].dateDay)
        tempData.push(this.repoDayEntityList[index].openPrNum)
      }
      tempLabels.reverse()
      tempData.reverse()
      this.repoUserOptions.xAxis.data = tempLabels
      console.log(this.repoUserOptions.xAxis.data)
      this.repoUserOptions.series[0].data = tempData
      this.repoUserOptions.title.text = "项目开放PR数量变化情况"
      console.log(this.repoUserOptions.series[0].data)
      this.drawLineEcharts()

    },
    drawLineEcharts() {
      this.myChart = echarts.init(document.getElementById("lineChart"));
      this.myChart.setOption(this.repoUserOptions);
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },
    drawEcharts() {
      // 第三步，通过echarts的init方法实例化一个echarts对象myChart，并，保存在data变量中
      this.myChart = echarts.init(document.getElementById("chart"));
      // 第四步，执行myChart的setOption方法去画图，当然至于配置项，我们要提前配置好，这里的配置项
      //         写在data中，方便我们在一些事件中去修改对应配置项，比如点击按钮更改配置项数据
      this.myChart.setOption(this.languageOption);
      // 第五步，在页面初始化加载的时候绑定页面resize事件监听。补充resize事件：resize事件是在浏览器窗口大小改变时，会触发。
      //        如当用户调整窗口大小，或者最大化、最小化、恢复窗口大小显示时触发 resize 事件。
      //        我们一般使用这个事件去做窗口大小与对应元素的大小适配
      window.addEventListener("resize", () => {
        // 第六步，执行echarts自带的resize方法，即可做到让echarts图表自适应
        this.myChart.resize();
      });
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
  background: rgb(210, 242, 67);
}

.grid-con-3 .grid-num {
  color: rgb(45, 140, 240);
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

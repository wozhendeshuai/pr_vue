<template>
  <div>
    <el-form :inline="true" :data="repoList">
      <el-form-item>
        <el-select v-model="choiceRepoName" class="filter-item" placeholder="参与项目列表">
          <el-option v-for="repo in repoList" :value="repo.repoName">{{ repo.repoName }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getModelEval()">确认</el-button>
      </el-form-item>
    </el-form>

    <el-form>
      <el-radio-group v-model="choiceModel" size="small">
        <el-radio label="MART">MART</el-radio>
        <el-radio label="RankNet">RankNet</el-radio>
        <el-radio label="RankBoost">RankBoost</el-radio>
        <el-radio label="AdaRank">AdaRank</el-radio>
        <el-radio label="Coordinate_Ascent">Coordinate Ascent</el-radio>
        <el-radio label="LambdaMART">LambdaMART</el-radio>
        <el-radio label="ListNet">ListNet</el-radio>
        <el-radio label="Random_Forests">Random Forests</el-radio>
        <el-radio label="bayesnet">bayesnet</el-radio>
        <el-radio label="xgboost">xgboost</el-radio>
      </el-radio-group>
    </el-form>
    <div id="chart"></div>
    <el-row :gutter="20">
      <el-button type="primary" @click="reTrainVisible = true">重新训练{{ choiceModel }}</el-button>
      <el-button @click="isUpdateTimeTask()">设置{{ choiceModel }}定时任务</el-button>
    </el-row>
    <el-dialog
        v-dialogDrag
        title="重新训练"
        :visible.sync="reTrainVisible"
        width="40%"
        center>
      <el-row align="center">
        <el-form :model="reTrainForm" ref="loginForm" label-width="80px"  label-position='left'>
          <el-form-item label="项目名称" prop="repoName" style="width: 390px;" v-model="reTrainForm.repoName">
            {{ choiceRepoName }}
          </el-form-item>
          <el-form-item label="算法名称" prop="algName" style="width: 390px;" v-model="reTrainForm.algName">
            {{ choiceModel }}
          </el-form-item>
          <el-form-item label="算法参数" prop="algParam" style="width: 390px;">
            <el-input v-model="reTrainForm.algParam"></el-input>
          </el-form-item>
          <el-form-item label="新建特征文件"  style="width: 390px;">
          <el-radio-group v-model="newFeatureFile" size="small">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
          </el-form-item>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="reTrainVisible = false">取 消</el-button>
    <el-button type="primary" @click="reTrainModel()">确 定</el-button>
     </span>
    </el-dialog>
    <el-dialog
        v-dialogDrag
        title="模型训练定时任务"
        :visible.sync="timetaskVisible"
        width="30%"
        center>
      <el-row align="center">
        <el-form :model="prTask" ref="loginForm" label-width="80px"  label-position='left'>
          <el-form-item label="项目名称: " prop="repoName" style="width: 390px;" v-model="prTask.repoName">
            {{ prTask.repoName }}
          </el-form-item>
          <el-form-item label="团队名称: " prop="teamName" style="width: 390px;" v-model="prTask.teamName">
            {{ prTask.teamName }}
          </el-form-item>
          <el-form-item label="触发周期: " prop="cronExpression" style="width: 390px;">
            <el-popover v-model="cronPopover">
              <VueCron @change="onChangeCron" @close="cronPopover = false"></VueCron>
              <el-input
                  slot="reference"
                  @click="cronPopover = true"
                  v-model="prTask.cronExpression"
                  placeholder="请输入定时策略"
                  size="small"
              ></el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="算法参数: " prop="cronExpression" style="width: 390px;">
            <el-input  type="textarea"
                       :rows="2"
                       v-model="prTask.algParam"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="timetaskVisible = false">取 消</el-button>
      <el-button type="primary" @click="timetaskVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import * as echarts from 'echarts';
import VueCron from 'vue-cron';

export default {

  name: "Role",
  data() {

    return {
      cronPopover: false,
      isTimeTask: false,
      prTask: {
        id: "",
        type: "",
        jobName: "",
        jobGroup: "",
        repoName: "",
        teamName: "",
        algName: null,
        algParam: null,
        description: null,
        jobUser: "",
        jobClassName: "com.jjyu.job.ProjectDataCollectionJob",
        cronExpression: "",
        triggerTime: "",
        triggerState: null,
        orderBy: null,
        remark: null,
        createTime: "",
        createUser: "",
        createOrganize: "",
        updateUser: null,
        updateTime: null,
        authOrganizeIds: null,
        authUser: null,
        oldJobName: null,
        oldJobGroup: null,
      },
      reTrainForm: {
        repoName: '',
        algName: '',
        algParam: '',
        userName: '',
      },
      repoList: [],
      choiceModel: "MART",
      userName: '',
      prList: [],
      choiceRepoName: "",
      total: 0,
      size: 10,
      current: 1,
      reTrainVisible: false,
      timetaskVisible: false,
      editForm: {},
      tableData: [],
      myChart: null, // 定义变量用来存放echarts实例
      option: {
        title: {
          text: '各指标情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['ndcg', 'mrr', 'kendall tau distance']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 1
        },
        series: [

          {
            name: 'ndcg',
            type: 'line',
            // stack: 'Total',
            yAxisIndex: 0,
            data: [],
            markLine: {
              data: [{type: 'average', name: 'Avg'}],
              precision: 4
            }
          },
          {
            name: 'mrr',
            type: 'line',
            // stack: 'Total',
            yAxisIndex: 0,
            data: [],
            markLine: {
              data: [{silent: false, type: 'average', name: 'mrr平均值'}],
              label: {
                show: true,
                position: 'end'
              },
              precision: 4
            }
          },
          {
            name: 'kendall tau distance',
            type: 'line',
            // stack: 'Total',
            yAxisIndex: 0,
            data: [],
            markLine: {
              data: [{type: 'average', name: 'Avg'}],
              precision: 4
            }
          }
        ]
      },
      newFeatureFile: 'false',
    }
  },
  components: {

    VueCron,
  },
  created() {
    // this.getUserList()

    this.$axios.get("/project/repo/userProject?userName=" + localStorage.getItem("token")).then(res => {
      console.log("res.data.data")
      console.log(res.data.data)
      this.repoList = res.data.data
      var data = this.$route.query
      console.log(data)
      this.userName = localStorage.getItem("token")
      //从url解析数据后，获取最新的模型指标
      if (data.repoName != null) {
        console.log(data)
        this.choiceRepoName = data.repoName
        this.choiceModel = data.choiceModel
        this.getModelEval()
      }
    })
  },
  //调用
  mounted() {
    // 第二步，在页面加载渲染的时候执行echarts画图方法
    this.drawEcharts();

  },
  methods: {
    onChangeCron(v) {
      this.prTask.cronExpression = v
    },
    isUpdateTimeTask(val) {
      console.log(val)
      this.timetaskVisible = true
      this.$axios.get('/prTask/getPRTask?repoName=' + this.choiceRepoName +
          '&taskType=alg'+this.choiceModel).then(res => {
        console.log(res.data.data)
        this.prTask = res.data.data
      })
    },
    reTrainModel() {
      console.log("传过去的参数是：")
      this.reTrainForm.algName = this.choiceModel
      this.reTrainForm.repoName = this.choiceRepoName
      this.reTrainForm.userName = this.userName
      console.log(this.reTrainForm)
      console.log(this.newFeatureFile)
      this.$axios.get('/prSorting/alg/reTrainAlg?repoName=' + this.reTrainForm.repoName +
          '&algName=' + this.reTrainForm.algName
          + '&algParam=' + this.reTrainForm.algParam
          + '&userName=' + this.reTrainForm.userName
          + '&newFeature=' + this.newFeatureFile)
          .then(res => {
            alert("后台正在疯狂计算中，请稍等")
          })
      this.reTrainVisible = false
    },
    getModelEval() {
      console.log("仓库是" + this.choiceRepoName)
      console.log("排序算法是" + this.choiceModel)
      this.$axios.get('/prSorting/alg/listEval?repoName=' + this.choiceRepoName + '&algName=' + this.choiceModel).then(res => {
        this.prList = res.data.data;
        const tempNdcg = new Array();
        const tempMrr = new Array();
        const tempKendall = new Array();
        const tempTestDay = new Array();
        console.log(res.data.data);
        for (let i = 0; i < res.data.data.length; i++) {
          tempTestDay.push(res.data.data[i]['testDay']);
          tempNdcg.push(res.data.data[i]['ndcg']);
          tempMrr.push(res.data.data[i]['mrr']);
          tempKendall.push(res.data.data[i]['kendallTauDistance']);
        }
        console.log(tempTestDay);
        console.log(tempNdcg);
        console.log(tempMrr);
        console.log(tempKendall);
        this.option.xAxis['data'] = tempTestDay
        this.option.series[0]['data'] = tempNdcg
        this.option.series[1]['data'] = tempMrr
        this.option.series[2]['data'] = tempKendall
        console.log(this.option.series[0]['data']);
        console.log(this.option.series[1]['data']);
        console.log(this.option.series[2]['data']);
        this.drawEcharts();
      })
    },
    drawEcharts() {
      // 第三步，通过echarts的init方法实例化一个echarts对象myChart，并，保存在data变量中
      this.myChart = echarts.init(document.getElementById("chart"));
      // 第四步，执行myChart的setOption方法去画图，当然至于配置项，我们要提前配置好，这里的配置项
      //         写在data中，方便我们在一些事件中去修改对应配置项，比如点击按钮更改配置项数据
      this.myChart.setOption(this.option);
      // 第五步，在页面初始化加载的时候绑定页面resize事件监听。补充resize事件：resize事件是在浏览器窗口大小改变时，会触发。
      //        如当用户调整窗口大小，或者最大化、最小化、恢复窗口大小显示时触发 resize 事件。
      //        我们一般使用这个事件去做窗口大小与对应元素的大小适配
      window.addEventListener("resize", () => {
        // 第六步，执行echarts自带的resize方法，即可做到让echarts图表自适应
        this.myChart.resize();
        // 如果有多个echarts，就在这里执行多个echarts实例的resize方法,不过一般要做组件化开发，即一个.vue文件只会放置一个echarts实例
        /*
        this.myChart2.resize();
        this.myChart3.resize();
        ......
        */
      });
    },


  },


}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

#chart {
  width: 100%;
  height: 600px;
}

.el-pagination {
  float: right;
  margin-top: 22px;
}

</style>
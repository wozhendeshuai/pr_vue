<template>
  <div>
    <el-form :inline="true" :data="repoList">
      <el-form-item>
        <el-select v-model="choiceRepoName" class="filter-item" placeholder="参与项目列表">
          <el-option v-for="repo in repoList" :value="repo.repoName">{{ repo.repoName }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="choiceEngine" size="small" @change="choiceEngineDone">
          <el-radio label="alg">优先级排序算法引擎</el-radio>
          <el-radio label="rule">规则排序引擎</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="getPRList()">确认</el-button>
        <el-button @click="getModelDetail()" v-if="isChoiceModel==true">模型效果查看</el-button>
        <el-button @click="newPR()" v-if="">新建PR</el-button>
      </el-form-item>
    </el-form>
    <!--    <el-divider></el-divider>-->

    <el-form v-model="isChoiceModel" v-if="isChoiceModel==true">
      <el-radio-group v-model="choiceModel" size="small" @change="choiceModelDone">
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
    <el-form v-model="isChoiceRule" v-if="isChoiceRule==true">
      <el-radio-group v-model="choiceRule" size="small" @change="choiceRuleDone">
        <el-radio label="createtime">时间先后</el-radio>
        <el-radio label="changefile">修改文件数量</el-radio>
      </el-radio-group>
    </el-form>

    <el-table
        :data="prList"
        border
        style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="pr-table-expand">
            <el-form-item label="PR标题:">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="PR内容:">
              <span>{{ props.row.body }}</span>
            </el-form-item>
            <el-form-item label="PR编号:">
              <span>{{ props.row.prNumber }}</span>
            </el-form-item>
            <el-form-item label="PR创建者:">
              <span>{{ props.row.prUserName }}</span>
            </el-form-item>
            <el-form-item label="PR创建时间:">
              <span>{{ props.row.createdAt | FormatDate }}</span>
            </el-form-item>
            <el-form-item label="PR更新时间:">
              <span>{{ props.row.updatedAt | FormatDate }}</span>
            </el-form-item>
            <el-form-item label="PR提交次数:">
              <span>{{ props.row.commitNumber }}</span>
            </el-form-item>
            <el-form-item label="PR评论数量:">
              <span>{{ props.row.commentsNumber }}</span>
            </el-form-item>
            <el-form-item label="PR评审数量:">
              <span>{{ props.row.reviewCommentsNumber }}</span>
            </el-form-item>
            <el-form-item label="PR增加行数:">
              <span>{{ props.row.totalAddLine }}</span>
            </el-form-item>
            <el-form-item label="PR删除行数:">
              <span>{{ props.row.totalDeleteLine }}</span>
            </el-form-item>
            <el-form-item label="PR与当前分支是否有冲突:">
              <span>{{ props.row.mergeableState }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
          label="PR编号"
          prop="prNumber">
      </el-table-column>
      <el-table-column
          label="PR标题"
          prop="title">
      </el-table-column>
      <el-table-column
          label="PR内容"
          prop="body" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleDetail(scope.$index, scope.row)">查看PR详情
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleMerge(scope.$index, scope.row)">合入PR
          </el-button>
          <el-button
              size="mini"
              type="warning"
              @click="reviewPR(scope.$index, scope.row)">评审PR
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        title="新建PR"
        :visible.sync="newPRVisible"
        width="60%"
        center>
      <span>这里将有定时任务相关信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="newPRVisible = false">取 消</el-button>
    <el-button type="primary" @click="newPRVisible = false">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      newPRVisible: false,
      repoList: [],
      isChoiceModel: true,
      isChoiceRule: false,
      choiceEngine: "alg",
      choiceModel: "MART",
      choiceRule: "createtime",
      prList: [],
      choiceRepoName: "",
      total: 0,
      size: 10,
      current: 1,
      dialogVisible: false,
      editForm: {},
      userName: '',
      tableData: [],

    }
  },
  created() {
    // this.getUserList()

    this.$axios.get("/project/repo/userProject?userName=" + localStorage.getItem("token")).then(res => {
      console.log("res.data.data")
      console.log(res.data.data)
      this.repoList = res.data.data
      this.userName = localStorage.getItem("token")
    })
  },
  methods: {
    newPR() {
      this.newPRVisible = true
      console.log("仓库是" + this.choiceRepoName)
      this.$axios.get('/project/repo/repoBranch?userName=' + this.userName + '&repoName=' + this.choiceRepoName).then(res => {

        console.log(res.data.data)
      })
    },
    reviewPR(index, row) {
      console.log("选中的在table中的index是：" + index);
      console.log("选中的在table中的prnumber是：" + row.prNumber);
      this.$router.push({path: "/pr/review", query: {repoName: this.choiceRepoName, prNumber: row.prNumber}})
    },
    getPRList() {
      console.log("仓库是" + this.choiceRepoName)
      console.log("排序引擎是" + this.choiceEngine)
      console.log("排序算法是" + this.choiceModel)
      console.log("排序规则是" + this.choiceRule)
      if (this.isChoiceModel) {
        this.$axios.get('/prSorting/alg/listOrder?repoName=' + this.choiceRepoName + '&algName=' + this.choiceModel).then(res => {
          this.prList = res.data.data
          console.log(this.prList)
        })
      } else {
        this.$axios.get('/prSorting/rule/sortOriginalData?repoName=' + this.choiceRepoName + '&sortRule=' + this.choiceRule).then(res => {
          this.prList = res.data.data
          console.log(this.prList)
        })
      }

    },
    handleDetail(index, row) {
      console.log("选中的在table中的index是：" + index);
      console.log("选中的在table中的prnumber是：" + row.prNumber);
      this.$router.push({path: "/pr/detail", query: {repoName: this.choiceRepoName, prNumber: row.prNumber}})
    },
    handleMerge(index, row) {
      console.log("选中的在table中的index是：" + index);
      console.log("选中的在table中的prnumber是：" + row.prNumber);
    },
    getModelDetail() {
      console.log("选中的排序规则是：" + this.choiceModel);
      console.log("仓库是" + this.choiceRepoName)
      if (this.choiceRepoName.length == 0) {
        alert("还未选择项目")
      }
      this.$router.push({path: "/pr/model", query: {choiceModel: this.choiceModel, repoName: this.choiceRepoName}})
    },
    choiceEngineDone: function (val) {
      console.log("选择了一个排序引擎")
      console.log(val)
      if (val === "alg") {
        this.isChoiceModel = true
        this.isChoiceRule = false
      } else {
        this.isChoiceModel = false
        this.isChoiceRule = true
      }
    }, choiceModelDone: function (val) {
      console.log("选择了一个排序算法")
      console.log(val)
      this.choiceModel = val
    },
    choiceRuleDone: function (val) {
      console.log("选择了一个排序规则")
      console.log(val)
      this.choiceRule = val
    },
  }
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

.el-pagination {
  float: right;
  margin-top: 22px;
}

</style>
<template>
  <div>
    <el-form :inline="true" :data="repoList">
      <el-form-item>
        <el-select v-model="choiceRepoName" filterable class="filter-item" placeholder="项目列表"
                   @change="getPRNumberAndTitle(choiceRepoName)">
          <el-option v-for="repo in repoList" :value="repo.repoName">{{ repo.repoName }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="choicePRNumberAndTitle" filterable class="filter-item" placeholder="PR编号列表">
          <el-option v-for="prNumberAndTitle in prNumberAndTitleList" :value="prNumberAndTitle">{{
              prNumberAndTitle
            }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="getPRDetail()">确认</el-button>
      </el-form-item>
    </el-form>

    <el-form>
      <div>编号 {{ prDetail.prNumber }}详情 <span>标题</span>{{ prDetail.title }}}</div>
      <span></span>
      <div><span>内容</span>{{ prDetail.body }}</div>
      <el-timeline>
        <el-timeline-item
            v-for="(commentsTemp, index) in comments"
            :key="index"
            :timestamp="commentsTemp.created_at"
        >
          <el-card>
            <h4>更新 Github 模板</h4>
            <p>{{ commentsTemp.body }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-form>


  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      comments: [],
      userName: '',
      repoList: [],
      isChoiceModel: true,
      isChoiceRule: false,
      choiceEngine: "alg",

      choiceRule: "createtime",


      prNumberList: [],
      prNumberAndTitleList: [],
      prDetail: {},

      choiceRepoName: "",
      choicePRNumberAndTitle: "",
      total: 0,
      size: 10,
      current: 1,
      dialogVisible: false,
      editForm: {},

      tableData: [],

    }
  },
  created() {
    // this.getUserList()

    this.$axios.get("/project/repo/userProject?userName=" + localStorage.getItem("token")).then(res => {
      console.log("res.data.data")
      // console.log(res.data.data)
      this.repoList = res.data.data
      this.userName = localStorage.getItem("token")
    })
  },
  methods: {
    getPRNumberAndTitle(val) {
      console.log("仓库是" + this.choiceRepoName)
      this.$axios.get('/prManage/prBase/getPRNumberAndTitle?userName=' + this.userName + '&repoName=' + this.choiceRepoName).then(res => {
        this.prNumberAndTitleList = res.data.data
        // console.log(this.prNumberAndTitleList)
      })
    },
    getPRDetail() {
      console.log("仓库是" + this.choiceRepoName)
      console.log("choicePRNumberAndTitle是" + this.choicePRNumberAndTitle)
      var prNumberArr = this.choicePRNumberAndTitle.split(":")
      console.log(prNumberArr)
      var prNumber = prNumberArr[0]

      console.log("通过字符串分割得到的PRNumber: " + prNumber)
      this.$axios.get('/prManage/prBase/getPRDetail?userName=' + this.userName + '&prNumber=' + prNumber + '&repoName=' + this.choiceRepoName).then(res => {
        this.prDetail = res.data.data
        // console.log(this.prDetail)
        // console.log("commentsContent: " + this.prDetail.commentsContent)
        this.comments = JSON.parse(this.prDetail.commentsContent)
        console.log("this.comments" + this.comments)
      })
    },


    handleDetail(index, row) {
      console.log(index, row.title);
    },
    handleMerge(index, row) {
      console.log(index, row);
      console.log(row.title)
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

/*下拉选择框-多选-内容过长-用...代替    begin    */
.el-tag.el-tag--info {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
  max-width: calc(100% - 50px);
  /* white-space: nowrap;
   text-overflow: ellipsis;
   overflow: hidden;*/
}

.el-tag.el-tag--info:nth-child(1) {
  width: calc(100% - 50px);
}

.el-tag.el-tag--info:nth-child(1) .el-option {
  width: calc(100% - 20px);
  float: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/*下拉选择框-多选-内容过长-用...代替    end    */
</style>
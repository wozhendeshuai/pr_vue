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
              type="primary"
              @click="handleMerge(scope.$index, scope.row)">合入PR
          </el-button>
          <el-button
              size="mini"
              type="warning"
              @click="reviewPR(scope.$index, scope.row)">评审PR
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="closePR(scope.$index, scope.row)">关闭PR
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        :visible.sync="newPRVisible"
        width="60%"
        center>
      <span slot="title" class="dialog-title" center>
        {{ choiceRepoName }}新建PR
      </span>
      <el-form>
        <el-form-item label="项目接受改变的分支:">
          <el-select v-model="baseBranch" filterable class="filter-item" placeholder="项目base分支">
            <el-option v-for="name in branchsNameList" :value="name">{{ name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目改变的分支:">
          <el-select v-model="compareBranch" filterable class="filter-item" placeholder="项目compare分支">
            <el-option v-for="temp in branchs" :value="temp.name">{{ temp.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="PR标题：" prop="name">
          <el-input v-model="newPRTitle"></el-input>
        </el-form-item>
        <el-form-item label="PR内容：" prop="desc">
          <el-input type="textarea" v-model="newPRBody"></el-input>
        </el-form-item>
        <el-form-item label="是否通知团队成员：" prop="desc">
          <el-radio-group v-model="isNotify">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="通知团队成员:" v-if="isNotify===1">
          <el-select v-model="notifyMemberName" filterable class="filter-item" placeholder="项目成员列表">
            <el-option v-for="members in teamMembers" :value="members.userName">{{ members.userName }}</el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="newPRVisible = false">取 消</el-button>
    <el-button type="primary" @click="toNewPR()">确 定</el-button>
     </span>
    </el-dialog>
    <el-dialog
        :visible.sync="isMerge"
        width="60%"
        center>
      <span slot="title" class="dialog-title" center>
        项目{{ choiceRepoName }} 合并{{ choicePRDetail.prNumber }}号PR
      </span>
      <el-form>
        <el-form-item label="PR名称:">
          {{ choicePRDetail.title }}
        </el-form-item>
        <el-form-item label="merge名称：" prop="name">
          <el-input v-model="mergeTitle"></el-input>
        </el-form-item>
        <el-form-item label="merge消息：" prop="desc">
          <el-input type="textarea" v-model="mergeMessage"></el-input>
        </el-form-item>
        <el-form-item label="merge方式:">
          <el-radio-group v-model="mergeMethod">
            <el-radio label='merge'>合入发生改变的分支中每次提交</el-radio>
            <el-radio label="squash">将发生改变的分支中多个commit合并为一个commit</el-radio>
            <el-radio label="rebase">将发生改变的分支中的每一次提交都rebase到原仓库</el-radio>
          </el-radio-group>
          <!--          <el-radio-group v-model="mergeMethod">-->
          <!--            <el-radio-button label="merge">合入发生改变的分支中每次提交</el-radio-button>-->
          <!--            <el-radio-button label="squash">将发生改变的分支中多个commit合并为一个commit</el-radio-button>-->
          <!--            <el-radio-button label="rebase">将发生改变的分支中的每一次提交都rebase到原仓库</el-radio-button>-->
          <!--          </el-radio-group>-->
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="isMerge = false">取 消</el-button>
    <el-button type="primary" @click="toMergePR()">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      isMerge: false,
      choicePRDetail: {},
      mergeTitle: '',
      mergeMessage: '',
      mergeMethod: 'merge',
      teamMembers: [],
      choiceTeamName: '',
      notifyMemberName: '',
      isNotify: 0,

      newPRTitle: '',
      newPRBody: '',
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
      branchs: [],
      branchsNameList: [],
      baseBranch: '',
      compareBranch: '',
      choiceFullName: "1",

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
    getTeamAndUser() {
      console.log("选择的团队名称是" + this.choiceTeamName)
      this.$axios.get('/project/team/listTeamAndMemberUser?teamName=' + this.choiceTeamName + '&userName=' + this.userName).then(res => {
        this.teamEntity = res.data.data
        console.log(this.teamEntity)
        this.teamMembers = this.teamEntity.userBaseEntityList
        console.log(this.teamMembers)
      })
    },
    toMergePR() {
      console.log(this.choiceRepoName)
      console.log(this.mergeTitle)
      console.log(this.mergeMessage)
      console.log(this.mergeMethod)

      for (let i = 0; i < this.repoList.length; i++) {
        if (this.repoList[i].repoName === this.choiceRepoName) {
          this.choiceFullName = this.repoList[i].teamName
          break
        }
      }
      console.log(this.choiceFullName)
      var teamNameArr = this.choiceFullName.split("/")
      var teamName = teamNameArr[0]
      console.log(teamName)

      this.$axios.get('/prManage/prBase/mergePR?userName=' + this.userName
          + '&prNumber=' + this.choicePRDetail.prNumber
          + '&ownerName=' + teamName
          + '&repoName=' + this.choiceRepoName
          + '&commitTitle=' + this.mergeTitle
          + '&commitMessage=' + this.mergeMessage
          + '&mergeMethod=' + this.mergeMethod
      ).then(res => {
        console.log(res.data.data)
        alert(res.data.data)
      })
      this.isMerge = false
    },

    handleMerge(index, row) {
      console.log("选中的在table中的index是：" + index);
      console.log("选中的在table中的prnumber是：" + row.prNumber);
      this.choicePRDetail = row
      console.log(this.choicePRDetail)
      this.isMerge = true
    },
    toNewPR() {
      console.log(this.baseBranch)
      console.log(this.compareBranch)
      console.log(this.newPRTitle)
      console.log(this.newPRBody)
      console.log(this.choiceRepoName)
      console.log("this.notifyMemberName: " + this.notifyMemberName)
      for (let i = 0; i < this.repoList.length; i++) {
        if (this.repoList[i].repoName === this.choiceRepoName) {
          this.choiceFullName = this.repoList[i].teamName
          break
        }
      }
      console.log(this.choiceFullName)
      var teamNameArr = this.choiceFullName.split("/")
      var teamName = teamNameArr[0]
      console.log(teamName)
      if (this.baseBranch === this.compareBranch) {
        alert("不可以选择同一分支")
      } else {
        this.$axios.get('/prManage/prBase/newPR?userName=' + this.userName
            + '&repoName=' + this.choiceRepoName
            + '&ownerName=' + teamName
            + '&baseBranch=' + this.baseBranch
            + '&compareBranch=' + this.compareBranch
            + '&prTitle=' + this.newPRTitle
            + '&prContent=' + this.newPRBody
            + '&notifyUserName' + this.notifyMemberName).then(res => {
          console.log(res.data.data)
          alert(res.data.data)
        })
        this.newPRVisible = false
      }
    },
    closePR(index, row) {
      console.log("选中的在table中的index是：" + index);
      console.log("选中的在table中的prnumber是：" + row.prNumber);
      console.log(this.choiceRepoName)

      for (let i = 0; i < this.repoList.length; i++) {
        if (this.repoList[i].repoName === this.choiceRepoName) {
          this.choiceFullName = this.repoList[i].teamName
          break
        }
      }
      console.log(this.choiceFullName)
      var teamNameArr = this.choiceFullName.split("/")
      var teamName = teamNameArr[0]
      console.log(teamName)

      this.$axios.get('/prManage/prBase/closePR?userName=' + this.userName
          + '&repoName=' + this.choiceRepoName
          + '&ownerName=' + teamName
          + '&prNumber=' + row.prNumber).then(res => {
        console.log(res.data.data)
        alert(res.data.data)
      })
      this.newPRVisible = false

    },
    newPR() {
      this.newPRVisible = true
      console.log("仓库是" + this.choiceRepoName)
      this.$axios.get('/project/repo/repoBranch?userName=' + this.userName + '&repoName=' + this.choiceRepoName).then(res => {

        console.log(res.data.data)
        this.branchs = res.data.data
        for (let i = 0; i < this.branchs.length; i++) {
          this.branchsNameList.push(this.branchs[i].name)
        }
        for (let i = 0; i < this.repoList.length; i++) {
          if (this.repoList[i].repoName === this.choiceRepoName) {
            this.choiceFullName = this.repoList[i].teamName
            break
          }
        }
        console.log(this.choiceFullName)
        var teamNameArr = this.choiceFullName.split("/")
        this.choiceTeamName = teamNameArr[0]
        console.log(this.choiceTeamName)
        this.getTeamAndUser()
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
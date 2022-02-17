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
      </el-form-item>
    </el-form>

    <el-form v-model="isChoiceModel" v-if="isChoiceModel==true">
      <el-radio-group v-model="choiceModel" size="small" @change="choiceModelDone">
        <el-radio label="MART">MART</el-radio>
        <el-radio label="Random Forest">Random Forest</el-radio>
      </el-radio-group>
    </el-form>
    <el-form v-model="isChoiceRule" v-if="isChoiceRule==true">
      <el-radio-group v-model="choiceRule" size="small" @change="choiceRuleDone">
        <el-radio label="时间先后">时间先后</el-radio>
        <el-radio label="修改文件数量">修改文件数量</el-radio>
      </el-radio-group>
    </el-form>

  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      repoList: [],
      isChoiceModel: true,
      isChoiceRule: false,
      choiceEngine: "alg",
      choiceModel: "MART",
      choiceRule: "时间先后",

      prList: [],


      searchForm: {},
      delBtlStatu: true,
      choiceRepoName: "",
      total: 0,
      size: 10,
      current: 1,
      dialogVisible: false,
      editForm: {},

      tableData: [],

      editFormRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        statu: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ]
      },

      multipleSelection: [],

      roleDialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleForm: {},
      roleTreeData: [],
      treeCheckedKeys: [],
      checkStrictly: true

    }
  },
  created() {
    // this.getUserList()

    this.$axios.get("/project/repo/userProject?userName=" + localStorage.getItem("token")).then(res => {
      console.log("res.data.data")
      console.log(res.data.data)
      this.repoList = res.data.data
    })
  },
  methods: {
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
        this.$axios.get('/prSorting/rule/' + id).then(res => {
          this.editForm = res.data.data
          //todo: 此处还需修改
          this.dialogVisible = true
        })
      }

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

.el-pagination {
  float: right;
  margin-top: 22px;
}

</style>
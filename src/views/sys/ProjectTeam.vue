<template>
  <div>
    <el-form :inline="true" :data="teamList">
      <el-form-item>
        <el-select v-model="choiceTeamName" class="filter-item" placeholder="参与的团队列表">
          <el-option v-for="team in teamList" :value="team">{{ team }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getTeamAndUser()">确认</el-button>
      </el-form-item>
    </el-form>

    <el-table
        :data="userList"
        border
        v-if="userList.length!=0"
        style="width: 100%">
      <el-table-column
          prop="userId"
          label="用户ID"
      >
      </el-table-column>
      <el-table-column
          prop="userName"
          label="用户名称"
      >
      </el-table-column>
      <el-table-column
          prop="userRoleInTeam"
          label="用户角色">
      </el-table-column>
      <el-table-column
          prop="userPowerInTeam"
          label="用户权限">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
      >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
          <el-button @click="isUpdatePower(scope.row)" type="warning" size="small">修改成员权限</el-button>
          <el-button @click="delMember(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form>
      <el-button @click="getNotInTeamNameList()" type="primary" size="small">为团队新增成员</el-button>
    </el-form>
    <el-dialog
        title="新增团队成员"
        :visible.sync="addNewMember"
        width="30%"
        center>
      <el-row align="center">
        <el-form :model="newUserName" ref="loginForm" label-width="80px">选择用户名：
          <el-select v-model="newUserName" filterable class="filter-item" placeholder="">
            <el-option v-for="notInUserName in noInTeamNameList" :value="notInUserName">{{
                notInUserName
              }}
            </el-option>
          </el-select>
        </el-form>
        <el-form>用户权限：
          <el-checkbox-group v-model="userPowerList" @change="setPowers">
            <el-checkbox label="repo">项目数据控制</el-checkbox>
            <el-checkbox label="team">团队数据控制</el-checkbox>
            <el-checkbox label="model">优先级模型管理</el-checkbox>
          </el-checkbox-group>
        </el-form>

      </el-row>
      <el-row>
        <el-form>
          邮件通知：
          <el-switch
              v-model="isMail"
              active-text="是"
              inactive-text="否">
          </el-switch>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="addNewMember = false">取 消</el-button>
    <el-button type="primary" @click="setNewMember()">确 定</el-button>
     </span>
    </el-dialog>
    <el-dialog
        title="修改成员权限"
        :visible.sync="ischangePower"
        width="30%"
        center>
      <el-row align="center">
        <el-form :model="newUserName" ref="loginForm" label-width="80px">用户名：
          {{ updateUserName }}
        </el-form>
        <el-form>用户权限：
          <el-checkbox-group v-model="userPowerList" @change="setPowers">
            <el-checkbox label="repo">项目数据控制</el-checkbox>
            <el-checkbox label="team">团队数据控制</el-checkbox>
            <el-checkbox label="model">优先级模型管理</el-checkbox>
          </el-checkbox-group>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="ischangePower = false">取 消</el-button>
    <el-button type="primary" @click="updateUserPower()">确 定</el-button>
     </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      updateUserName: '',
      ischangePower: false,
      isMail: true,
      addNewMember: false,
      choiceTeamName: '',
      teamList: [],
      userName: '',
      teamEntity: {},
      userList: [],
      newUserName: '',
      noInTeamNameList: [],
      userPowerList: ["repo",],

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

      tableData: [],

    }
  },
  created() {
    this.$axios.get("/project/team/userTeamList?userName=" + localStorage.getItem("token")).then(res => {
      console.log("res.data.data")
      console.log(res.data.data)
      this.teamList = res.data.data
      this.userName = localStorage.getItem("token")
    })
  },
  methods: {
    updateUserPower(val) {
      this.ischangePower = false
      console.log(this.userPowerList)
      console.log(this.updateUserName)
      var userPower = this.userPowerList.toString()
      console.log(this.userPower)
      this.$axios.get('/project/team/updatemember?teamName=' + this.choiceTeamName
          + '&userName=' + this.userName
          + '&updateUserName=' + this.updateUserName
          + '&newUserPower=' + this.userPowerList.toString()).then(res => {
        alert(res.data.data)
        this.getTeamAndUser()
      })
    },
    isUpdatePower(val) {
      this.ischangePower = true
      this.updateUserName = val.userName
      this.userPowerList=val.userPowerInTeam.split(",")
      console.log(this.userPowerList)
    },
    delMember(val) {
      console.log(val)
      this.$axios.get('/project/team/delmember?teamName=' + this.choiceTeamName
          + '&userName=' + this.userName
          + '&delUserName=' + val.userName).then(res => {
        alert(res.data.data)
        this.getTeamAndUser()
      })
    },
    setPowers(val) {
      this.userPowerList = val;
      console.log(this.userPowerList)
    },
    setNewMember() {
      this.addNewMember = false
      console.log(this.userPowerList)
      var userPower = this.userPowerList.toString()
      console.log(this.userPower)
      this.$axios.get('/project/team/addmember?teamName=' + this.choiceTeamName + '&userName=' + this.userName
          + '&userRoleInTeam=MEMBER'
          + '&newUserName=' + this.newUserName
          + '&newUserPower=' + this.userPowerList.toString() + '&isMail=' + this.isMail).then(res => {

        alert(res.data.data)
        this.getTeamAndUser()
      })
    },
    getNotInTeamNameList() {
      this.addNewMember = true
      this.$axios.get('/project/team/listNotTeamUser?teamName=' + this.choiceTeamName + '&userName=' + this.userName).then(res => {
        this.noInTeamNameList = res.data.data
        console.log(this.noInTeamNameList)
      })
    },
    getTeamAndUser() {
      console.log("选择的团队名称是" + this.choiceTeamName)
      this.$axios.get('/project/team/listTeamAndMemberUser?teamName=' + this.choiceTeamName + '&userName=' + this.userName).then(res => {
        this.teamEntity = res.data.data
        console.log(this.teamEntity)
        this.userList = this.teamEntity.userBaseEntityList
        console.log(this.userList)
      })
    },


  }
}
</script>

<style scoped>
.card-panel-col {
  margin-bottom: 32px;
}

.el-pagination {
  float: right;
  margin-top: 22px;
}

.card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
}

.card-panel-icon {
  float: left;
  font-size: 48px;
}


</style>
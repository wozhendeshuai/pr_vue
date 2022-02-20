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
    <el-divider></el-divider>
    <el-form>
      PR编号与标题：
      <el-card>
        <div> {{ prDetail.prNumber }} {{ prDetail.title }}</div>
      </el-card>
      <el-divider></el-divider>
      <div>内容
        <el-card>
          <span></span>{{ prDetail.body }}
        </el-card>
      </div>
      <el-divider></el-divider>
      <div v-if="comments.length==0">
        暂无评论
      </div>
      <div v-if="comments.length!=0">
        <el-link v-bind:href="['https://github.com/tensorflow/tensorflow/pull/'+prDetail.prNumber]" target="_blank" >
          GitHub中第 {{ prDetail.prNumber }}号 PR 详情页面
        </el-link>
      </div>
      <div class="radio" v-if="comments.length!=0">
        排序：
        <el-radio-group v-model="reverse">
          <el-radio :label="true">倒序</el-radio>
          <el-radio :label="false">正序</el-radio>
        </el-radio-group>
      </div>

      <el-timeline :reverse="reverse">
        <el-timeline-item
            v-for="(commentsTemp, index) in comments"
            :key="index"
            :timestamp="commentsTemp.created_at"
        >
          <el-card>
            <h4>{{ commentsTemp.user.login }}</h4>
            <p>{{ commentsTemp.body }}</p>

          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-form>
    <el-divider></el-divider>
    <!--   <comment></comment>-->
    <div class="hbl-fa">

      <div class="hbl-comm">

        <div class="comment" :style="{width:commentWidth}">
          <el-input
              @focus="showButton(0)"
              type="textarea"
              :autosize="{ minRows: minRows, maxRows: maxRows}"
              :placeholder=placeholder
              v-model="textareaMap[0]">
          </el-input>

          <div v-if="buttonMap[0]" class="hbl-owo">
            <div :class="pBodyMap[0]?'OwO':'OwO OwO-open'" class="emoj publish" :style="{width:emojiWidth}">
              <div class="OwO-logo" @click="pBodyStatus(0)">
                <span>Emoji表情</span>
              </div>
              <div class="OwO-body">
                <ul class="OwO-items OwO-items-show">
                  <li class="OwO-item" v-for="(oitem,index) in OwOlist" :key="'oitem'+index"
                      @click="choseEmoji(0,oitem.title)">
                    <img :src="require('../../assets/img/face/'+oitem.url)" alt="">
                  </li>
                </ul>

              </div>
            </div>

            <div class="publish publish-btn">
              <button class="btn" @click="doSend()">发送</button>
              <button @click="cancel(0)" class="btn btn-cancel">取消</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: "Role",
  props:{
    emojiWidth:{
      type:String,
      default:'560px'
    },
    showAvatar:{
      type:Boolean,
      default:true
    },
    avatar:{
      type:String,
      default:''
    },
    placeholder:{
      type:String,
      default:'在此输入评论内容...'
    },
    minRows:{
      type:Number,
      default:4
    },
    maxRows:{
      type:Number,
      default:8
    },
    commentNum:{
      type:Number,
      default:2
    },
    authorId:{
      type:Number,
      default:1
    },
    label:{
      type:String,
      default:'作者'
    },
    commentList:{
      type:Array,

    },
    commentWidth:{
      type:String,
      default:'80%',
    }

  },
  data() {
    return {
      reverse: true,
      comments: [],
      userName: '',
      repoList: [],
      isChoiceModel: true,
      isChoiceRule: false,
      choiceEngine: "alg",
      choicePRNumber: '',
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
      replyMap:[
      ],
      pBodyMap:[],
      textareaMap:[],
      buttonMap:[],
      OwOlist: [//表情包和表情路径
        {'title': '微笑', 'url': 'weixiao.gif'},
        {'title': '嘻嘻', 'url': 'xixi.gif'},
        {'title': '哈哈', 'url': 'haha.gif'},
        {'title': '可爱', 'url': 'keai.gif'},
        {'title': '可怜', 'url': 'kelian.gif'},
        {'title': '挖鼻', 'url': 'wabi.gif'},
        {'title': '吃惊', 'url': 'chijing.gif'},
        {'title': '害羞', 'url': 'haixiu.gif'},
        {'title': '挤眼', 'url': 'jiyan.gif'},
        {'title': '闭嘴', 'url': 'bizui.gif'},
        {'title': '鄙视', 'url': 'bishi.gif'},
        {'title': '爱你', 'url': 'aini.gif'},
        {'title': '泪', 'url': 'lei.gif'},
        {'title': '偷笑', 'url': 'touxiao.gif'},
        {'title': '亲亲', 'url': 'qinqin.gif'},
        {'title': '生病', 'url': 'shengbing.gif'},
        {'title': '太开心', 'url': 'taikaixin.gif'},
        {'title': '白眼', 'url': 'baiyan.gif'},
        {'title': '右哼哼', 'url': 'youhengheng.gif'},
        {'title': '左哼哼', 'url': 'zuohengheng.gif'},
        {'title': '嘘', 'url': 'xu.gif'},
        {'title': '衰', 'url': 'shuai.gif'},
        {'title': '吐', 'url': 'tu.gif'},
        {'title': '哈欠', 'url': 'haqian.gif'},
        {'title': '抱抱', 'url': 'baobao.gif'},
        {'title': '怒', 'url': 'nu.gif'},
        {'title': '疑问', 'url': 'yiwen.gif'},
        {'title': '馋嘴', 'url': 'chanzui.gif'},
        {'title': '拜拜', 'url': 'baibai.gif'},
        {'title': '思考', 'url': 'sikao.gif'},
        {'title': '汗', 'url': 'han.gif'},
        {'title': '困', 'url': 'kun.gif'},
        {'title': '睡', 'url': 'shui.gif'},
        {'title': '钱', 'url': 'qian.gif'},
        {'title': '失望', 'url': 'shiwang.gif'},
        {'title': '酷', 'url': 'ku.gif'},
        {'title': '色', 'url': 'se.gif'},
        {'title': '哼', 'url': 'heng.gif'},
        {'title': '鼓掌', 'url': 'guzhang.gif'},
        {'title': '晕', 'url': 'yun.gif'},
        {'title': '悲伤', 'url': 'beishang.gif'},
        {'title': '抓狂', 'url': 'zhuakuang.gif'},
        {'title': '黑线', 'url': 'heixian.gif'},
        {'title': '阴险', 'url': 'yinxian.gif'},
        {'title': '怒骂', 'url': 'numa.gif'},
        {'title': '互粉', 'url': 'hufen.gif'},
        {'title': '书呆子', 'url': 'shudaizi.gif'},
        {'title': '愤怒', 'url': 'fennu.gif'},
        {'title': '感冒', 'url': 'ganmao.gif'},
        {'title': '心', 'url': 'xin.gif'},
        {'title': '伤心', 'url': 'shangxin.gif'},
        {'title': '猪', 'url': 'zhu.gif'},
        {'title': '熊猫', 'url': 'xiongmao.gif'},
        {'title': '兔子', 'url': 'tuzi.gif'},
        {'title': '喔克', 'url': 'ok.gif'},
        {'title': '耶', 'url': 'ye.gif'},
        {'title': '棒棒', 'url': 'good.gif'},
        {'title': '不', 'url': 'no.gif'},
        {'title': '赞', 'url': 'zan.gif'},
        {'title': '来', 'url': 'lai.gif'},
        {'title': '弱', 'url': 'ruo.gif'},
        {'title': '草泥马', 'url': 'caonima.gif'},
        {'title': '神马', 'url': 'shenma.gif'},
        {'title': '囧', 'url': 'jiong.gif'},
        {'title': '浮云', 'url': 'fuyun.gif'},
        {'title': '给力', 'url': 'geili.gif'},
        {'title': '围观', 'url': 'weiguan.gif'},
        {'title': '威武', 'url': 'weiwu.gif'},
        {'title': '话筒', 'url': 'huatong.gif'},
        {'title': '蜡烛', 'url': 'lazhu.gif'},
        {'title': '蛋糕', 'url': 'dangao.gif'},
        {'title': '发红包', 'url': 'fahongbao.gif'}
      ]
    }
  },
  created() {
    // this.getUserList()

    this.$axios.get("/project/repo/userProject?userName=" + localStorage.getItem("token")).then(res => {
      console.log("res.data.data")
      // console.log(res.data.data)
      this.repoList = res.data.data
      this.userName = localStorage.getItem("token")
      var data=this.$route.query
      console.log(data)
      if(data.repoName!=null){
        console.log(data)
        this.choiceRepoName=data.repoName
        this.choicePRNumber=data.prNumber
        this.getPRNumberAndTitle(this.choicePRNumber)
      }
    })
  },
  methods: {

    getPRNumberAndTitle(val) {
      console.log("仓库是" + this.choiceRepoName)
      this.$axios.get('/prManage/prBase/getPRNumberAndTitle?userName=' + this.userName + '&repoName=' + this.choiceRepoName).then(res => {
        this.prNumberAndTitleList = res.data.data
        // console.log(this.prNumberAndTitleList)
        if(val !=null){
          console.log("valvalvalvalval"+val)
          console.log("this.prNumberAndTitleList[0]",this.prNumberAndTitleList[0])

          for(var i=0;i<this.prNumberAndTitleList.length;i++){
            var tempprNumberAndTitleList=this.prNumberAndTitleList[i];
            var tempPrNumber=tempprNumberAndTitleList.split(":");
            //如果找到该PRNumber对应的标题，就可以赋值，然后跳出
            if(tempPrNumber[0]===val){
              this.choicePRNumberAndTitle=tempprNumberAndTitleList;
              console.log("this.choicePRNumberAndTitle",this.choicePRNumberAndTitle);
              break;
            }
          }
          this.getPRDetail()
        }
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
        console.log(this.prDetail)
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
    //选择表情包
    choseEmoji: function (index, inner) {
      var con = '';
      if (!this.textareaMap[index]) {
        this.$set(this.textareaMap, index, '')
      }
      con = this.textareaMap[index] += '[' + inner + ']';
      this.$set(this.textareaMap, index, con)

    },
    showButton(index){
      //this.showFlag = true;
      console.log(index+"index");
      this.$set(this.buttonMap,index,true)
    },
    doSend(){
      console.log("====="+this.textareaMap);
      // this.$emit("doSend",this.textareaMap[0]);

      this.$set(this.textareaMap,0,'')
    },
    cancel(index){
      this.$set(this.buttonMap,index,false)
      if(index!==0){
        this.$set(this.replyMap,index,false)
      }
      console.log(index+"index");
      //this.showFlag = false;
    },
    pBodyStatus(index){
      this.$set(this.pBodyMap,index,!this.pBodyMap[index])
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

.comment{
  display: inline-block;
  vertical-align:top;
}

.emoj{
  /*width: 560px;*/
}
.publish{
  margin-top: 10px;
  display: inline-block;
  vertical-align:top;
}
.publish-btn{
  float: right;
}
.btn{
  width: 70px; /* 宽度 */
  margin-top: 3px;
  height: 30px; /* 高度 */
  border-width: 0px; /* 边框宽度 */
  border-radius: 3px; /* 边框半径 */
  background: #1189f1; /* 背景颜色 */
  cursor: pointer; /* 鼠标移入按钮范围时出现手势 */
  outline: none; /* 不显示轮廓线 */
  font-family: Microsoft YaHei; /* 设置字体 */
  color: white; /* 字体颜色 */
  font-size: 13px; /* 字体大小 */
  text-align: center;
  line-height: 30px;
  border-radius:5px;
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
}
.btn-cancel{
  background:grey; /* 背景颜色 */
}


.tmsg-respond h3{
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}
.tmsg-respond h3 small{
  font-size: smaller;
  cursor: pointer;
}
.tmsg-respond textarea{
  background:#f4f6f7;
  height:100px;
  margin-bottom: 10px;
}

.OwO{
  position: relative;
  z-index: 1;
}
.OwO .OwO-logo{
  position: relative;
  border-radius: 4px;
  color:#444;
  display: inline-block;
  background: #fff;
  border:1px solid #ddd;
  font-size: 13px;
  padding:0 6px;
  cursor: pointer;
  height:30px;
  box-sizing: border-box;
  z-index: 2;
  line-height: 30px;
}
.OwO .OwO-logo:hover{
  animation:a 5s infinite ease-in-out;
  -webkit-animation:a 5s infinite ease-in-out;
}
.OwO .OwO-body{
  position: absolute;
  background: #fff;
  border:1px solid #ddd;
  z-index: 1;
  top:29px;
  border-radius: 0 4px 4px 4px;
  display: none;
}
.OwO-open .OwO-body{
  display: block;
}
.OwO-open .OwO-logo{
  border-radius: 4px 4px 0 0;
  border-bottom: none;
}
.OwO-open .OwO-logo:hover{
  animation:none;
  -webkit-animation:none;
}
.OwO .OwO-items {
  max-height: 197px;
  overflow: scroll;
  font-size: 0;
  padding:10px;
  z-index: 1
}
.OwO .OwO-items .OwO-item{
  background: #f7f7f7;
  padding:5px 10px;
  border-radius: 5px;
  display: inline-block;
  margin: 0 10px 12px 0;
  transition: 0.3s;
  line-height: 19px;
  font-size: 20px;
  cursor: pointer;
}
.OwO .OwO-items .OwO-item:hover{
  background: #eee;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),
  0 3px 1px -2px rgba(0,0,0,.2),
  0 1px 5px 0 rgba(0,0,0,.12);
  animation:a 5s infinite ease-in-out;
  -webkit-animation:a 5s infinite ease-in-out;
}
.OwO .OwO-body .OwO-bar{
  width:100%;
  height:30px;
  border-top: 1px solid #ddd;
  background: #fff;
  border-radius: 0 0 4px 4px;
  color: #444;
}
.OwO .OwO-body .OwO-bar .OwO-packages li{
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
  padding: 0 10px;
  cursor: pointer;
  margin-right: 3px;
  text-align: center;
}
.OwO .OwO-body .OwO-bar .OwO-packages li:first-of-type{
  border-radius: 0 0 0 3px;
}
@-webkit-keyframes a{
  2%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
  4%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
  6%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}
  8%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}
  10%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}
  12%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
  14%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}
  16%{-webkit-transform:translateY(-.5px) rotate(-1.5deg);transform:translateY(-.5px) rotate(-1.5deg)}
  18%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}
  20%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
  22%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}
  24%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
  26%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}
  28%{-webkit-transform:translateY(.5px) rotate(1.5deg);transform:translateY(.5px) rotate(1.5deg)}
  30%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  32%,34%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}
  36%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
  38%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}
  40%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  42%{-webkit-transform:translateY(2.5px) rotate(-1.5deg);transform:translateY(2.5px) rotate(-1.5deg)}
  44%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}
  46%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
  48%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
  50%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}
  52%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
  54%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}
  56%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
  58%{-webkit-transform:translateY(.5px) rotate(2.5deg);transform:translateY(.5px) rotate(2.5deg)}
  60%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
  62%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  64%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
  66%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}
  68%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
  70%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}
  72%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}
  74%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
  76%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  78%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
  80%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
  82%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
  84%{-webkit-transform:translateY(1.5px) rotate(2.5deg);transform:translateY(1.5px) rotate(2.5deg)}
  86%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}
  88%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  90%{-webkit-transform:translateY(2.5px) rotate(-.5deg);transform:translateY(2.5px) rotate(-.5deg)}
  92%{-webkit-transform:translateY(.5px) rotate(-.5deg);transform:translateY(.5px) rotate(-.5deg)}
  94%{-webkit-transform:translateY(2.5px) rotate(.5deg);transform:translateY(2.5px) rotate(.5deg)}
  96%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
  98%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
  0%,to{-webkit-transform:translate(0) rotate(0deg);transform:translate(0) rotate(0deg)}
}
@keyframes a{
  2%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
  4%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
  6%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}
  8%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}
  10%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}
  12%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
  14%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}
  16%{-webkit-transform:translateY(-.5px) rotate(-1.5deg);transform:translateY(-.5px) rotate(-1.5deg)}
  18%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}
  20%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
  22%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}
  24%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
  26%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}
  28%{-webkit-transform:translateY(.5px) rotate(1.5deg);transform:translateY(.5px) rotate(1.5deg)}
  30%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  32%,34%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}
  36%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
  38%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}
  40%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  42%{-webkit-transform:translateY(2.5px) rotate(-1.5deg);transform:translateY(2.5px) rotate(-1.5deg)}
  44%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}
  46%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
  48%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
  50%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}
  52%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
  54%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}
  56%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
  58%{-webkit-transform:translateY(.5px) rotate(2.5deg);transform:translateY(.5px) rotate(2.5deg)}
  60%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
  62%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  64%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
  66%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}
  68%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
  70%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}
  72%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}
  74%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
  76%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  78%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
  80%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
  82%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
  84%{-webkit-transform:translateY(1.5px) rotate(2.5deg);transform:translateY(1.5px) rotate(2.5deg)}
  86%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}
  88%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
  90%{-webkit-transform:translateY(2.5px) rotate(-.5deg);transform:translateY(2.5px) rotate(-.5deg)}
  92%{-webkit-transform:translateY(.5px) rotate(-.5deg);transform:translateY(.5px) rotate(-.5deg)}
  94%{-webkit-transform:translateY(2.5px) rotate(.5deg);transform:translateY(2.5px) rotate(.5deg)}
  96%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
  98%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
  0%,to{-webkit-transform:translate(0) rotate(0deg);transform:translate(0) rotate(0deg)}
}
/*用户输入表单*/
.tmsg-r-info{
  margin:10px 0;
}
.tmsg-r-info input{
  height:30px;
  border-radius: 4px;
  background: #f4f6f7;
}
.tmsg-r-info .info-submit{
  margin: 10px 0;
  text-align: center;
}
.tmsg-r-info .info-submit p,.tmsg-commentshow h1{
  /*background: #97dffd;*/
  color:#fff;
  border-radius: 5px;
  cursor: pointer;
  /*transition: all .3s ease-in-out;*/
  height:30px;
  line-height: 30px;
  text-align: center;
}
/*.tmsg-r-info .info-submit p:hover{
    background: #47456d;
}*/
/*评论列表*/
.tmsg-comments .tmsg-comments-tip{
  display: block;
  border-left: 2px solid #363d4c;
  padding: 0 10px;
  margin: 40px 0;
  font-size: 20px;
}

.tmsg-commentshow>.tmsg-commentlist{
  border-bottom: 1px solid #e5eaed;
}

.tmsg-c-item article{
  margin:20px 0;
}
.tmsg-c-item article header{
  margin-bottom:10px;
}
.tmsg-c-item article header img{
  width: 65px;
  height: 65px;
  border-radius: 50%;
  float: left;
  transition: all .4s ease-in-out;
  -webkit-transition: all .4s ease-in-out;
  margin-right: 15px;
  object-fit: cover;
}
.tmsg-c-item article header img:hover{
  transform: rotate(360deg);
  -webkit-transform: rotate(360deg);
}
.tmsg-c-item article header .i-name{
  font-size: 14px;
  margin:5px 8px 7px 0;
  color:#444;
  font-weight: bold;
  display: inline-block;
}
.tmsg-c-item article header .i-class{
  display: inline-block;
  margin-left:10px;
  background: #dff0d8;
  color:#3c763d;
  border-radius: 5px;
  padding: 3px 6px;
  font-size: 12px;
  font-weight: 400;
}
.tmsg-c-item article header .i-time{
  color:#aaa;
  font-size: 12px;
}
.tmsg-c-item article section{
  margin-left: 80px;
}
.tmsg-c-item article section p img{
  vertical-align: middle;
}
.tmsg-c-item article section .tmsg-replay{
  margin:10px 0;
  font-size: 12px;
  color:#64609E;
  cursor: pointer;
}
.hbl-owo{
  text-align: left;
}

.hbl-fa{
  text-align: left;
}
.hbl-comm{
  padding: 40px;
}


.cc-to a{
  text-decoration:none;
  color: #409eff;
}

</style>
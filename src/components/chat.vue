<template>
  <div class="comp-chat">
    <div class="title">
      <div><i class="el-icon-s-promotion"></i>聊天</div>
      <div>
        <el-badge :value="waitUser.length" class="item">
          <el-button size="mini" @click="drawer = true">通知</el-button>
        </el-badge>
      </div>
    </div>
    <div class="chatBox">
      <el-row>
        <el-col :span="6">
          <div class="header" style="border-top-left-radius: 10px;">
            聊天列表
          </div>
          <ul class="userList">
            <li
              v-for="list in Object.keys(chartList)"
              :key="list"
              @click="setUser(list)"
            >
              用户{{ list }}
            </li>
          </ul>
        </el-col>
        <el-col :span="18">
          <div class="header" style="border-top-right-radius: 10px;">
            {{ user }}
          </div>
          <div class="body" id="chartBody">
            <div
              v-for="(item, index) in targetChat"
              :key="index"
              :class="{
                right: item.isKf,
                left: !item.isKf
              }"
            >
              <div v-if="item.type !== 'system'">
                <el-avatar :src="image" v-if="!item.isKf"></el-avatar>
                <p :class="{ right: item.isKf, left: !item.isKf }">
                  <span v-if="item.type === 'text'">{{ item.content }}</span>
                  <el-image
                    v-if="item.type === 'img'"
                    :src="item.content"
                    style="width:100px; height:100px"
                    :preview-src-list="[item.content]"
                  >
                  </el-image>
                </p>
                <el-avatar :src="image" v-if="item.isKf"></el-avatar>
              </div>
              <div v-else class="systemText">
                {{
                  item.content +
                    "    " +
                    new Date().getHours() +
                    ":" +
                    new Date().getMinutes() +
                    ":" +
                    new Date().getSeconds()
                }}
              </div>
            </div>
          </div>
          <div class="footer">
            <el-input
              type="textarea"
              v-model="kfInput"
              :autosize="{ minRows: 4, maxRows: 4 }"
            ></el-input>
            <div>
              <div style="margin-top:10px">
                <el-upload
                  class="upload-demo"
                  action="#"
                  :show-file-list="false"
                  :http-request="uploadImg"
                  :before-upload="beforeUpload"
                >
                  <el-button
                    type="warning"
                    size="mini"
                    icon="el-icon-picture"
                    title="发送图片"
                  ></el-button>
                </el-upload>
              </div>
              <div style="margin-top:10px">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-position"
                  title="发送"
                  @click="sendText"
                ></el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      size="20%"
      custom-class="noticeDrawer"
      :withHeader="false"
    >
      <el-tabs value="wait">
        <el-tab-pane label="等待用户" name="wait">
          <el-table
            :data="waitUser"
            size="mini"
            ref="waitTable"
            :height="sH + 'px'"
          >
            <el-table-column label="名称" prop="userPhone"></el-table-column>
            <el-table-column label="管理">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-check"
                  @click="accessUserIn(scope)"
                  >接入</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="系统通知" name="notice">
          <ul :style="{ height: sH + 'px' }" style="margin:5px;">
            <li
              v-for="(notice, index) in notices"
              :key="index"
              style="padding: 5px; border: 1px solid #ddd;word-break: break-all;border-radius:5px;"
            >
              {{
                notice.content +
                  new Date().getHours() +
                  ":" +
                  new Date().getMinutes() +
                  ":" +
                  new Date().getSeconds()
              }}
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import image from "@/assets/image/user.gif";
export default {
  name: "Chat",
  data() {
    return {
      user: "",
      kfInfo: {},
      image,
      kfInput: "",
      chartList: {}, // 当前客服接入的用户以及聊天记录 手机号为key
      waitUser: [], // 等待接入的用户
      websock: null,
      drawer: false,
      notices: [
        // 系统通知
      ]
    };
  },
  computed: {
    targetChat() {
      return this.chartList[this.user];
    },
    targetUserChatLength() {
      return this.chartList[this.user] && this.chartList[this.user].length;
    },
    sH() {
      return document.body.clientHeight - 100;
    }
  },
  watch: {
    targetUserChatLength() {
      let ele = document.getElementById("chartBody");
      this.$nextTick(() => {
        ele.scrollTop = ele.scrollHeight;
      });
    }
  },
  created() {
    this.kfInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.websock || this.initWebSocket();
  },
  methods: {
    accessUserIn(scope) {
      this.getConfigResult({
        msgType: 1,
        kefuId: this.kfInfo.id,
        kefuName: this.kfInfo.name,
        userPhone: scope.row.userPhone
      });
    },
    // websocket 初始化
    initWebSocket() {
      const token = sessionStorage.getItem("sessionId");
      if (!token) {
        this.$message.error("请先登录");
        this.$router.push({
          path: "/login"
        });
        return;
      }
      let ws = `ws://192.168.0.102:9876?access_token=${JSON.parse(
        token
      )}&loginType=system`;
      this.websock = new WebSocket(ws);
      this.websock.onmessage = e => {
        this.websocketonmessage(e);
      };
      this.websock.onclose = e => {
        this.websocketclose(e);
      };
      this.websock.onopen = () => {
        this.websocketOpen();
      };

      // 连接发生错误的回调方法
      this.websock.onerror = function() {
        console.log("WebSocket连接发生错误");
      };
    },
    // 实际调用的方法
    sendSock(agentData) {
      if (this.websock.readyState === this.websock.OPEN) {
        // 若是ws开启状态
        this.websocketsend(agentData);
      } else if (this.websock.readyState === this.websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(() => {
          this.sendSock(agentData);
        }, 1000);
      } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(() => {
          this.sendSock(agentData);
        }, 1000);
      }
    },
    // 数据接收 二进制文件处理
    websocketonmessage(e) {
      let reader = new FileReader();
      if (e.data instanceof Blob) {
        reader.readAsText(e.data, "UTF-8");
        reader.onload = () => {
          let str = JSON.parse(reader.result);
          this.getConfigResult(str);
        };
      } else {
        this.getConfigResult(JSON.parse(e.data));
      }
    },
    // 数据发送
    websocketsend(agentData) {
      this.websock.send(JSON.stringify(agentData));
    },
    // 关闭
    websocketclose(e) {
      console.log("connection closed (" + e.code + ")");
    },
    // 创建 websocket 连接
    websocketOpen() {
      console.log("连接成功");
    },
    getConfigResult(res) {
      console.log(res);
      /* 
        接收处理后的数据
        msgType:
        0 新用户等待接入（后台）userWaitAccess
        1 客服申请用户接入（后台）kfApplicationAccess
        2 客服成功接入kfSuccessAccess
        3 用户已被接入（用户端）userHasAccess
        4 用户消息userMessage
        5 客服消息kfMessage
        6 系统通知（用户端）
        7 系统通知（客服端）systemMessage
        8 用户下线userOutLine
        9 客服下线kfOutLine
      */
      const activeds = {
        userWaitAccess: res => {
          this.$notify({
            title: "新用户等待接入",
            message: res.context,
            type: "success"
          });
          this.waitUser.push(res);
        },
        kfApplicationAccess: res => {
          this.sendSock({
            msgType: 1,
            kefuId: res.kefuId,
            kefuName: res.kefuName,
            userPhone: res.userPhone
          });
        },
        kfSuccessAccess: res => {
          this.waitUser = this.waitUser.filter(
            // 等待列表移除已接入用户
            wait => wait.userPhone !== res.userPhone
          );
          this.user = res.userPhone;
          this.$set(this.chartList, res.userPhone, []);
        },
        userHasAccess: () => {
          // ...
        },
        userMessage: res => {
          const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
          const type = reg.test(res.context) ? "img" : "text";
          this.chartList[this.user].push({
            isKf: false,
            content: res.context,
            type: type
          });
        },
        kfMessage: () => {},
        systemMessage: res => {
          this.$notify({
            title: "系统通知",
            message: res.context,
            type: "success"
          });
          this.notices.push({
            conent: res.context
          });
        },
        userOutLine: res => {
          // 下线用户如果如当前聊天用户id一致 则提示  并放入系统通知里
          this.chartList[res.userPhone].push({
            isKf: true,
            content: "当前用户已下线",
            type: "system"
          });
          this.notices.push({
            content: `${res.userPhone}用户已下线`
          });
        },
        kfOutLine: () => {}
      };
      const aMap = new Map([
        [0, "userWaitAccess"],
        [1, "kfApplicationAccess"],
        [2, "kfSuccessAccess"],
        [3, "userHasAccess"],
        [4, "userMessage"],
        [5, "kfMessage"],
        [7, "systemMessage"],
        [8, "userOutLine"],
        [9, "kfOutLine"]
      ]);
      activeds[aMap.get(res.msgType)](res);
    },
    setUser(user) {
      this.user = user;
    },
    send({ isKf = true, content = "", type = "text" }) {
      this.sendSock({
        userPhone: this.user,
        kefuId: this.kfInfo.id,
        kefuName: this.kfInfo.name,
        msgType: 5,
        context: content
      });
      this.chartList[this.user].push({
        isKf,
        content,
        type
      });
    },
    sendText() {
      this.send({
        isKf: true,
        content: this.kfInput,
        type: "text"
      });
      this.kfInput = "";
    },
    uploadImg(params) {
      let fd = new FormData();
      fd.append("file", params.file);
      this.$http
        .post("/imRecordsController/multiUpload", fd)
        .then(s => {
          this.send({
            isKf: true,
            content: s.data[0],
            type: "img"
          });
        })
        .catch(e => {
          this.$message.error(e.msg);
        });
    },
    beforeUpload(file) {
      const { name } = file;
      if (
        ["jpg", "jpeg", "png"].includes(name.slice(name.lastIndexOf(".") + 1))
      ) {
        return true;
      } else {
        this.$message.warning("请选择图片");
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.comp-chat {
  font-size: 12px;
  position: relative;
  height: 100%;
  width: 100%;
  .title {
    padding: 20px;
    color: #409eff;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
  .chatBox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 70vh;
    width: 50vw;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0px 0px 15px #ddd;
    .el-row {
      height: 100%;
      width: 100%;
      .el-col {
        height: 100%;
      }
    }
    .userList {
      height: calc(100% - 42px);
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      border: 1px solid #ddd;
      li {
        height: 40px;
        width: 100%;
        line-height: 40px;
        padding-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
    }
    .userList::-webkit-scrollbar {
      display: none;
    }
    .header {
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid #ddd;
      background: #409eff;
      color: #fff;
    }
    .body {
      height: calc(70vh - 128px);
      padding: 0px 10px;
      overflow-y: auto;
      div {
        .el-avatar {
          height: 30px;
          width: 30px;
          vertical-align: top;
        }
      }
      div.left {
        text-align: left;
      }
      div.right {
        text-align: right;
      }
      div p {
        background-color: #fff;
        padding: 5px 8px;
        display: inline-block;
        border-radius: 6px;
        position: relative;
        max-width: 50%;
        word-wrap: break-word;
        color: #fff;
      }
      div p.left {
        background: green;
        margin: 5px 0 10px 10px;
      }
      div p.right {
        background: #409eff;
        margin: 5px 10px 10px 0px;
      }
      div p::after {
        content: "";
        border: 8px solid #ffffff00;
        position: absolute;
        top: 5px;
      }
      div p.left::after {
        border-right: 8px solid green;
        left: -15px;
      }
      div p.right::after {
        border-left: 8px solid #409eff;
        right: -15px;
      }
    }
    .body::-webkit-scrollbar {
      display: none;
    }
    .footer {
      display: flex;
      box-sizing: border-box;
      flex-flow: row nowrap;
      justify-content: space-around;
      .el-textarea {
        width: 85%;
      }
    }
  }
}
.systemText {
  height: 25px;
  line-height: 25px;
  background-color: #ddd;
  color: #fff;
  border-radius: 4px;
  width: 80%;
  margin: 0 auto;
  text-align: center;
}
</style>

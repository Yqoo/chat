<template>
  <div class="comp-chat">
    <p class="title"><i class="el-icon-s-promotion"></i>聊天</p>
    <div class="chatBox">
      <el-row>
        <el-col :span="6">
          <div class="header" style="border-top-left-radius: 10px;">
            聊天列表
          </div>
          <ul class="userList">
            <li v-for="list in allUser" :key="list" @click="setUser(list)">
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
              <el-avatar :src="image" v-if="!item.isKf"></el-avatar>
              <p :class="{ right: item.isKf, left: !item.isKf }">
                {{ item.content }}
              </p>
              <el-avatar :src="image" v-if="item.isKf"></el-avatar>
            </div>
          </div>
          <div class="footer">
            <el-input
              type="textarea"
              v-model="kf.targetChat"
              :autosize="{ minRows: 4, maxRows: 4 }"
            ></el-input>
            <div>
              <div style="margin-top:10px">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-picture"
                  title="发送图片"
                  @click="mockyh"
                ></el-button>
              </div>
              <div style="margin-top:10px">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-position"
                  title="发送"
                  @click="send"
                ></el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import image from "@/assets/image/user.gif";
export default {
  name: "Chat",
  data() {
    return {
      user: "",
      image,
      kf: {
        targetChat: ""
      },
      allUser: [], // 所有已接入的用户
      chartList: {}, // 当前客服接入的用户
      websock: null
    };
  },
  computed: {
    targetChat() {
      return this.chartList[this.user];
    },
    targetUserChatLength() {
      return this.chartList[this.user] && this.chartList[this.user].length;
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
    this.initWebSocket();
    this.getConfigResult({
      msgType: 2,
      userPhone: "18215554225"
    });
  },
  methods: {
    // websocket 初始化
    initWebSocket() {
      const token = sessionStorage.getItem("sessionId");
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
      var reader = new FileReader();
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
      /* 
        接收处理后的数据
        msgType: 0 新用户等待接入（后台）userWaitAccess
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
        userWaitAccess: () => {
          console.log(0);
        },
        kfApplicationAccess: () => {},
        kfSuccessAccess: () => {
          this.user = res.userPhone;
          this.$set(this.chartList, res.userPhone, []);
          this.allUser.push(res.userPhone);
        },
        userHasAccess: () => {
          this.allUser.push(res.userPhone);
        },
        userMessage: () => {},
        kfMessage: () => {},
        systemMessage: () => {},
        userOutLine: () => {},
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
      activeds[aMap.get(res.msgType)]();
    },
    websocketToLogin() {
      const info = JSON.parse(localStorage.getItem("userInfo"));
      this.sendSock({
        userPhone: "18011502613",
        kefuId: info.id,
        kefuName: info.name,
        msgType: 1,
        context: ""
      });
    },
    setUser(user) {
      this.user = user;
    },
    send() {
      /* this.websocketToLogin(); */
      this.chartList[this.user].push({
        isKf: true,
        content: new Date().getTime() + "xx"
      });
      console.log(this.chartList[this.user]);
    },
    mockyh() {
      this.getConfigResult({
        msgType: 2,
        userPhone: new Date().getTime()
      });
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
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    color: #409eff;
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
        left: -16px;
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
</style>

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
            <li v-for="list in 100" :key="list" @click="setUser(list)">
              用户{{ list }}
            </li>
          </ul>
        </el-col>
        <el-col :span="18">
          <div class="header" style="border-top-right-radius: 10px;">
            用户{{ user }}
          </div>
          <div class="body" id="chartBody">
            <div
              v-for="(item, index) in chartList"
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
           <!--  <div class="right">
              <el-avatar :src="image"></el-avatar>
              <p class="right">
                xxxxxxxxxxxxxxxxxxxx
              </p>
            </div> -->
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
      user: "xxx",
      image,
      kf: {
        targetChat: ""
      },
      chartList: [
        { isKf: false, content: "xxxxx" },
        { isKf: false, content: "xxxxx" },
        { isKf: true, content: "xxxxx" },
        { isKf: false, content: "xxxxx" },
        { isKf: false, content: "xxxxx" },
        { isKf: true, content: "xxxxx" }
      ]
    };
  },
  watch: {
    "chartList.length"() {
      let ele = document.getElementById("chartBody");
      console.log(ele.lastChild);
      ele.scrollTop = ele.scrollHeight;
    }
  },
  methods: {
    setUser(user) {
      this.user = user;
    },
    send() {
      this.chartList.push({
        isKf: true,
        content: this.kf.targetChat
      });
    },
    mockyh() {
      this.chartList.push({
        isKf: false,
        content: this.kf.targetChat
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
        right: -16px;
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

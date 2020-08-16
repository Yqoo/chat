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
          <div class="body"></div>
          <textarea class="footer"></textarea>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  data() {
    return {
      user: "xxx"
    };
  },
  methods: {
    setUser(user) {
      this.user = user;
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
      height: calc(70vh - 170px);
      border-bottom: 1px solid #ddd;
    }
    .footer {
      height: 125px;
      width: 100%;
      border: none;
      box-sizing: border-box;
    }
  }
}
</style>

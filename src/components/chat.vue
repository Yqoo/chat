<template>
  <div class="comp-chat">
    <p class="title"><i class="el-icon-s-promotion"></i>聊天</p>
    <div class="chatBox">
      <div class="header">
        某某用户
      </div>
      <div class="body"></div>
      <textarea class="footer"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  data() {
    return {};
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
    width: 30vw;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0px 0px 15px #ddd;
    .header {
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid #ddd;
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

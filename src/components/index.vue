<template>
  <div class="chat_index">
    <div class="main">
      <el-avatar :src="avatar" style="height:80px;width:80px"></el-avatar>
      <p>欢迎使用本管理平台</p>
    </div>
  </div>
</template>

<script>
import avatar from "@/assets/image/kefu.png";
export default {
  name: "index",
  data() {
    return {
      avatar
    };
  }
};
</script>

<style lang="scss" scoped>
.chat_index {
  .main {
    width: 200px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 13px;
  }
}
</style>

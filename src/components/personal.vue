<template>
  <div class="comp-personal">
    <div class="main">
      <p class="top">
        <span>个人信息</span>
        <i
          v-show="notEdit"
          class="el-icon-edit-outline"
          title="编辑"
          @click="notEdit = false"
        ></i>
        <i
          v-show="!notEdit"
          class="el-icon-switch-button"
          title="取消"
          @click="notEdit = true"
        ></i>
      </p>
      <div class="avatar">
        <el-avatar :src="avatar"></el-avatar>
        <p>Admin</p>
      </div>
      <el-form :model="form" :rules="rules" size="mini" label-width="0px">
        <el-form-item label="">
          <el-input v-model="form.name" :disabled="notEdit"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            type="password"
            v-model="form.password"
            :disabled="notEdit"
          ></el-input>
        </el-form-item>
        <el-button
          v-show="!notEdit"
          style="width: 100%"
          type="success"
          size="mini"
          >保存</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import avatar from "@/assets/image/user.gif";
export default {
  name: "Personal",
  data() {
    return {
      avatar,
      form: {
        name: "Admin",
        password: "123456"
      },
      rules: {},
      notEdit: true
    };
  }
};
</script>

<style lang="scss" scoped>
.comp-personal {
  font-size: 12px;
  width: 100%;
  height: 100%;
  position: relative;
  .main {
    height: 550px;
    width: 350px;
    border-radius: 5px;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 10px #ddd;
    .top {
      position: relative;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ddd;
      padding-left: 10px;
      i {
        position: absolute;
        right: 10px;
        top: 19px;
        font-size: 15px;
        color: #409eff;
        cursor: pointer;
      }
    }
    .avatar {
      text-align: center;
      padding: 20px;
      .el-avatar {
        height: 70px;
        width: 70px;
      }
    }
    .el-form {
      margin: 20px;
    }
  }
}
</style>

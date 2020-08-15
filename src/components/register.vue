<template>
  <div class="comp-register">
    <p class="title"><i class="el-icon-service"></i>添加客服</p>
    <div class="main">
      <el-form
        :model="form"
        :rules="rules"
        size="mini"
        ref="form"
        label-width="50px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button type="info" size="mini">取消</el-button>
        <el-button type="success" size="mini">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      form: {
        name: "",
        password: ""
      },
      rules: {
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.comp-register {
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 12px;
  .title {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    color: #409eff;
  }
  .main {
    position: absolute;
    width: 400px;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<template>
  <div
    class="comp-login"
    :style="{ backgroundImage: 'url(' + wallpaper + ')' }"
  >
    <div class="main">
      <p class="title">MyChat</p>
      <el-form
        :model="form"
        :rules="rules"
        size="small"
        ref="form"
        label-width="0px"
      >
        <el-form-item label="" prop="account">
          <el-input
            v-model="form.account"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="success" size="small" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import wallpaper from "@/assets/image/wallpaper.jpg";
export default {
  name: "Login",
  data() {
    return {
      wallpaper,
      form: {
        account: "",
        password: ""
      },
      rules: {
        account: [{ required: true, message: "请填写账号", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$http
            .get(
              `/userController/login?account=${this.form.account}&password=${this.form.password}`
            )
            .then(s => {
              const { user } = s.data;
              localStorage.setItem("Token", new Date().getTime());
              localStorage.setItem(
                "userInfo",
                JSON.stringify({
                  id: user.id,
                  account: user.account,
                  name: user.name
                })
              );
              this.$router.push({
                path: "/"
              });
            })
            .catch(e => this.$message.error(e.msg));
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.comp-login {
  position: relative;
  font-size: 12px;
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  background-position: center center;
  .main {
    position: absolute;
    width: 30vw;
    height: 30vh;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    box-shadow: 0px 0px 20px gray;
    .title {
      text-align: center;
      padding: 10px;
      font-size: 30px;
    }
    .el-form {
      margin: 20px;
    }
  }
  .btns {
    display: flex;
    flex: 1;
    margin: 0px 20px;
    text-align: center;
    .el-button {
      width: 100%;
    }
  }
}
</style>

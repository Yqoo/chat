<template>
  <div class="comp-home">
    <el-row>
      <el-col :span="isCollapse ? 1 : 4">
        <div class="top left">
          <img :src="require('@/assets/image/logo.png')" />
          <span v-if="!isCollapse">MyChat</span>
        </div>
        <el-menu
          default-active="register"
          class="el-menu-vertical-demo"
          background-color="rgba(48,65,86,1)"
          text-color="#fff"
          active-text-color="#4390de"
          router
          :collapse="isCollapse"
        >
          <el-menu-item index="register">
            <i class="el-icon-user"></i>
            <span slot="title">添加客服</span>
          </el-menu-item>
          <el-menu-item index="history">
            <i class="el-icon-date"></i>
            <span slot="title">历史消息</span>
          </el-menu-item>
          <el-menu-item index="chat">
            <i class="el-icon-chat-dot-square"></i>
            <span slot="title">聊天</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="isCollapse ? 23 : 20">
        <div class="top right">
          <div>
            <div>
              <i
                class="el-icon-s-fold"
                style="cursor:pointer;margin-right:10px"
                @click="isCollapse = !isCollapse"
              ></i>
              <!--  <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }"
                  >首页</el-breadcrumb-item
                >
                <el-breadcrumb-item>活动管理</el-breadcrumb-item>
              </el-breadcrumb> -->
            </div>
          </div>
          <div>
            <el-dropdown trigger="click">
              <div>
                <img :src="require('@/assets/image/user.gif')" />
                <i class="el-icon-caret-bottom"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-user-solid"
                  >个人中心</el-dropdown-item
                >
                <el-dropdown-item divided icon="el-icon-switch-button"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <transition name="slide-fade">
          <router-view></router-view>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false
    };
  }
};
</script>
<style lang="scss" scoped>
.comp-home {
  width: 100%;
  height: 100%;
  .el-row {
    .top {
      height: 50px;
      line-height: 50px;
    }
    .left {
      padding-left: 10px;
      background: rgba(48, 65, 86, 1);
      color: #fff;
      img {
        height: 40px;
        vertical-align: top;
        margin-top: 4px;
      }
      span {
        font-size: 25px;
        padding-left: 5px;
      }
    }
    .right {
      padding: 0px 20px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      & :nth-child(1) {
        div {
          display: flex;
          height: 50px;
          line-height: 50px;
          i {
            line-height: 50px;
          }
          .el-breadcrumb {
            font-size: 12px;
          }
        }
      }
      & :nth-child(2) {
        margin-right: 20px;
        img {
          height: 40px;
          margin: 5px 5px 0px 0px;
          border-radius: 10px;
          vertical-align: sub;
          cursor: pointer;
        }
        i {
          cursor: pointer;
        }
      }
    }
    height: 100%;
    .el-col {
      height: calc(100% - 50px);
      .el-menu {
        height: 100%;
        .el-menu-item {
          height: 46px;
          line-height: 46px;
          font-size: 12px;
          i {
            color: #fff;
            font-size: 14px;
          }
        }
      }
    }
  }
  .slide-fade-enter-active {
    transition: all 0.8s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>

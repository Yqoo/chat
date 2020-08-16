<template>
  <div class="comp-register">
    <p class="title"><i class="el-icon-service"></i>客服管理</p>
    <el-table
      :data="tableData"
      size="mini"
      ref="table"
      style="width:100%"
      :height="tHeight"
    >
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="账号" prop="account"></el-table-column>
      <el-table-column label="密码" prop="password"></el-table-column>
      <el-table-column width="200px" fixed="right">
        <template slot="header">
          <div style="display: flex">
            <el-input
              v-model="search"
              placeholder="键入关键词回车搜索"
              prefix-icon="el-icon-search"
            ></el-input>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-circle-plus"
              style="margin-left:5px"
              title="添加"
              @click="addRow"
            ></el-button>
          </div>
        </template>
        <template slot-scope="scope">
          <el-tag type="success" @click="tableRowHandler(scope, 'update')"
            >编辑</el-tag
          >
          <el-tag
            type="danger"
            style="margin-left:5px;"
            @click="tableRowHandler(scope, 'del')"
            >删除</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 客服 -->
    <el-dialog
      :visible.sync="form.visible"
      :modal="false"
      width="30%"
      :close-on-click-modal="false"
      @close="formClose"
    >
      <div slot="title">
        <i class="el-icon-document"></i>
        <span>添加客服</span>
      </div>
      <el-form
        :model="form.data"
        :rules="form.rules"
        size="mini"
        ref="form"
        label-width="50px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="form.data.name"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="form.data.account"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.data.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="mini" @click="form.visible = false"
          >取消</el-button
        >
        <el-button type="success" size="mini" @click="confirmSave"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      tableData: [],
      search: "",
      form: {
        visible: false,
        data: {
          name: "",
          account: "",
          password: ""
        },
        rules: {
          name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
          account: [{ required: true, message: "请填写账号", trigger: "blur" }],
          password: [{ required: true, message: "请填写密码", trigger: "blur" }]
        }
      }
    };
  },
  computed: {
    tHeight() {
      return document.body.clientHeight - 200;
    }
  },
  methods: {
    tableRowHandler(data, type) {
      const activeds = {
        del: () => {
          this.$confirm("确认删除当前数据？", "删除", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "danger"
          })
            .then(() => {
              const { $index } = data;
              this.tableData.splice($index, 1);
            })
            .catch(e => e);
        }
      };
      activeds[type]();
    },
    confirmSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.form.data);
          this.tableData.push(params);
          this.form.visible = false;
        }
      });
    },
    formClose() {
      Object.assign(this.form.data, {
        name: "",
        account: "",
        password: ""
      });
    },
    addRow() {
      this.form.visible = true;
    }
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
  /* .main {
    position: absolute;
    width: 400px;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  } */
}
</style>

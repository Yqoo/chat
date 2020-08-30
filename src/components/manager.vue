<template>
  <div class="comp-manager">
    <p class="title"><i class="el-icon-service"></i>客服管理</p>
    <el-table
      :data="table.data"
      size="mini"
      ref="table"
      style="width:100%"
      :height="tHeight"
    >
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="账号" prop="account"></el-table-column>
      <el-table-column label="权限" prop="userType">
        <template slot-scope="scope">
          {{ scope.row.userType ? "管理人员" : "普通人员" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statu">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? "启用" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column width="250px" fixed="right">
        <template slot="header" slot-scope="scope">
          <div style="display: flex">
            <el-input
              v-model="search"
              placeholder="回车搜索"
              prefix-icon="el-icon-search"
              @keyup.enter.native="searchSth(scope)"
            >
              <el-select v-model="sType" slot="prepend" style="width:90px">
                <el-option label="姓名" value="name"></el-option>
                <el-option label="账号" value="account"></el-option>
              </el-select>
            </el-input>
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
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper"
      :total="table.total"
      :page-size="table.size"
      @current-change="curChange"
    />
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
        <span>{{ form.statu ? "修改" : "添加" }}客服</span>
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
            :disabled="form.statu ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.data.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio v-model="form.data.status" :label="1">启用</el-radio>
          <el-radio v-model="form.data.status" :label="0">停用</el-radio>
        </el-form-item>
        <el-form-item label="权限" prop="userType">
          <el-radio-group v-model="form.data.userType" size="mini">
            <el-radio :label="0" border>普通人员</el-radio>
            <el-radio :label="1" border>管理人员</el-radio>
          </el-radio-group>
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
  name: "manager",
  data() {
    return {
      userInfo: null,
      table: {
        data: [],
        total: 0,
        size: 30,
        current: 1
      },
      search: "",
      sType: "name",
      form: {
        visible: false,
        statu: 0,
        data: {
          name: "",
          account: "",
          password: "",
          userType: 0,
          status: 0
        },
        rules: {
          name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
          account: [{ required: true, message: "请填写账号", trigger: "blur" }],
          password: [{ required: true, message: "请填写密码", trigger: "blur" }]
        }
      },
      row: null
    };
  },
  computed: {
    tHeight() {
      return document.body.clientHeight - 150;
    }
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.getPage({
      cur: this.table.current,
      size: this.table.size
    });
  },
  methods: {
    searchSth() {
      this.getPage({
        [this.sType]: this.search,
        cur: this.table.current,
        size: this.table.size
      });
    },
    tableRowHandler(data, type) {
      const activeds = {
        update: () => {
          this.form.statu = 1;
          const { row } = data;
          this.row = row;
          this.form.data.name = row.name;
          this.form.data.account = row.account;
          this.form.data.userType = row.userType;
          this.form.data.status = row.status;
          this.form.data.password = "";
          this.form.visible = true;
        }
      };
      activeds[type]();
    },
    confirmSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.form.data);
          let url = "";
          if (this.form.statu)
            url = `userController/adminUpdate?id=${this.row.id}&`;
          else url = `userController/add?`;
          const compliteUrl = `${url}name=${params.name}&account=${params.account}&password=${params.password}&userType=${params.userType}&status=${params.status}`;
          this.$http
            .get(compliteUrl)
            .then(s => {
              const Row = Object.assign({}, s.data);
              this.form.statu
                ? this.getPage({
                    cur: this.table.current,
                    size: this.table.size
                  })
                : this.table.data.push(Row);
              this.$message.success("保存成功");
              this.form.visible = false;
            })
            .catch(e => this.$message.error(e.msg));
        }
      });
    },
    formClose() {
      Object.assign(this.form.data, {
        name: "",
        account: "",
        password: ""
      });
      this.form.statu = 0;
    },
    getPage({ name = "", account = "", cur, size }) {
      const url = `userController/pageList?name=${name}&account=${account}&current=${cur}&size=${size}`;
      this.$http
        .get(url)
        .then(s => {
          const { records } = s.data;
          this.table.data = records;
          this.table.total = s.data.total;
        })
        .catch(e => this.$message.error(e.msg));
    },
    curChange(cur) {
      this.table.current = cur;
      this.getPage({
        cur,
        size: this.table.size
      });
    },
    addRow() {
      this.form.visible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.comp-manager {
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
}
</style>

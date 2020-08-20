<template>
  <div class="comp-history">
    <p class="title"><i class="el-icon-chat-dot-square"></i>聊天记录</p>
    <el-table
      :data="table.data"
      size="mini"
      ref="table"
      style="width:100%;"
      :height="tHeight"
    >
      <el-table-column label="用户手机" prop="phone"></el-table-column>
      <el-table-column label="客服姓名" prop="name"></el-table-column>
      <el-table-column label="账号" prop="account"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="管理" width="200px" fixed="right">
        <template slot="header">
          <el-input
            prefix-icon="el-icon-search"
            size="mini"
            placeholder="键入关键词回车搜索"
            v-model="table.search"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "History",
  data() {
    return {
      table: {
        data: [],
        total: 0,
        size: 30,
        current: 1,
        search: ""
      }
    };
  },
  computed: {
    tHeight() {
      return document.body.clientHeight - 200;
    }
  },
  created() {
    this.getPage({ cur: 1, size: 30 });
  },
  methods: {
    getPage({ phone = "", id = "", name = "", cur, size }) {
      /* /imRecordsController/pageList?userPhone&kefuId&kefuName&current&size */
      const url = `imRecordsController/pageList?userPhone=${phone}&kefuId=${id}&kefuName=${name}&current=${cur}&size=${size}`;
      this.$http
        .get(url)
        .then(s => {
          console.log(s);
        })
        .catch(e => this.$message.error(e.msg));
    }
  }
};
</script>

<style lang="scss" scoped>
.comp-history {
  height: 100%;
  width: 100%;
  font-size: 12px;
  .title {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    color: #409eff;
  }
}
</style>

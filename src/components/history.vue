<template>
  <div class="comp-history">
    <p class="title"><i class="el-icon-chat-dot-square"></i>聊天记录</p>
    <el-table
      :data="tableData"
      size="mini"
      ref="table"
      style="width:100%;"
      :height="tHeight"
    >
      <el-table-column label="用户手机" prop="phone"></el-table-column>
      <el-table-column label="客服姓名" prop="name"></el-table-column>
      <el-table-column label="账号" prop="account"></el-table-column>
      <el-table-column label="内容" prop="content"></el-table-column>
      <el-table-column label="管理" width="200px" fixed="right">
        <template slot="header">
          <el-input
            prefix-icon="el-icon-search"
            size="mini"
            placeholder="键入关键词回车搜索"
            v-model="search"
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
      tableData: [],
      search: ""
    };
  },
  computed: {
    tHeight() {
      return document.body.clientHeight - 200;
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

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
      <el-table-column label="用户手机" prop="userPhone"></el-table-column>
      <el-table-column label="客服姓名" prop="kefuName"></el-table-column>
      <el-table-column label="聊天详情" prop="detail">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="getChatDetail(scope)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="管理" width="200px" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input
            prefix-icon="el-icon-search"
            size="mini"
            placeholder="键入关键词回车搜索"
            v-model="table.search"
            @keyup.enter.native="searchSth(scope)"
          >
            <el-select v-model="sType" slot="prepend" style="width:90px">
              <el-option label="客服名称" value="kefuName"></el-option>
              <el-option label="用户手机" value="userPhone"></el-option>
            </el-select>
          </el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper"
      :total="table.total"
      :page-size="table.size"
      @current-change="curChange"
    />
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
      },
      sType: "kefuName"
    };
  },
  computed: {
    tHeight() {
      return document.body.clientHeight - 150;
    }
  },
  created() {
    this.getPage({ cur: 1, size: 30 });
  },
  methods: {
    getChatDetail(scope) {
      console.log(scope);
    },
    searchSth() {
      this.getPage({
        [this.sType]: this.table.search,
        cur: this.table.current,
        size: this.table.size
      });
    },
    curChange(cur) {
      this.table.current = cur;
      this.getPage({
        cur: cur,
        size: this.table.size
      });
    },
    getPage({ userPhone = "", id = "", kefuName = "", cur, size }) {
      const url = `imRecordsController/pageList?userPhone=${userPhone}&kefuId=${id}&kefuName=${kefuName}&current=${cur}&size=${size}`;
      this.$http
        .get(url)
        .then(s => {
          console.log(s);
          this.table.data = s.data.records;
          this.table.total = s.data.total;
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

<template>
  <div class="comp-history">
    <p class="title"><i class="el-icon-chat-dot-square"></i>聊天记录</p>
    <div style="text-align:right">
      <el-input
        prefix-icon="el-icon-search"
        size="mini"
        placeholder="键入关键词回车搜索"
        v-model="table.search"
        style="width: 30%"
        @keyup.enter.native="searchSth"
      >
        <el-select v-model="sType" slot="prepend" style="width:110px">
          <el-option label="客服名称" value="kefuName"></el-option>
          <el-option label="用户手机" value="userPhone"></el-option>
        </el-select>
      </el-input>
    </div>
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
          <el-button type="success" size="mini" @click="getChatDetail(scope)"
            >详情</el-button
          >
        </template>
      </el-table-column>
      <!--    <el-table-column label="管理" width="230px" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input
            prefix-icon="el-icon-search"
            size="mini"
            placeholder="键入关键词回车搜索"
            v-model="table.search"
            @keyup.enter.native="searchSth(scope)"
          >
            <el-select v-model="sType" slot="prepend" style="width:110px">
              <el-option label="客服名称" value="kefuName"></el-option>
              <el-option label="用户手机" value="userPhone"></el-option>
            </el-select>
          </el-input>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper"
      :total="table.total"
      :page-size="table.size"
      @current-change="curChange"
    />
    <!-- 详情 -->
    <el-dialog
      :visible.sync="detail.visible"
      :modal="false"
      width="50%"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <i class="el-icon-document"></i>
        <span>详情</span>
      </div>
      <el-table :data="detail.data" size="mini" style="width:100%">
        <el-table-column label="用户手机号" prop="userPhone"></el-table-column>
        <el-table-column label="客服名称" prop="kefuName"></el-table-column>
        <el-table-column label="类型" prop="msgType">
          <template slot-scope="scope">
            {{ detail.type[scope.row.msgType] }}
          </template>
        </el-table-column>
        <el-table-column
          label="内容"
          prop="context"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="时间" prop="createDate">
          <template slot-scope="scope">
            {{ transformTime(scope.row.createDate) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
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
      sType: "kefuName",
      detail: {
        visible: false,
        data: [],
        type: {
          0: "新用户等待接入（后台）userWaitAccess",
          1: "客服申请用户接入",
          2: "客服成功接入",
          3: "用户已被接入",
          4: "用户消息",
          5: "客服消息",
          6: "系统通知",
          7: "系统通知",
          8: "用户下线",
          9: "客服下线"
        }
      }
    };
  },
  computed: {
    tHeight() {
      return document.body.clientHeight - 180;
    }
  },
  created() {
    this.getPage({ cur: 1, size: 30 });
  },
  methods: {
    getChatDetail(scope) {
      this.$http
        .post(
          "/imRecordsController/selectById",
          qs.stringify({
            id: scope.row.id
          })
        )
        .then(s => {
          try {
            let data = JSON.parse(s.data.context);
            this.detail.data = data;
            this.detail.visible = true;
          } catch (error) {
            this.$message.error("数据格式错误");
          }
        });
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
          this.table.data = s.data.records;
          this.table.total = s.data.total;
        })
        .catch(e => this.$message.error(e.msg));
    },
    transformTime(timestamp = +new Date()) {
      if (timestamp) {
        let time = new Date(timestamp);
        let y = time.getFullYear(); //getFullYear方法以四位数字返回年份
        let M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        let d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
        let h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
        let m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
        let s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
        return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
      } else {
        return "";
      }
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

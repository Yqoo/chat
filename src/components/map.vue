<template>
  <div class="comp-map">
    <p class="title"><i class="el-icon-map-location"></i>地图管理</p>
    <el-table
      :data="table.data"
      size="mini"
      ref="table"
      style="width:100%;"
      :height="tHeight"
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="描述" prop="describes"></el-table-column>
      <el-table-column label="地址" prop="address"></el-table-column>
      <el-table-column label="经纬度" prop="jwd" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.longitude + "," + scope.row.latitude }}
        </template>
      </el-table-column>
      <el-table-column label="图片" prop="image"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status ? "启用" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column label="管理" width="250px" fixed="right">
        <template slot="header" slot-scope="scope">
          <div style="display:flex;flex-flow:row nowrap">
            <el-input
              prefix-icon="el-icon-search"
              size="mini"
              placeholder="回车搜索"
              v-model="table.search"
              @keyup.enter.native="searchSth(scope)"
            >
              <el-select v-model="sType" slot="prepend" style="width:90px">
                <el-option label="姓名" value="name"></el-option>
                <el-option label="地址" value="address"></el-option>
              </el-select>
            </el-input>
            <el-button
              type="text"
              icon="el-icon-circle-plus"
              title="添加"
              style="margin-left:5px;cursor:pointer;"
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
    <el-pagination
      layout="prev, pager, next, jumper"
      :total="table.total"
      :page-size="table.size"
      @current-change="curChange"
    />

    <!-- 添加|修改行 -->
    <el-dialog
      :visible.sync="row.visible"
      :modal="false"
      width="30%"
      :close-on-click-modal="false"
      @close="formClose"
    >
      <div slot="title">
        <i class="el-icon-document"></i>
        <span>{{ row.statu === "add" ? "添加" : "编辑" }}商家</span>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        size="mini"
        ref="form"
        label-width="60px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="describes">
          <el-input v-model="form.describes"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="经纬度" prop="jwd">
          <el-input
            v-model="form.jwd"
            disabled
            placeholder="点击右侧按钮查看地图"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="showBMap"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="true"
            :show-file-list="false"
            :http-request="upload"
            :before-upload="beforeUpload"
          >
            <el-input v-model="form.image"></el-input>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio :label="0" border>停用</el-radio>
            <el-radio :label="1" border>启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="mini" @click="row.visible = false"
          >取消</el-button
        >
        <el-button type="success" size="mini" @click="confirmSave"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 百度地图 -->
    <el-dialog
      :visible.sync="map.visible"
      :modal="false"
      width="50%"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <i class="el-icon-document"></i>
        <span>地图</span>
      </div>
      <div id="bmap" ref="bmap" style="height: 600px; width:100%"></div>
      <div slot="footer">
        <div style="float: left;line-height:28px;">
          当前经纬度： {{ map.jwd }}
        </div>
        <el-button type="info" size="mini" @click="map.visible = false"
          >取消</el-button
        >
        <el-button type="success" size="mini" @click="confirmJwd"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "Map",
  data() {
    return {
      table: {
        data: [],
        size: 30,
        current: 1,
        total: 0,
        search: ""
      },
      row: {
        visible: false,
        statu: "add",
        data: null
      },
      form: {
        name: "",
        describes: "",
        address: "",
        jwd: "",
        image: "",
        status: 0
      },
      rules: {
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        desc: [{ required: true, message: "请填写描述", trigger: "blur" }],
        address: [{ required: true, message: "请填写地址", trigger: "blur" }],
        jwd: [{ required: true, message: "请填写经纬度", trigger: "blur" }],
        image: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      file: null, //上传的文件,
      map: {
        visible: false,
        jwd: ""
      },
      sType: "name"
    };
  },
  computed: {
    tHeight() {
      return document.body.clientHeight - 150;
    }
  },
  created() {
    this.getPage({ current: this.table.current, size: this.table.size });
  },
  methods: {
    showBMap() {
      this.map.visible = true;
      this.$nextTick(() => {
        let map = new window.BMap.Map("bmap"); // 创建Map实例
        map.centerAndZoom(new window.BMap.Point(116.297047, 39.979542), 11); // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new window.BMap.MapTypeControl());
        map.centerAndZoom("成都"); // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        map.addEventListener("click", e => this.setJwd(e));
      });
    },
    setJwd(address) {
      /* "经度:" + e.point.lng + " , 纬度: " + e.point.lat */
      this.map.jwd = address.point.lng + "," + address.point.lat;
    },
    confirmJwd() {
      this.form.jwd = this.map.jwd;
      this.map.visible = false;
    },
    beforeUpload(file) {
      const { name } = file;
      const type = name.slice(name.lastIndexOf(".") + 1);
      const flag = ["png", "jpeg", "jpg"].includes(type);
      flag
        ? (this.form.image = name)
        : this.$message.warning("请上传格式为png/jpg的图片");
      return flag;
    },
    upload(params) {
      this.file = params.file;
    },
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
        },
        update: () => {
          const { row } = data;
          this.row.data = row;
          this.form.name = row.name;
          this.form.describes = row.describes;
          this.form.address = row.address;
          this.form.status = row.status;
          this.form.image = row.image;
          this.form.jwd = row.longitude + "," + row.latitude;
          this.row.statu = "update";
          this.row.visible = true;
        }
      };
      activeds[type]();
    },
    searchSth() {
      this.getPage({
        [this.sType]: this.table.search,
        current: this.table.current,
        size: this.table.size
      });
    },
    addRow() {
      this.row.visible = true;
    },
    formClose() {
      Object.assign(this.form, {
        name: "",
        describes: "",
        address: "",
        jwd: "",
        image: "",
        status: 0
      });
      this.file = null;
      this.row.statu = "add";
      this.row.data = null;
    },
    confirmSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let fd = new FormData();
          const row = Object.assign({}, this.form);
          fd.append("name", row.name);
          fd.append("describes", row.describes);
          fd.append("address", row.address);
          fd.append("longitude", row.jwd.split(",")[0]);
          fd.append("latitude", row.jwd.split(",")[1]);
          fd.append("image", this.file);
          if (this.row.statu === "update") fd.append("id", this.row.data.id);
          const url =
            this.row.statu === "add"
              ? "/storefrontsController/add"
              : "/storefrontsController/update";
          this.$http
            .post(url, fd)
            .then(s => {
              const Row = Object.assign({}, s.data);
              this.row.statu === "update"
                ? this.getPage({
                    current: this.table.current,
                    size: this.table.size
                  })
                : this.table.data.push(Row);
              this.$message.success("保存成功");
              this.row.visible = false;
            })
            .catch(e => this.$message.error(e.msg));
        }
      });
    },
    curChange(cur) {
      this.table.current = cur;
      this.getPage({
        current: cur,
        size: this.table.size
      });
    },
    getPage({ name = "", address = "", current, size }) {
      this.$http
        .post(
          "storefrontsController/pageList",
          qs.stringify({
            name,
            address,
            current,
            size
          })
        )
        .then(s => {
          this.table.data = s.data.records;
          this.table.total = s.data.total;
        })
        .catch(e => this.$message.error(e.msg));
    }
  }
};
</script>

<style lang="scss" scoped>
.comp-map {
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

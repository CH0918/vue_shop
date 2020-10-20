<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>

        <!-- 添加商品按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoodPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品表格区域 -->
      <el-table :data="goodList" border stripe>
        <!-- 序号列 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <!-- 商品价格 -->
        <el-table-column label="商品价格（元）" prop="goods_price" width="75px"></el-table-column>
        <!-- 商品重量 -->
        <el-table-column label="商品重量" prop="goods_weight" width="75px"></el-table-column>
        <!-- 创建时间 -->
        <el-table-column label="创建时间" width="150px" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormate }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" prop="goods_name" width="200px">
          <template slot-scope="scope">
              <!-- 编辑 -->
             <el-button size="mini" type="primary" icon="el-icon-edit" @click="editGood(scope.row.goods_id)">编辑</el-button>
              <!-- 删除 -->
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGood(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
    </el-card>

    <!-- 添加商品对话框 -->

  </div>
</template>
<script>
export default {
  data () {
    return {
      // 查询商品列表请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodList: [],
      // 商品总条数
      total: 0
    }
  },
  created: function () {
    this.getGoodList()
  },
  methods: {
    // 获取商品列表
    getGoodList: async function () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$http.error('获取商品列表失败')
      }
      console.log(res)
      this.goodList = res.data.goods
      this.total = res.data.total
    },
    // 编辑商品
    editGood: function (id) {
    },
    // 删除商品
    deleteGood: function (id) {
    },
    // 监听页大小改变事件
    handleSizeChange: function (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getGoodList()
    },
    // 监听页码事件
    handleCurrentChange: function (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getGoodList()
    },
    // 跳转到添加商品页面
    goAddGoodPage: function () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped></style>

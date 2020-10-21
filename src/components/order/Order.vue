<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryOrderParam.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="orderList" border stripe>
        <!-- 序号 -->
        <el-table-column type="index" label="序号"> </el-table-column>
        <!-- 订单编号 -->
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <!-- 订单价格 -->
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <!-- 是否付款 -->
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <!-- 是否发货 -->
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <!-- 下单时间 -->
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormate }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template>
            <!-- 编辑 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 物流进度 -->
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showLogisticsDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryOrderParam.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryOrderParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 查询物流对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="logisticsDialogVisible"
      width="50%"
    >
      <!-- 排序选择 -->
      <el-radio-group v-model="reverse">
        <el-radio :label="true">倒序</el-radio>
        <el-radio :label="false">正序</el-radio>
      </el-radio-group>
      <!-- 物流进度展示时间线 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(item, index) in LogisticsInfo"
          :key="index"
          :timestamp="item.timestamp"
        >
          {{ item.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 请求订单列表参数
      queryOrderParam: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      // 订单列表
      orderList: [],
      // 页码
      total: 0,
      // 物流进度
      logisticsDialogVisible: false,
      // 是否倒叙
      reverse: true,
      // 物流信息
      LogisticsInfo: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  created: function () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    getOrderList: async function () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryOrderParam
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    // 一页大小改变事件
    handleSizeChange: function (newPageSize) {
      this.queryOrderParam.pagesize = newPageSize
      this.getOrderList()
    },
    // 页码改变事件
    handleCurrentChange: function (newPageNum) {
      this.queryOrderParam.pagenum = newPageNum
      this.getOrderList()
    },
    // 获取物流信息 (后端接口有误)
    getLogisticsInfo: async function () {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败')
      }
      this.LogisticsInfo = res.data
      console.log(res)
    },
    // 展示物流查询对话框
    showLogisticsDialog: function () {
    //   this.getLogisticsInfo()
      this.logisticsDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped></style>

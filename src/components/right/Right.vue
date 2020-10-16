<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-table :data="rightList" border stripe>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="authName" label="订单管理"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="权限等级">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  created: function () {
    this.getRightList()
  },
  methods: {
    getRightList: async function () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
      }
      this.rightList = res.data
    }
  }
}
</script>
<style lang="less" scoped></style>

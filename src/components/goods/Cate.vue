<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类表格 -->

      <tree-table
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="cate_list"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted"
            style="color: lightGreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="danger">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opetation" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"
          @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 商品分类信息表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateForm"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="parentCateList"
            :props="parentCateProps"
            v-model="parentCateKeys"
            clearable
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <!-- 编辑分类表单 -->
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateForm"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 查询商品分类参数对象
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表
      cateList: [],
      // 查询到的总条数
      total: 0,
      // 表格各列定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opetation'
        }
      ],
      // 添加商品分类对话框展示状态
      addCateDialogVisible: false,
      // 添加商品分类表单
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加商品分类表单校验规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类下拉框信息
      parentCateKeys: [],
      parentCateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: true
      },
      // 1、2级分类列表
      parentCateList: [],
      // 编辑分类对话框状态
      editCateDialogVisible: false,
      // 编辑分类对象
      editCateForm: {
        cat_id: '',
        cat_name: ''
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    getCateList: async function () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听商品分类一页最大条数改变事件
    handleSizeChange: function (pagesize) {
      this.queryInfo.pagesize = pagesize
      console.log(`一页最大条数事件触发，pagesize = ${pagesize}`)
      this.getCateList()
    },
    // 监听页码变化事件
    handleCurrentChange: function (pagenum) {
      this.queryInfo.pagenum = pagenum
      console.log(`页码改变事件触发，pagenum = ${pagenum}`)
      this.getCateList()
    },
    // 展示添加分类对话框
    showCateDialog: function () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类下拉框信息
    getParentCateList: async function () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data
    },
    // 监听父类商品下拉框变化事件
    parentCateChanged: function () {
      console.log(this.parentCateKeys)
      if (this.parentCateKeys.length > 0) {
        // 说明选择了父级分类
        this.addCateForm.cat_pid = this.parentCateKeys[
          this.parentCateKeys.length - 1
        ]
        this.addCateForm.cat_level = this.parentCateKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    addCate: async function () {
      this.$refs.addCateForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入分类名称')
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败')
        }
        this.getCateList()
        this.addCateDialogVisible = false
        this.$message.success('添加分类成功')
      })
    },
    // 重置对话框中信息
    addCateDialogClosed: function () {
      // 重置表单校验规则
      this.$refs.addCateForm.resetFields()
      // 重置parentCateKeys
      this.parentCateKeys = []
      // 重置添加表单对象的值
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    showEditCateDialog: async function (id) {
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('编辑分类失败')
      }
      this.editCateForm.cat_id = res.data.cat_id
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateDialogVisible = true
    },
    // 编辑分类
    editCate: async function () {
      this.$refs.editCateForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('请出入分类名称')
        }
        const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类失败')
        }
        this.getCateList()
        this.editCateDialogVisible = false
        this.$message.success('编辑分类成功')
      })
    },
    // 监听关闭分类对话框事件
    editCateDialogClosed: function () {
      this.$refs.editCateForm.resetFields()
    },
    // 删除分类
    deleteCate: async function (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${id}`)
      console.log('====')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      //   await this.getCateList()
      await this.getTotal()
      const maxPage = Math.ceil(this.total / this.queryInfo.pagesize)
      if (this.queryInfo.pagenum > maxPage) {
        this.queryInfo.pagenum = maxPage
      }
      this.getCateList()
      this.$message.success('删除分类成功')
    },
    getTotal: async function () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return
      }
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
.cate_list {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>

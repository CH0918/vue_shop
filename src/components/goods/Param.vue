<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类级联下拉框 -->
      选择商品分类：
      <el-cascader
        :options="cateList"
        :props="cateProps"
        v-model="selectedKeys"
        clearable
        @change="cateChanged"
      ></el-cascader>
      <!-- 动态标签页 -->
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <!-- 动态参数页 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="btnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe="">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 参数tag列表 -->
                <el-tag
                  :key="i"
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleParamTagClose(scope.row, item)"
                >
                  {{ item }}
                </el-tag>
                <!-- 新增tag输入框 -->
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag输入框按钮 -->
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 修改 -->
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="showEditDialog(scope.row.attr_id)"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <!-- 删除 -->
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteParam(scope.row.attr_id)"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性页 -->
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            :disabled="btnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe="">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 参数tag列表 -->
                <el-tag
                  :key="i"
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleParamTagClose(scope.row, item)"
                >
                  {{ item }}
                </el-tag>
                <!-- 新增tag输入框 -->
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag输入框按钮 -->
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 序号列 -->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 修改 -->
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >修改</el-button
                >
                <!-- 删除 -->
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteParam(scope.row.attr_id)"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性对话框 -->
    <el-dialog
      :title="addDialogTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addParamForm"
        :rules="addParamFormRules"
        ref="addParamForm"
        label-width="80px"
      >
        <el-form-item :label="addFormLabel" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateAttribute()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数配置对话框 -->
    <el-dialog
      :title="editDialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editParamForm"
        :rules="editParamFormRules"
        ref="editParamForm"
        label-width="80px"
      >
        <el-form-item :label="editFormLabel" prop="attr_name">
          <el-input v-model="editParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品分类列表
      cateList: [],
      // 已选择的商品分类id
      selectedKeys: [],
      // 商品分类参数设置
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id'
      },
      // 当前激活动态标签页
      activeTabName: 'many',
      // 动态参数表格数据
      manyTableData: [],
      // 静态属性表格数据
      onlyTableData: [],
      // 添加tag事件是否执行过
      eventFlag: true,
      // 控制添加参数/属性的对话框的显示
      addDialogVisible: false,
      // 添加属性表单
      addParamForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      // 添加属性表单校验规则
      addParamFormRules: {
        attr_name: [
          { required: true, message: '请输入新的值', trigger: 'blur' }
        ]
      },
      // 当前参数配置项
      currentPatam: {},
      // 控制修改对话框展示
      editDialogVisible: false,
      // 修改对话框里的表单对象
      editParamForm: {
        attr_id: '',
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      // 修改对话框表单对象规则
      editParamFormRules: {
        attr_name: [
          { required: true, message: '请输入新的值', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 控制添加按钮的显示
    btnDisabled: function () {
      return this.selectedKeys.length < 3
    },
    // 根据动态标签页的切换显示不同的对话框标题
    addDialogTitle: function () {
      return this.activeTabName === 'many' ? '添加参数' : '添加属性'
    },
    // 根据动态标签页的切换显示不同的对话框label
    addFormLabel: function () {
      return this.activeTabName === 'many' ? '参数名称' : '属性名称'
    },
    // 根据动态标签页的切换显示不同的对话框label
    editFormLabel: function () {
      return this.activeTabName === 'many' ? '参数名称' : '属性名称'
    },
    editDialogTitle: function () {
      return this.activeTabName === 'many' ? '编辑参数' : '编辑属性'
    }
  },
  created: function () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    getCateList: async function () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      this.cateList = res.data
    },
    // 监听商品分类选择事件
    cateChanged: function () {
      if (this.selectedKeys.length < 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getCateAttributeList()
    },
    // 监听动态标签页切换事件
    handleTabClick: function () {
      if (this.selectedKeys.length < 3) {
        return
      }
      this.getCateAttributeList()
    },
    // 获取商品的参数/属性
    getCateAttributeList: async function () {
      const id = this.selectedKeys[this.selectedKeys.length - 1]
      const { data: res } = await this.$http.get(
        `categories/${id}/attributes`,
        { params: { sel: this.activeTabName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      // 将后端返回来的参数字符串类型转换成数组类型
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加tag输入框的inputVisable属性
        item.inputVisible = false
        // 给每一行数据添加inputValue值
        item.inputValue = ''
      })
      if (this.activeTabName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 修改参数
    editParam: async function () {
      this.$refs.editParamForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
        `categories/${
          this.selectedKeys[this.selectedKeys.length - 1]
        }/attributes/${this.editParamForm.attr_id}`,
        {
          attr_name: this.editParamForm.attr_name,
          attr_sel: this.activeTabName
        }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数项失败')
        }
        this.getCateAttributeList()
        this.editDialogVisible = false
        this.$message.success('修改参数项成功')
      })
    },
    // 删除参数
    deleteParam: async function (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${
          this.selectedKeys[this.selectedKeys.length - 1]
        }/attributes/${id}`,
        {
          attr_name: this.addParamForm.attr_name,
          attr_sel: this.activeTabName
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.getCateAttributeList()
      this.$message.success('删除成功')
    },
    // 监听删除参数tag
    handleParamTagClose: async function (row, item) {
      row.attr_vals.splice(row.attr_vals.indexOf(item), 1)
      this.addParamAttribute(row)
    },
    // 监听新增参数
    handleInputConfirm: function (row) {
      if (!this.eventFlag) {
        return
      }
      const inputValue = row.inputValue
      if (inputValue.trim()) {
        row.attr_vals.push(inputValue)
      }
      this.addParamAttribute(row)
      row.inputVisible = false
      row.inputValue = ''
      this.eventFlag = false
    },
    // 添加动态/静态参数值
    addParamAttribute: async function (row) {
      const { data: res } = await this.$http.put(
        `categories/${
          this.selectedKeys[this.selectedKeys.length - 1]
        }/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeTabName,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },
    // 点击事件，添加参数tag
    showInput: function (row) {
      row.inputVisible = true
      this.eventFlag = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 添加参数/属性
    addCateAttribute: async function () {
      this.$refs.addParamForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(
        `categories/${
          this.selectedKeys[this.selectedKeys.length - 1]
        }/attributes`,
        {
          attr_name: this.addParamForm.attr_name,
          attr_sel: this.activeTabName
        }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.getCateAttributeList()
        this.addDialogVisible = false
        this.$message.success('添加成功')
      })
    },
    // 展示编辑参数对话框
    showEditDialog: function (id) {
      this.editDialogVisible = true
      this.getParamById(id)
    },
    // 根据Id获取参数配置项
    getParamById: async function (id) {
      const { data: res } = await this.$http.get(
        `categories/${
          this.selectedKeys[this.selectedKeys.length - 1]}/attributes/${id}
        }`,
        {
          attr_sel: this.activeTabName
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数项失败')
      }
      this.editParamForm.attr_name = res.data.attr_name
      this.editParamForm.attr_id = res.data.attr_id
      this.currentPatam = res.data
    },
    // 监听添加属性对话框关闭事件
    addDialogClosed: function () {
      this.$refs.addParamForm.resetFiled()
    },
    // 监听编辑属性对话框关闭事件
    editDialogClosed: function () {
      this.$refs.editParamForm.resetFiled()
    }
  }
}
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
.el-input {
  width: 100px;
}
.el-form-item .el-input {
  width: 100%;
}
</style>

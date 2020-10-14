<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索 添加区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryUserParam.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addUserDialog = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑用户 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="getEditUserById(scope.row.id)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button type="danger" icon="el-icon-delete" @click="deleteUserById(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryUserParam.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryUserParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="50%"
      @close="addUserDialogClose"
    >
      <!-- 内容主题区域 添加用户表单-->
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 更新用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 需要修改的用户信息表单 -->
      <el-form ref="editUserFormRef" :model="editUserForm" label-width="70px" :rules="editUserFormRules" status-icon>
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserById(editUserForm.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      const emailREG = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/
      const checkEmailResult = emailREG.test(value)
      if (!checkEmailResult) {
        return callback(new Error('邮箱格式有误'))
      }
      callback()
    }
    // 自定义手机校验规则
    var checkMobile = (rule, value, callback) => {
      const mobileREG = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      const checkMobileResult = mobileREG.test(value)
      if (!checkMobileResult) {
        return callback(new Error('手机格式有误'))
      }
      callback()
    }
    return {
      userList: [],
      queryUserParam: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addUserDialog: false,
      // 添加用户表单对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户信息对话框
      editDialogVisible: false,
      // 修改用户信息
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户校验规则
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.getUserList()
  },
  methods: {
    getUserList: async function () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryUserParam
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      console.log(res)
      this.total = res.data.total
      this.userList = res.data.users
    },
    handleSizeChange: function (pageSize) {
      this.queryUserParam.pagesize = pageSize
      this.getUserList()
    },
    handleCurrentChange: function (currentPage) {
      // console.log('当前页码：' + currentPage)
      this.queryUserParam.pagenum = currentPage
      this.getUserList()
    },
    userStateChange: async function (scopeRow) {
      const isOpenState = scopeRow.mg_state
      const { data: res } = await this.$http.put(
        `users/${scopeRow.id}/state/${scopeRow.mg_state}`
      )
      if (res.meta.status !== 200) {
        scopeRow.mg_state = !scopeRow.mg_state
        return this.$message.error('更新用户状态失败')
      }
      if (isOpenState) {
        this.$message.success('开启用户成功')
      } else {
        this.$message.success('关闭用户成功')
      }
    },
    addUserDialogClose: function () {
      this.$refs.addUserFormRef.resetFields()
    },
    // 添加用户
    addUser: function () {
      // 校验用户输入的信息是否正确
      this.$refs.addUserFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return this.$message.error('用户信息格式不正确')
        }
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // 关闭对话框
        this.addUserDialog = false
        // 重新获取用户列表
        this.getUserList()
      })
    },
    // 监听关闭编辑用户对话框事件
    editDialogClose: function () {
      this.$refs.editUserFormRef.resetFields()
    },
    // 获取需要更新的用户信息
    getEditUserById: async function (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editUserForm.id = res.data.id
      this.editUserForm.username = res.data.username
      this.editUserForm.email = res.data.email
      this.editUserForm.mobile = res.data.mobile
    },
    // 提交更新用户信息
    editUserById: async function (id) {
      // 校验提交的用户信息
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('用户信息格式不正确')
        }
        const { data: res } = await this.$http.put(`users/${id}`, { email: this.editUserForm.email, mobile: this.editUserForm.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 隐藏对话框
        this.editDialogVisible = false
        // 重新获取数据
        this.getUserList()
        // 提示更新成功
        this.$message.success('更新用户信息成功')
      })
    },
    deleteUserById: async function (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message('取消删除')
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.getUserList()
      this.$message.success('删除用户成功')
    }
  }
}
</script>
<style lang="less" scoped></style>

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
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisable = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-row>
        <el-col>
          <el-table :data="roleList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row
                  v-for="(item1, i1) in scope.row.children"
                  :key="item1.id"
                  :class="[
                    'bottom_line',
                    i1 === 0 ? 'top_line' : '',
                    'v_center'
                  ]"
                >
                  <!-- 一级权限 -->
                  <el-col :span="3">
                    <el-tag size="mini" closable>{{ item1.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 二三级权限 -->
                  <el-col :span="21">
                    <el-row
                      v-for="(item2, i2) in item1.children"
                      :key="item2.id"
                      :class="[i2 === 0 ? '' : 'top_line', 'v_center']"
                    >
                      <!-- 二级权限 -->
                      <el-col :span="4">
                        <el-tag type="success" size="mini" closable>{{
                          item2.authName
                        }}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 三级权限 -->
                      <el-col :span="20">
                        <el-tag
                          type="warning"
                          size="mini"
                          closable
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          @close="deleteRight(scope.row, item3.id)"
                          >{{ item3.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="getEditRoleById(scope.row.id)"
                  >编辑</el-button
                >
                <!-- 删除 -->
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteRoleById(scope.row.id)"
                  >删除</el-button
                >
                <!-- 分配权限 -->
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                  @click="getTreeRightList(scope.row)"
                  >分配权限</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisable"
      width="50%"
      @close="addRoleDialogClose"
    >
      <!-- 内容主题区域 添加角色表单-->
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="80px"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="更新角色信息"
      :visible.sync="editRoleDialogVisable"
      width="50%"
    >
      <!-- 更新角色信息 -->
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="80px"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 更新角色信息对话框按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editRoleById(editRoleForm.roleId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="settingRightDialogVisible"
      width="50%"
      @close="settingRightDialogClosed"
    >
      <!-- 权限树形控件 -->
      <el-tree
        :data="treeRightList"
        default-expand-all
        show-checkbox
        node-key="id"
        :props="rightProps"
        :default-checked-keys="defKeys"
        ref="treeRightListRef"
      >
      </el-tree>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 角色列表
      roleList: [],
      // 添加角色列表表单对象
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色列表输入框校验规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 添加角色列表对话框展示与否
      addRoleDialogVisable: false,
      // 更新角色对话框展示与否
      editRoleDialogVisable: false,
      // 更新角色表单对象
      editRoleForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 更新角色表单校验规则
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 分配权限对话框
      settingRightDialogVisible: false,
      // 树形权限
      treeRightList: [],
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      // 树形权限默认选中项
      defKeys: [],
      // 勾选了的权限节点
      checkedKeys: [],
      // 当前分配权限的角色Id
      roleId: ''
    }
  },
  created: function () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList: async function () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
      }
      this.roleList = res.data
    },
    // 关闭对话框，重置对话框中输入框的校验状态
    addRoleDialogClose: function () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色
    addRole: async function () {
      // 校验填写的角色信息是否正确
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入角色名称')
        }
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.getRoleList()
        this.addRoleDialogVisable = false
        this.$message.success('添加角色成功')
      })
    },
    // 获取需要编辑角色的信息
    getEditRoleById: async function (id) {
      this.editRoleDialogVisable = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.editRoleForm.roleName = res.data.roleName
      this.editRoleForm.roleDesc = res.data.roleDesc
      this.editRoleForm.roleId = res.data.roleId
    },
    // 编辑角色
    editRoleById: async function (id) {
      const { data: res } = await this.$http.put(`roles/${id}`, {
        roleName: this.editRoleForm.roleName,
        roleDesc: this.editRoleForm.roleDesc
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色信息失败')
      }
      this.getRoleList()
      this.editRoleDialogVisable = false
      this.$message.success('更新角色信息成功')
    },
    // 确认删除
    deleteRoleById: async function (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.getRoleList()
      this.$message.success('删除角色成功')
    },
    // 删除权限
    deleteRight: async function (role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      //   this.roleList = res.data
      // 返回最新的角色信息
      role.children = res.data
      this.$message.success('删除权限成功')
      //   this.roleList = res.data
    },
    // 获取树形权限列表
    getTreeRightList: async function (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取树形权限列表错误')
      }
      this.treeRightList = res.data
      this.roleId = role.id
      // 默认选中的节点
      this.getLeafKeys(role, this.defKeys)
      this.settingRightDialogVisible = true
    },
    // 通过递归的方式获取角色下面所有的三级权限id,保存到defKeys中
    getLeafKeys: function (node, arr) {
      if (!node.children) {
        // 节点中不包含children节点，说明是三级节点
        return arr.push(node.id)
      }
      // 不是三级节点，继续递归
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    settingRightDialogClosed: function () {
      this.defKeys = []
    },
    // 分配权限
    allotRight: async function () {
      const treeRightListRef = this.$refs.treeRightListRef
      this.checkedKeys = [...treeRightListRef.getCheckedKeys(), ...treeRightListRef.getHalfCheckedKeys()]
      const rids = this.checkedKeys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: rids })
      if (res.meta.status !== 200) {
        this.$message.error('分配权限失败')
      }
      this.getRoleList()
      this.settingRightDialogVisible = false
      this.$message.success('分配权限成功')
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.top_line {
  border-top: 1px solid #eee;
}
.bottom_line {
  border-bottom: 1px solid #eee;
}
.v_center {
  display: flex;
  align-items: center;
}
</style>

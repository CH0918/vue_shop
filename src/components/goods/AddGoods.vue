<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeName - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 添加商品的form表单 -->
      <el-form
        :model="addGoodForm"
        :rules="addGoodFormRules"
        ref="addGoodForm"
        label-width="80px"
        status-icon
        label-position="top"
      >
        <!-- 纵向tab -->
        <el-tabs
          tab-position="left"
          v-model="activeName"
          :before-leave="beforeLeaveTab"
          @tab-click="tabClick"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <!-- 商品名称 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodForm.goods_name"></el-input>
            </el-form-item>

            <!-- 商品价格 -->
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>

            <!-- 商品重量 -->
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>

            <!-- 商品数量 -->
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>

            <!-- 商品分类 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 商品分类级联选择器 -->
              <el-cascader
                :options="cateList"
                :props="cateProps"
                v-model="addGoodForm.goods_cat"
                @change="cateChanged"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="attr"
                  v-for="(attr, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="uploadHeader"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addGoodForm.goods_introduce"
            />
            <!-- 添加商品按钮 -->
          <el-button type="primary" class="addGoods" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
          <!-- 商品分类 -->
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
      <img :src="previewUrl" alt="" class="imgPreview" />
    </el-dialog>
  </div>
</template>
<script>
// 导入loadsh
import _ from 'loadsh'
export default {
  data () {
    var numberValidate = function (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('数字类型无效'))
      } else {
        callback()
      }
    }
    return {
      // 添加商品信息表单对象
      addGoodForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 校验商品信息表单对象规则
      addGoodFormRules: {
        goods_name: [
          { required: true, message: '请填写商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请填写商品价格', trigger: 'blur' },
          { validator: numberValidate, message: '商品价格应大于0', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请填写商品重量', trigger: 'blur' },
          { validator: numberValidate, message: '商品重量应大于0', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请填写商品数量', trigger: 'blur' },
          { validator: numberValidate, message: '商品价格应大于0', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请填写商品分类', trigger: 'blur' }
        ]
      },
      // 激活的tab名称
      activeName: '0',
      // 商品分类
      cateList: [],
      // 商品级联选择器参数
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id'
      },
      // 动态参数表格数据
      manyTableData: [],
      // 静态属性表格数据
      onlyTableData: [],
      // 图片上传路径
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片请求头
      uploadHeader: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览地址
      previewUrl: '',
      // 控制图片预览对话框的展示
      imgDialogVisible: false
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
      console.log(res)
    },
    // 监听级联选择器选择事件
    cateChanged: function () {
      if (this.addGoodForm.goods_cat.length < 3) {
        this.addGoodForm.goods_cat = []
      }
      console.log(this.addGoodForm.goods_cat)
    },
    // 将要离开tab面板前触发
    beforeLeaveTab: function (activeTabName, oldTabName) {
      if (oldTabName === '0' && this.addGoodForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
      var validResult = false
      this.$refs.addGoodForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请检查相关项是否填写正确')
        }
        validResult = true
      })
      return validResult
    },
    // 监听tab面板点击事件
    tabClick: async function () {
      console.log(this.activeName)
      // 访问商品参数面板
      if (this.activeName === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数列表数据失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else if (this.activeName === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性列表数据失败')
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    // 图片预览
    handlePreview: function (file) {
      const url = file.response.data.url
      this.previewUrl = url
      this.imgDialogVisible = true
    },
    // 图片移除
    handleRemove: function (file) {
      // 获取需要图片的路径
      const picURL = file.response.data.tmp_path
      // 找到该路径的索引值
      const index = this.addGoodForm.pics.indexOf(picURL)
      // 从数组中移除
      this.addGoodForm.pics.splice(index, 1)
    },
    // 图片上传成功钩子函数
    uploadSuccess: function (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodForm.pics.push(picInfo)
    },
    addGoods: function () {
      // 添加商品前先对商品进行预校验
      this.$refs.addGoodForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写商品的必要选项')
        }
        // 将商品分类数组转换成字符串
        // 由于级联选择器双向绑定的goods_cat是数组类型，转为字符串类型会报错，所以需要深拷贝一份出来
        const form = _.cloneDeep(this.addGoodForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数和静态属性
        console.log(this.manyTableData)
        this.manyTableData.forEach(item => {
          item.attr_vals = item.attr_vals.join(' ')
          const paramInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodForm.attrs.push(paramInfo)
        })
        this.onlyTableData.forEach(item => {
          const paramInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodForm.attrs.push(paramInfo)
        })
        form.attrs = this.addGoodForm.attrs
        console.log(form)
        // 发起添加商品请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.message)
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId: function () {
      if (this.addGoodForm.goods_cat.length === 3) {
        return this.addGoodForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-steps {
  margin-bottom: 20px;
}
.el-tag {
  margin: 0 10px 0 0 !important;
}
.imgPreview {
  width: 100%;
}
.addGoods {
  margin-top: 15px;
}
</style>

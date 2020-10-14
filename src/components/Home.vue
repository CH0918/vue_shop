<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type='info' @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_button" @click="toggleNav">|||</div>
        <el-menu
          :default-active="currentIndex"
          background-color="#2F3541"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened router :collapse="isCollapse"
          :collapse-transition="false">
          <el-submenu :index="navItem.id + ''" v-for="navItem in navList" :key="navItem.id">
            <template slot="title">
          <i :class="icomObj[navItem.id]"></i>
          <span>{{ navItem.authName }}</span>
            </template>
            <el-menu-item :index="'/' + secondItem.path" v-for="secondItem in navItem.children"  :key="secondItem.id" @click="saveCurrentIndex('/' + secondItem.path)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ secondItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data: function () {
    return {
      navList: [],
      icomObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      currentIndex: ''
    }
  },
  created: function () {
    this.getNavList()
    this.currentIndex = window.sessionStorage.getItem('currentIndex')
  },
  methods: {
    logout: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getNavList: async function () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.navList = res.data
    },
    saveCurrentIndex: function (currentIndex) {
      window.sessionStorage.setItem('currentIndex', currentIndex)
      this.currentIndex = currentIndex
    },
    toggleNav: function () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="less" scoped>
  .el-container {
    height: 100%;
    background-color: #333A3D;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    >div {
      display: flex;
      align-items: center;
      span {
        margin-left: 20px;
      }
    }
  }
  .el-aside {
    background-color: #2F3541;
    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background-color: #E7ECEF;
  }
  .el-submenu i {
    margin-right: 10px;
  }
  .toggle_button {
    height: 24px;
    background-color: #4A5064;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>

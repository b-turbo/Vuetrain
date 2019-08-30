<template>
<div class="role">
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<el-button type="success" @click="showAddDialog">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" border style="width: 100%;margin-top:15px">
        <el-table-column type="expand">
            <template slot-scope="scope">
               <!-- 这个内容在我们的项目中需要我们自己来生成 -->
              <el-row v-for="first in scope.row.children" :key="first.id" style="margin-bottom:15px;border-bottom:1px dashed #f00;">
            <el-col :span="4">
                <el-tag closable :type="'success'" @close="cnt=0;delRight(scope.row,first.id)">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
                <el-row v-for='second in first.children' :key='second.id'  style="margin-bottom:10px;">
                    <el-col :span="4"><el-tag closable :type="'info'" @close="cnt=0;delRight(scope.row,second.id)">{{second.authName}}</el-tag></el-col>
                    <el-col :span="20">
                        <el-tag closable :type="'error'" v-for='third in second.children' :key='third.id'  style="margin-right:5px;margin-bottom:5px" @close="cnt=0;delRight(scope.row,third.id)">{{third.authName}}</el-tag>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='24' v-show='scope.row.children.length === 0'>还没有任何的权限，先分配！！</el-col>
        </el-row>

            </template>
        </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="描述"></el-table-column>
        <el-table-column label="操作" width="400">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <el-button type="primary" icon="el-icon-edit"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
                    <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button type="warning" icon="el-icon-delete"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog title="权限分配" :visible.sync="grantdialogTableVisible">
      <el-tree
        :data="rightList"
        ref='tree'
        show-checkbox
        node-key="id"
        :default-expand-all='true'
        :default-checked-keys="chkedArr"
        :props="defaultProps"
      ></el-tree>
       <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :label-width="'80px'" ref='addForm'>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>
import { getRoleList, delRightByRoleId, grantRoleById, addRole } from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      roleId: '',
      cnt: 0,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      grantdialogTableVisible: false,
      roleList: [],
      rightList: [],
      chkedArr: [],

      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogFormVisible: false
    }
  },
  methods: {
    async addRole () {
      try {
        let res = await addRole(this.addForm)
        if (res.data.meta.status === 201) {
          this.$message.success(res.data.meta.msg)
          this.addDialogFormVisible = false
          this.init()
          this.$refs.addForm.resetFields()
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (exp) {
        this.$message.error('服务器异常')
      } finally {

      }
    },
    showAddDialog () {
      this.addDialogFormVisible = true
    },
    async grantRole () {
      let arr = this.$refs.tree.getCheckedNodes()
      let temp = []
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      temp = temp.join(',').split(',')
      temp = [...new Set(temp)]
      let res = await grantRoleById(this.roleId, temp.join(','))
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.grantdialogTableVisible = false
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    showGrantDialog (row) {
      this.roleId = row.id
      this.grantdialogTableVisible = true
      this.rightList = [...this.rightList]
      this.chkedArr.length = 0

      row.children.forEach(first => {
        if (first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children.length > 0) {
              second.children.forEach(third => {
                this.chkedArr.push(third.id)
              })
            }
          })
        }
      })
    },
    delRight (row, rightId) {
      console.log(row.id, rightId)
      delRightByRoleId(row.id, rightId)
        .then(res => {
          console.log(res)
          if (this.cnt === 0) {
            this.$message.success('删除角色权限成功')
            this.cnt++
          }
          row.children = res.data.data
          row.children.forEach((v1, in1) => {
            if (v1.children.length === 0) {
              this.delRight(row, v1.id)
            } else {
              v1.children.forEach((v2, in2) => {
                if (v2.children.length === 0) {
                  this.delRight(row, v2.id)
                }
              })
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    init () {
      getRoleList()
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.roleList = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
    getAllRightList('tree')
      .then(res => {
        this.rightList = res.data.data
      })
  }
}
</script>
<style lang="less" scoped>

</style>

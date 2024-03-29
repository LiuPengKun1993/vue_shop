<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row class="treeButton">
                <el-col>
                <el-button type="primary" @click="addCateClicked">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index border>
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
                    <el-tag type="warning" v-else size="mini">三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 4, 8]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <!-- 内容主题区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" prop="password">
                    <el-cascader expand-trigger="hover" :options="parentCartlist" v-model="selectedKeys" @change="parentCateChanged" :props="cascaderProps" clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="addDialog">
                    确 定
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // 商品分类列表
            catelist: [],
            // 查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 4
            },
            // 总数据条数
            total: 0,
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    template: 'isok'
                },
                {
                    label: '排序',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    template: 'opt'
                }
            ],
            addDialogVisible: false,
            // 添加分类的表单数据对象
            addForm: {
                // 分类名称
                cat_name: '',
                // 父级分类id
                cat_pid: 0,
                // 分类等级，默认要添加的是一级分类
                cat_level: 0
            },
            addFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            parentCartlist: [],
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            selectedKeys: []
        }
    },
    created () {
        this.getCatelist()
    },
    methods: {
        async getCatelist () {
            const { data: res } = await this.$http.get('categories', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.catelist = res.data.result
            console.log(this.catelist)
            this.total = res.data.total
        },
        handleSizeChange (newsize) {
            this.queryInfo.pagesize = newsize
            this.getCatelist()
        },
        handleCurrentChange (newpage) {
            this.queryInfo.pagenum = newpage
            this.getCatelist()
        },
        addCateClicked () {
            this.getParentCartlist()
            this.addDialogVisible = true
        },
        async getParentCartlist () {
            const { data: res } = await this.$http.get('categories', {
                params: { type: 2 }
            })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.parentCartlist = res.data
        },
        parentCateChanged () {
            console.log(this.selectedKeys)
            if (this.selectedKeys.length > 0) {
                this.addForm.cat_pid = this.selectedKeys[
                    this.selectedKeys.length - 1
                ]
                this.addForm.cat_level = this.selectedKeys.length
            } else {
                this.addForm.cat_pid = 0
                this.addForm.cat_level = 0
            }
        },
        addDialog () {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('categories', this.addForm)
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.getCatelist()
                this.addDialogVisible = false
            })
        },
        // 重置表单数据
        addDialogClose () {
            this.$refs.addFormRef.resetFields()
            this.selectedKeys = []
            this.addForm.cat_level = 0
            this.addForm.cat_pid = 0
        }
    }
}
</script>

<style lang="less" scoped>

.treeTable {
    margin-top: 15px;
}

</style>

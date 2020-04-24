<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">
                首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                商品管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                商品列表
            </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList">
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addGoods">
                        添加商品
                    </el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="120px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.goods_id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDialogByID(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </el-card>

        <!-- 修改商品对话框 -->
        <el-dialog title="修改商品" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 内容主题区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-edit-footer">
                <el-button @click="editDialogVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="editUser">
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
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            goodsList: [],
            total: 0,
            editDialogVisible: false,
            // 添加商品的规则
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ]
            },
            editForm: {}
        }
    },
    created () {
        this.getGoodsList()
    },
    methods: {
        async getGoodsList () {
            const { data: res } = await this.$http.get('goods', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.goodsList = res.data.goods
            this.total = res.data.total
            console.log(res.data)
        },
        // 监听pagesize改变的事件
        handleSizeChange (newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 监听页码值改变的事件
        handleCurrentChange (newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 根据id删除商品
        async removeDialogByID (id) {
            const confirmResult = await this.$confirm('此操作将永远删除商品，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete('goods/' + id)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.getGoodsList()
        },
        async showEditDialog (id) {
            const { data: res } = await this.$http.get('users/' + id)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听修改商品对话框的关闭事件
        editDialogClosed () {
            this.$refs.editFormRef.resetFields()
        },
        addGoods () {
            this.$router.push('/goods/add')
        }
    }
}
</script>

<style lang="less" scoped>

</style>

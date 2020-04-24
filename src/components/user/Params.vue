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
                参数列表
            </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 头部警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon>
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>
                        选择商品分类：
                    </span>
                    <el-cascader expand-trigger="hover" :options="cartlist" v-model="selectedKeys" @change="cateChanged" :props="cascaderProps" clearable>
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- tab 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="this.selectedKeys.length !== 3" @click="addParams">添加参数</el-button>
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand" label="#">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleColse(i, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParams(scope.row)">
                                    编辑
                                </el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParamsByID(scope.row.attr_id)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="this.selectedKeys.length !== 3" @click="addParams">添加属性</el-button>
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand" label="#">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleColse(i, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParams(scope.row)">
                                    编辑
                                </el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParamsByID(scope.row.attr_id)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加属性/参数对话框 -->
        <el-dialog :title="this.activeName === 'many' ? '添加动态参数' : '添加静态属性'" :visible.sync="addParamsDialogVisible" width="40%" @close="addParamsDialogClosed">
            <el-form :model="addParamsForm" ref="addParamsFormRef" :rules="addParamsFormRules" label-width="100px">
                <el-form-item :label="this.activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParamsConfirm">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改属性/参数对话框 -->
        <el-dialog :title="this.activeName === 'many' ? '修改动态参数' : '修改静态属性'" :visible.sync="editParamsDialogVisible" width="40%" @close="addParamsDialogClosed">
            <el-form :model="editParamsForm" ref="editParamsFormRef" :rules="editParamsFormRules" label-width="100px">
                <el-form-item :label="this.activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParamsConfirm">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            cartlist: [],
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择框双向绑定的数组
            selectedKeys: [],
            activeName: 'many',
            manyTableData: [],
            onlyTableData: [],
            // 添加属性/参数对话框相关数据
            addParamsDialogVisible: false,
            addParamsForm: {
                attr_name: ''
            },
            addParamsFormRules: {
                attr_name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ]
            },
            // 修改属性/参数对话框相关数据
            editParamsDialogVisible: false,
            editParamsFormRules: {
                attr_name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ]
            },
            editParamsForm: {
                attr_name: ''
            },
            // 控制按钮与文本框的切换显示
            inputVisible: false,
            inputValue: ''
        }
    },
    created () {
        this.getCartlist()
    },
    computed: {
        cateID () {
            if (this.selectedKeys.length === 3) {
                return this.selectedKeys[2]
            }
            return null
        }
    },
    methods: {
        async getCartlist () {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.cartlist = res.data
            console.log(this.cartlist)
        },
        // 级联选择框选中项出现变化，会触发此函数
        async cateChanged () {
            this.getParamsData()
        },
        handleTabsClick () {
            console.log(this.activeName)
            this.getParamsData()
        },
        async getParamsData () {
            if (this.selectedKeys.length !== 3) {
                this.selectedKeys = []
                return
            }
            // 证明选中的是三级分类
            const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, {
                params: { sel: this.activeName }
            })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                item.inputVisible = false
                item.inputValue = ''
            })
            console.log(res.data)
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
        },
        // 添加属性/参数对话框相关方法
        addParamsConfirm () {
            this.$refs.addParamsFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post(`categories/${this.cateID}/attributes`, {
                    attr_name: this.addParamsForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.addParamsDialogVisible = false
                this.getParamsData()
            })
        },
        addParamsDialogClosed () {
            this.$refs.addParamsFormRef.resetFields()
        },
        addParams () {
            this.addParamsDialogVisible = true
        },
        // 修改属性/参数对话框相关方法
        editParamsConfirm () {
            this.$refs.editParamsFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${this.editParamsForm.attr_id}`, {
                    attr_name: this.editParamsForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.editParamsDialogVisible = false
                this.getParamsData()
            })
        },
        editParamsDialogClosed () {
            this.$refs.editParamsFormRef.resetFields()
        },
        editParams (cascaderProps) {
            this.editParamsForm = cascaderProps
            this.editParamsDialogVisible = true
        },
        async removeParamsByID (parmasID) {
            // 弹框提示 删除
            const confirmResult = await this.$confirm(
                '此操作将永久删除该参数, 是否继续?',
                '提示',
                {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }
            ).catch(err => err)
            // 点击确定 返回值为：confirm
            // 点击取消 返回值为： cancel
            if (confirmResult !== 'confirm') {
                this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete(
                `categories/${this.cateID}/attributes/${parmasID}`
            )
            if (res.meta.status !== 200) {
                return this.$message.error('删除参数失败！')
            }
            this.getParamsData()
        },
        handleInputConfirm (row) {
            if (row.inputValue.trim().length === 0) {
                row.inputVisible = false
                row.inputValue = ''
                return
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputVisible = false
            row.inputValue = ''
            this.saveAttr_vals(row)
        },
        async saveAttr_vals (row) {
            const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' ')
            })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
        },
        showInput (row) {
            row.inputVisible = true
            // 让文本框自动获取焦点
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        // 删除对应的参数可选项
        handleColse (i, row) {
            row.attr_vals.splice(i, 1)
            this.saveAttr_vals(row)
        }
    }
}
</script>

<style lang="less" scoped>

.cat_opt {
    margin-top: 15px;
}

.el-tag {
    margin-right: 15px;
}

.input-new-tag {
    width: 120px;
}

</style>

<template>
    <div class="login_container">

        <!-- 标题区域 -->
        <div class="login_title">
            欢迎来到全球最大电商网
        </div>

        <div class="login_box">
            <!-- 头像区域 -->
            <div class="login_box_avatar">
                <img src="../assets/header.png" alt="">
            </div>

            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" class="login_box_form">
                <!-- 账号 -->
                <el-form-item prop="username">
                    <el-input v-model="loginFormData.username" prefix-icon="el-icon-user">
                    </el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginFormData.password" prefix-icon="el-icon-lock" type="password">
                    </el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="login_box_form_button">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // 登录表单的数据绑定对象
            loginFormData: {
                username: 'admin',
                password: '123456'
            },
            loginFormRules: {
                username: [
                    { required: true, message: '请输入登录账号', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3-10 之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6-15 之间', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        resetLoginForm () {
            this.$refs.loginFormRef.resetFields()
        },
        login () {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.post('login', this.loginFormData)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.$message.success('登录成功')
                window.sessionStorage.setItem('token', res.data.token)
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang="less" scoped>

.login_title {
    color: white;
    width: 450px;
    height: 100px;
    font-size: 32px;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    position: absolute;
    left: 50%;
    top: 10%;
    text-align: center;
    transform: translate(-50%);
}

.login_title:hover {
    color: yellow;
}

.login_container {
    background-color: rgb(100, 100, 100);
    height: 100%;
}

.login_box {
    background-color: #fff;
    width: 450px;
    height: 300px;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.login_box_avatar {
    height: 130px;
    width: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 5px #dddddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee;
    }
}

.login_box_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.login_box_form_button {
    display: flex;
    justify-content: flex-end;
}

</style>

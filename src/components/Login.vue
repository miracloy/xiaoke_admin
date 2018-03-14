<template>
	<div>
		<div class="login_box">
			<h2>管理员登陆</h2>
			<Form ref="formInline" :model="formInline" :rules="ruleInline">
			    <FormItem prop="user">
			        <Input type="text" v-model="formInline.user" placeholder="Username">
			            <Icon type="ios-person-outline" slot="prepend"></Icon>
			        </Input>
			    </FormItem>
			    <FormItem prop="password">
			        <Input type="password" v-model="formInline.password" placeholder="Password" @keyup.enter.native="handleSubmit('formInline')">
			            <Icon type="ios-locked-outline" slot="prepend"></Icon>
			        </Input>
			    </FormItem>
			    <FormItem>
			        <Button type="primary" @click="handleSubmit('formInline')" long>登录</Button>
			    </FormItem>
			</Form>
		</div>
	</div>
</template>
<script>
	import axios from 'axios'
	import {URL} from '../api/config.js'
	export default{
		data () {
	            return {
	                formInline: {
	                    user: '',
	                    password: ''
	                },
	                ruleInline: {
	                    user: [
	                        { required: true, message: '请填写用户名', trigger: 'blur' }
	                    ],
	                    password: [
	                        { required: true, message: '请填写密码', trigger: 'blur' },
	                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
	                    ]
	                }
	            }
	        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    	
                    	var params = new URLSearchParams();
                    	params.append('username', this.formInline.user);
                    	params.append('password', this.formInline.password);

                    	axios.defaults.withCredentials=true;
                    	axios.post(URL+'login',params).then(function(res){
                    		console.log(res.data);
                    		if(res.data.errorCode==200){
                    			this.$store.dispatch('login',this.formInline.user);//用户名保存在vuex中
                    			
                    			window.sessionStorage.setItem('token',this.formInline.user);

                    			this.$router.replace('/index/welcome');
                    		}else{
                    			this.$Message.error('用户名或密码错误');
                    		}

                    	}.bind(this)).catch(function(error){
                    		this.$Message.error('用户名或密码错误');
                    		console.log(error);
                    	}.bind(this))

                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                });
            }
        }
	}
</script>
<style scoped>
h2{
	text-align: center;
	margin:10px;
}
.login_box{
	width: 400px;
	height: 250px;
	margin:0 auto;
	margin-top: 200px;
	border-radius: 10px;
	border:1px solid #ccc;
	padding:15px;
}
</style>
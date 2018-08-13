<template>
	<div class="content-box">

      <Row>
        <Col span="6">
              <Bread></Bread>
        </Col>
      </Row>

      <Row class="margin-10">
        <Col span="6" offset="1">
              <Button type="default" @click="goUpdateBase" size="large">基础信息</Button>
              <Button type="primary" @click="goUpdateSpec" size="large">规格</Button>
        </Col>
      </Row>


      <Row>
        <Col span="8" offset="14">
          <Button type="info" @click="skuModal=true">添加sku</Button>
          <Button type="error">删除</Button>
        </Col>
        <Col span="16" offset="1">
           <h4>商品sku</h4>
          <table class="table">
            <tr>
              <td>名称</td>
              <td>价格</td>
              <td>价格调整</td>
              <td>规格</td>
              <td>库存</td>
              <td>操作</td>
            </tr>
            <tr v-for="(v,i) in formItem.skus">
              <td>{{v.name}}</td>
              <td>{{v.amount}}</td>
              <td>
                <input type="number" v-model="v.amount">
              </td>
              <td>
                <span v-for="v1 in v.productOption">{{v1.attributeValue}}</span>
              </td>
              <td><input type="number" v-model="v.quantityAvailable"></td>
              <td>
                <Button size="small" type="info" @click="skusave(v)">保存</Button>
                <Button size="small" type="error" @click="skudelete(v)" >删除</Button>
              </td>
            </tr>
            <tr v-if="formItem.skus">
              <td colspan="6" style="text-align:center;color:#fff;background-color:#999;">共{{formItem.skus.length}}条信息</td>
            </tr>
          </table>
        </Col>
      </Row>

      <Row style="margin-top:20px;">
        <Col span="16" offset="1">
          <h4>商品规格</h4>
          <Button type="info" @click="addSpec">添加</Button>
        </Col>
        <Col span="16" offset="1">
          <table class="table">
            <tr>
              <td>规格名称</td>
            </tr>
            <tr v-for="v in formItem.productOptions">
              <td>{{v.attributeName}} &nbsp;&nbsp;&nbsp;<Button size="small" type="error" icon="android-delete" @click="specDelete(v)" >删除</Button></td>
            </tr>
            <tr v-if="formItem.productOptions">
              <td colspan="5" style="text-align:center;color:#fff;background-color:#999;">共{{formItem.productOptions.length}}条信息</td>
            </tr>
          </table>
        </Col>
      </Row>


      <Modal
          v-model="addModal"
          title="添加规格"
          @on-ok="add"
          @on-cancel="addModal=false"
          width="300">

          <p v-for="(v,i) in specs" class="margin-10" style="font-size:14px;position:relative;">{{v.attributeName}} <Button size="small" icon="plus" style="position:absolute;right:0;top:0;" @click="add(i)"></Button></p>

          <div slot="footer"></div>
      </Modal>

      <Modal
          v-model="skuModal"
          title="添加sku"
          @on-ok="addsku"
          @on-cancel="skuModal=false"
          width="1000">

          <table class="table">
            <tr>
              <td>名称</td>
              <td>价格</td>
              <td v-for="(v,i) in specValues">{{v.attributeName}}</td>
              <td>库存</td>
            </tr>
            <tr>
              <td>
                <Input v-model="sku.name" style="width:200px;"></Input>
              </td>
              <td>
                <InputNumber v-model="sku.price"></InputNumber>
              </td>
              <td v-for="(v,i) in specValues">
                 <select v-model="sku.optionValue[i]">
                   <option v-for="item in v.allowedValues" :value="item.id">{{ item.attributeValue }}</option>
                 </select>
              </td>
              <td>
                <InputNumber v-model="sku.qtyAvailable"></InputNumber>
              </td>
            </tr>
          </table>


      </Modal>

      <Spin class="demo-spin-col" v-if="spin">
          <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>

	</div>
</template>
<script type="text/javascript">


import axios from 'axios'
import {URL} from '@/api/config.js'
export default{
	data(){
		return {
      formItem:{},
			sku:{
        name:'',
        price:0,
        qtyAvailable:0,
        optionValue:[],
      },
      addModal:false,
      skuModal:false,
      specs:[],
      token:'',
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      token:'',
      categorys:[],
      spin:false,
      specValues:[],
		}
	},
  computed:{
    headers(){
      return {
        'token':this.token
      }
    }
  },
  mounted(){
    // 添加响应拦截器
    axios.interceptors.request.use(function (config) {
        this.spin = true;
        return config;
      }.bind(this), function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      });
    axios.interceptors.response.use(function (response) {
        this.spin = false;
        if(response.data.errorCode==401){
          this.$Message.error('登录超时,请重新登录');
          setTimeout(()=>{
            this.$router.replace('/login');
          },2000);
        }
        return response;
      }.bind(this), function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
      });

    this.dataInit();
    this._getCategory();


  },
	methods:{
    dataInit(){
      var id = this.$route.params.id;
      axios.get(URL+'product/'+id).then(function(res){
        var data = res.data;
        this.formItem = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
      axios.get(URL+'product/option/'+id).then(function(res){
        var data = res.data;
        this.specValues = data.data.productOptions;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    add(i){
      var id = this.specs[i].id;

      var params = new URLSearchParams();
      params.append('opId', id);
      axios.post(URL+'product/option/'+this.formItem.id,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('添加成功');
          this.dataInit();
        }

        this.addModal = false;
      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));

    },
    addSpec(){
      this.addModal = true;
      axios.get(URL+'productoption').then(function(res){
        var data = res.data;
        this.specs = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });

    },
    _getCategory(){
      axios.get(URL+'category').then(function(res){
        var data = res.data;
        this.categorys = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },

    addsku(){
      var id = this.$route.params.id;

      var params = new URLSearchParams();
      params.append('name', this.sku.name);
      params.append('optionValue', this.sku.optionValue);
      params.append('price', this.sku.price);
      params.append('qtyAvailable', this.sku.qtyAvailable);
      debugger;
      axios.post(URL+'product/add/'+id,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('添加成功');
          this.dataInit();
        }

      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));

    },
    skudelete(v){
      axios.delete(URL+'sku/'+v.id).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('删除成功');
          this.dataInit();
        }

      }.bind(this)).catch(function(error){
        this.$Message.error('删除失败');
      });
    },
    skusave(v){
      axios.put(URL+'sku/'+v.id+'?price='+v.amount+'&qtyAvailable='+v.quantityAvailable).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('保存成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('保存失败');
      }.bind(this));
    },
    specDelete(v){
      var id = this.$route.params.id;
      axios.delete(URL+'product/'+id+'/'+v.optionId).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.dataInit();
          this.$Message.success('删除成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('删除失败');
      }.bind(this));
    },

    goUpdateSpec(){
      this.$router.push('/goods/index/updateSpec/'+this.$route.params.id);
    },
    goUpdateBase(){
      this.$router.push('/goods/index/update/'+this.$route.params.id);
    }

	},


}
</script>
<style scoped>
h3{
	background-color: #999;
	color: #fff;
	height: 40px;
	line-height: 40px;
	width: 100%;
	text-indent: 20px;
	margin-bottom: 20px;
}
.input-text{
	text-align: center;
	line-height: 32px;
}
.save{
	text-align: center;
}

.table{
  margin-top: 10px;
  width: 100%;
  border-collapse: collapse;
}
.table tr{
  border:1px solid #ccc;
}
.table td{
  padding: 5px;
}
</style>

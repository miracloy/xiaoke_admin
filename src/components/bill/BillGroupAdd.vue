<template>
  <div class="content-box">

    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

    <Row>
        <Col span="24">
          <h3>添加商品组合</h3>
        </Col>
      </Row>
    

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">商品组合名称</p>
        </Col>
        <Col span="10">
          <Input v-model="formItem.name" style="width: 300px"></Input>
        </Col>
      </Row>


      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">清单详情</p>
          </Col>
          <Col span="10">
              <table class="table">
                <tr v-for="(v,i) in formItem.carts">
                  <td><img v-if="v.skuMedia.primary" :src="v.skuMedia.primary.url" style="height:40px;"></td>
                  <td>{{v.name}}</td>
                  <td>
                    <span v-for="v1 in v.productOption">{{v1.attributeValue}}</span>
                  </td>
                  <td><Icon type="minus-circled" size="15" @click.native="minus(v,i)"></Icon> <input type="number" width="30" v-model="v.quantity" @change="numberChange"> <Icon type="plus-circled" size="15" @click.native="plus(v,i)" ></Icon></td>
                  <td>￥{{Math.round(v.amount*v.quantity*1000)/1000}}</td>
                </tr>
                <tr>
                  <td colspan="5" style="text-align:center;">
                    <Button type="info" size="small" icon="plus-circled" @click="addModal=true">添加商品</Button>
                  </td>
                </tr>
              </table>
          </Col>
      </Row>

      <Row class="margin-10">
          <Col span="10" class="save">
            <Button type="primary" size="large" @click="save">保存</Button>
          </Col>
      </Row>
      
      <Modal
          v-model="addModal"
          title="新增"
          @on-cancel="addModal=false">
      
          <Row>
            <Col span="24">
                <Input placeholder="搜索商品" style="width: 200px" v-model="key"></Input> <Button type="info" icon="ios-search" @click="search">搜索</Button>
            </Col>
          </Row>
          <Row style="margin-top:10px;">
            <Col span="4">
              <div class="goods-box">
                <p class="cate" v-for="(v,i) in categorys" :class="{'active':i==category_index}" @click="getGoods(i)">{{v.name}}</p>
              </div>
            </Col>
            <Col span="19" offset="1">
                <div class="goods-box">
                  <p class="margin-10" v-if="goods.length==0">没有商品数据</p>
                  <table class="table">
                    <tr v-for="(v,i) in goods">
                      <td><img v-if="v.skuMedia.alt1" :src="v.skuMedia.alt1.url" height="40"></td>
                      <td>{{v.name}}</td>
                      <td>￥{{v.minPrice}}</td>
                      <td><Button type="info" size="small" @click="goodsAddSku(i)">添加</Button></td>
                    </tr>
                  </table>
                </div>
            </Col>
          </Row>
      </Modal>

      <div v-if="goodsAddSkuModel" class="my-model">
          <Icon type="close" size="15" style="position:absolute;right:10px;top:10px;" @click.native="goodsAddSkuModel=false;optKey=[];"></Icon>
          <div v-for="(v,i) in goodsSku">
            <p>{{v.name}}</p>
            <p>
              <span v-for="(v1,i1) in v.items" @click="chooseSpec(i,i1)" :class="{'active':v1.id==optKey[i]}">{{v1.val}}</span>
            </p>
          </div>
          <p style="margin-top:15px;border-top:1px solid #ccc;">
            <Button type="info" @click="billAdd">添加到清单</Button>
            <Button type="default" @click="goodsAddSkuModel=false;optKey=[];">取消</Button>
          </p>
      </div>

      <Spin class="demo-spin-col" v-if="spin">
          <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>

  </div>
</template>
<script type="text/javascript">
import Vue from 'vue'
import axios from 'axios'
import {URL} from '@/api/config.js'
export default{
  data(){
    return {
      formItem:{
        name:'',
        carts:[],
      },
      categorys:[],
      category_index:0,
      spin:false,
      addModal:false,
      goodsAddSkuModel:false,
      key:'',
      goods:[],
      goodsSku:[],
      optKey:[],
      goodsSkuData:[],
      
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


    this._getCategory();
    
  },
  methods:{
  
    save(){

      var params = new URLSearchParams();
      params.append('name', this.formItem.name);
     
      this.formItem.carts.forEach((value,index)=>{
        params.append('cartForms['+index+'].skuId', value.id);
        params.append('cartForms['+index+'].num', value.quantity);
      });

      axios.post(URL+'productGroup',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('添加成功');
          this.$router.push('/bill/index/normal');
        }

      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));

    },

    // 清单部分
    search(){
      axios.get(URL+'/api/product/search',{
        params:{
          key:this.key,
          ase:0
        }
      })
        .then(function(res){
        var data = res.data;
        this.goods = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    _getCategory(){
      axios.get(URL+'category').then(function(res){
        var data = res.data;
        this.categorys = data.data;
        this.getGoods(0);//初始化第一个商品
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    getGoods(i){
      this.category_index = i;
      var id = this.categorys[i].id;
      axios.get(URL+'api/category/products/'+id,{
        params:{
          ase:0
        }
      }).then(function(res){
        var data = res.data;
        this.goods = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    goodsAddSku(i){
      this.goodsAddSkuModel = true;
      this.goodsSku = this.goods[i].skusTypes;
      this.goodsSkuData = this.goods[i].skus;
      
    },
    chooseSpec(i,i1){
      Vue.set(this.optKey,i,this.goodsSku[i].items[i1].id);
    },
    billAdd(){
      var str = 'opt';
      for(var i = 0;i<this.optKey.length;i++){
        str += this.optKey[i]+'_';
      }

      var id = '';
      var sku_index = '';
      this.goodsSkuData.forEach((value,index)=>{
        if(value.optKey==str){
          id = value.id;
          sku_index = index;
        }
      });
      // 最后拿到sku的id
      this.goodsSkuData[sku_index].quantity = 1;
      this.formItem.carts.push(this.goodsSkuData[sku_index]);
      this.goodsAddSkuModel = false;
      this.optKey = [];
    },
    plus(v,i){
      v.quantity++;
      Vue.set(this.formItem.carts,i,v);
    },
    minus(v,i){
      v.quantity--;
      Vue.set(this.formItem.carts,i,v);
      if(v.quantity==0){
          this.formItem.carts.splice(i,1);
      }

    },
    numberChange(e){
      // 数量限制待处理
      e.target.value = parseInt(e.target.value);     
    },

    
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

.demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}

.table{
  width: 100%;
  border-collapse: collapse;
}
.table tr{
    border:1px solid #ccc;
}
.table td{
  padding:5px;
  
}
.table td img{
  width: 50px;
}
.table td input{
  width: 50px;
}
.cate{
  border: 1px solid #ccc;
  padding:5px;
  margin-bottom: 4px;
}
.cate.active{
  color:#fff;
  background-color: #999;
}

.goods-box{
  height: 250px;
  overflow-y:auto;
}

.my-model{
  position:fixed;
  top:40%;
  left: 45%;
  width: 300px;
  min-height: 200px;
  border:1px solid #ccc;
  border-radius: 5px;
  padding:10px;
  background-color: #fff;
  z-index: 9999;
}
.my-model p{
  padding: 5px;
  font-size: 14px;
}
.my-model span{
  display: inline-block;
  padding: 4px 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 5px;
}
.my-model span.active{
  background-color: #5cadff;
  color: #fff;
}
.my-model-close{
  font-size: 20px;
  position: absolute;
  top:10px;
  right: 10px;
}
</style>
<template>
  <div class="content-box">

    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

      <Row>
        <Col span="24">
          <h3>修改清单</h3>
        </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">清单名称</p>
          </Col>
          <Col span="10">
            <p class="margin-10">{{formItem.name}}</p>
          </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">清单类型</p>
          </Col>
          <Col span="10">
            <p class="margin-10" v-if="formItem.orderType">{{formItem.orderType.friendlyType}}</p>
          </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">套餐类型</p>
          </Col>
          <Col span="10">
            <p class="margin-10" v-if="formItem.packageType">{{formItem.packageType.friendlyType}}</p>
          </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">总金额</p>
          </Col>
          <Col span="10">
            <p class="margin-10">{{formItem.total}}</p>
          </Col>
      </Row>
      
      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">清单所含商品</p>
          </Col>
          <Col span="10">
              <table class="table">
                <tr v-for="(v,i) in formItem.carts">
                  <td><img v-if="v.skuMedia.primary" :src="v.skuMedia.primary.url" style="height:40px;"></td>
                  <td>{{v.name}}</td>
                  <td>
                    <span v-for="v1 in v.productOption">{{v1.attributeValue}}</span>
                  </td>
                  <td><Icon type="minus-circled" size="15" @click.native="minus(v)"></Icon> <input type="number" width="30" v-model="v.quantity" @change="numberChange"> <Icon type="plus-circled" size="15" @click.native="plus(v)" ></Icon></td>
                  <td>￥{{Math.round(v.amount*v.quantity*1000)/1000}}</td>
                  <td>
                    <Button type="info" size="small" @click="saveNum(v.cartId,v.id,v.quantity)">保存</Button>
                  </td>
                </tr>
                <tr>
                  <td colspan="6" style="text-align:right;padding-right:10px;">
                    总金额：￥{{total}}
                  </td>
                </tr>
                <tr>
                  <td colspan="6" style="text-align:center;">
                    <Button type="info" size="small" icon="plus-circled" @click="addModal=true">添加单个商品</Button>
                  </td>
                </tr>
                <tr>
                  <td colspan="6" style="text-align:center;">
                    <Button type="primary" size="small" icon="plus-circled" @click="addGroupModal=true">添加常用商品组</Button>
                  </td>
                </tr>
              </table>
          </Col>
      </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">顾客需求</p>
        </Col>
        <Col span="10">
          <p class="margin-10">{{formItem.remarks}}</p>
        </Col>
      </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">配送时间</p>
        </Col>
        <Col span="10">
          <p class="margin-10">{{formItem.deliveryDate}}</p>
        </Col>
      </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">配送地址</p>
        </Col>
        <Col span="10">
          <p class="margin-10">{{formItem.addressDetail}}</p>
        </Col>
      </Row>



      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">是否自动转成订单</p>
          </Col>
          <Col span="10">
            <RadioGroup @on-change="intervalChange" v-model="interval">
                <p class='margin-10'><Radio label="1"> 是</Radio> <InputNumber :max="30" :min="1" style="width:50px;" v-model="interval_H"></InputNumber>小时后自动转成订单</p>
                <p class='margin-10'><Radio label="-1"> 否</Radio></p>
                <p class='margin-10'><Radio label="0"> 立即转成订单</Radio></p>
            </RadioGroup>
          </Col>
      </Row>

      <Row class="margin-10">
        <Col span="10" class="save">
          <Button type="primary" size="large" @click="saveInterval">保存</Button>
          <Button type="default" size="large" @click="goBack">返回</Button>
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
              <div class="cate-box">
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
          <Icon type="close" size="15" style="position:absolute;right:10px;top:10px;" @click.native="goodsAddSkuModel=false"></Icon>
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

      <Modal
          v-model="addGroupModal"
          title="新增商品组合"
          @on-cancel="addGroupModal=false">
      
          <Row style="margin-top:10px;">
            <Col span="4">
              <div class="cate-box">
                <p class="cate" v-for="(v,i) in productGroup" :class="{'active':i==group_index}" @click="getGroup(i)" >{{v.name}}</p>
              </div>
            </Col>
            <Col span="19" offset="1">
                <div class="goods-box">
                  <p class="margin-10" v-if="productGroup[group_index]&&productGroup[group_index].skuGroups.length==0">没有商品数据</p>
                  <table class="table" v-if="productGroup[group_index]">
                    <tr v-for="(v,i) in productGroup[group_index].skuGroups">
                      <td><img v-if="v.skuMedia.primary" :src="v.skuMedia.primary.url" height="40"></td>
                      <td>{{v.name}}</td>
                      <td>{{v.quantity}}</td>
                      <td>￥{{v.total}}</td>
                    </tr>
                  </table>
                </div>
            </Col>
          </Row>
          <div slot="footer">
              <Button type="default"  @click="addGroupModal=false">取消</Button>
              <Button type="primary"  @click="productGroupAdd">添加到清单</Button>
          </div>
      </Modal>


  </div>
</template>
<script type="text/javascript">
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate,_timestrToHs} from '@/api/common.js'
import Vue from 'vue'
export default{
  data(){
    return {
      formItem:{},
      addModal:false,
      searchCate:'饮料',
      categorys:[],
      category_index:0,
      group_index:0,
      goods:[],
      key:'',
      addGroupModal:false,
      goodsAddSkuModel:false,
      goodsSku:[],
      optKey:[],
      goodsSkuData:[],
      interval:1,
      interval_H:2,
      productGroup:{},
      total:0,
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
    this._getGroup();

  },
  methods:{
    dataInit(){
      var id = this.$route.params.id;
      axios.get(URL+'list/'+id)
        .then(function(res){
        this.formItem = res.data.data;
        this.formItem.deliveryDate = _timestrToDate(this.formItem.deliveryDate);
        this.computeTotal();
        if(this.formItem.intervalInt>0){
          this.interval_H = this.formItem.intervalInt;
          this.interval = 1;
        }else if(this.formItem.intervalInt===0){
          this.interval = 0;
        }else{
          this.interval = -1;
        }

      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
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
    _getGroup(){
      axios.get(URL+'productGroup').then(function(res){
        var data = res.data;
        this.productGroup = data.data.data.data;
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
    getGroup(i){
      this.group_index = i;
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
      this.goodsSkuData.forEach((value,index)=>{
        if(value.optKey==str){
          id = value.id;
        }
      });
      // 最后拿到sku的id
      var listid = this.$route.params.id;
      axios.put(URL+'list/'+listid+'?skus[0].skuId='+id+'&skus[0].num=1').then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('添加成功');
          this.dataInit();
        }
        this.goodsAddSkuModel = false;
      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));


    },
    plus(v){
      v.quantity++;
      this.computeTotal();
    },
    minus(v){
      v.quantity--;
      this.computeTotal();
      if(v.quantity==0){
        var id = this.$route.params.id;

        var params = new URLSearchParams();
        params.append('items', v.cartId);

        axios.post(URL+'list/item/'+id,params).then(function(res){
          if(res.data.errorCode!=200){
            this.$Message.error(res.data.moreInfo);
          }else{
            this.$Message.success('删除成功');
            this.dataInit();
          }
        }.bind(this)).catch(function(error){
          this.$Message.error('删除失败');
        }.bind(this));
      }
    },
    numberChange(e){
      // 数量限制待处理
      e.target.value = parseInt(e.target.value);     
    },
    saveNum(cartId,skuId,num){
      axios.put(URL+'/list/child/'+cartId+'?skuId='+skuId+'&num='+num).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.dataInit();
          this.$Message.success('保存成功');
        }
        
      }.bind(this)).catch(function(error){
        this.$Message.error('保存失败');
      }.bind(this));
    },
    intervalChange(v){
      this.formItem.intervalInt = v;
    },
    saveInterval(){
      if(this.interval == 1 ){
        this.formItem.intervalInt = this.interval_H;
      }
      var id = this.$route.params.id;
      var interval = this.formItem.intervalInt != null ? this.formItem.intervalInt : -1;

      var params = new URLSearchParams();
     
      params.append('interval', interval);
      axios.post(URL+'list/child/'+id,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('保存成功');
          this.goBack();
        }

      }.bind(this)).catch(function(error){
        this.$Message.error('保存失败');
      }.bind(this));

    },
    goBack(){
      this.$router.go(-1);
    },
    productGroupAdd(){
      var str = '?';
      this.productGroup[this.group_index].skuGroups.forEach((value,index)=>{
        str += 'skus['+index+'].skuId='+value.id+'&skus['+index+'].num='+value.quantity+'&'
      });

      var listid = this.$route.params.id;
      axios.put(URL+'list/'+listid+str).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('添加成功');
          this.dataInit();
        }
        this.addGroupModal = false;
      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));

    },
    // 预计总金额
    computeTotal(){
      var sum = 0;
      this.formItem.carts.forEach((v,i)=>{
        sum += v.amount*v.quantity;
      });
      sum = Math.round(sum*1000)/1000;
      this.total = sum;
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
.cate-box{
  height: 250px;
  overflow-y:auto;
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
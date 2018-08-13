<template>
  <div class="content-box">
    <Row>
      <Col span="6">
      <Bread></Bread>
      </Col>
    </Row>

    <Row>
      <Col span="24">
        <h3>新增进货单</h3>
      </Col>
    </Row>

    <Row class="margin-10">
      <Col span="4">
        <p class="input-text">进货仓库：</p>
      </Col>
      <Col span="5">
        <p>
          <Select v-model="formItem.wareHouse" style="width:100px" placeholder="选择仓库">
            <Option v-for="item in houseList" :value="item.value" :key="item.label" >{{ item.label }}</Option>
          </Select>
        </p>
      </Col>
      <Col span="2">
        <p class="input-text">录单日期：</p>
      </Col>
      <Col span="5">
        <p><Input v-model="formItem.createdAt" readonly style="width: 200px"></Input></p>
      </Col>
    </Row>


    <Row class="margin-10">
      <Col span="4">
        <p class="input-text">供货单位：</p>
      </Col>
      <Col span="5">
        <p><Input v-model="formItem.company" style="width: 200px"></Input><a @click="chooseCompany">选择</a></p>
      </Col>


      <Col span="2">
        <p class="input-text">联系人：</p>
      </Col>
      <Col span="5">
        <p><Input v-model="formItem.companyContact" style="width: 200px"></Input></p>
      </Col>

      <Col span="2">
        <p class="input-text">联系电话：</p>
      </Col>
      <Col span="5">
        <p><Input v-model="formItem.companyContactPhone" style="width: 200px"></Input></p>
      </Col>
    </Row>

    <Row class="margin-10">
      <Col span="4">
      <p class="input-text">发票抬头：</p>
      </Col>
      <Col span="5">
      <p><Input v-model="formItem.financeTitile" style="width: 600px"></Input></p>
      </Col>
    </Row>

    <Row class="margin-10">
      <Col span="4">
      <p class="input-text">备注：</p>
      </Col>
      <Col span="5">
      <p><Input v-model="formItem.remark" style="width: 600px"></Input></p>
      </Col>
    </Row>

    <Row class="margin-5">
      <Col span="4"><Button type="primary" @click="addProduct">添加商品</Button></Col>
    </Row>

    <Row class="margin-24">

      <Col span="24">
      <Table :data="formItem.inputs" stripe border :columns="tableTitle">
      </Table>
      </Col>
    </Row>

    <Row class="margin-12">
      <Col span="2">
        <p class="input-text">合计数量：</p>
      </Col>
      <Col span="1">
      <p class="input-text" style="text-align: left" v-model="countSum">{{countSum}}</p>
      </Col>

      <Col span="2">
      <p class="input-text">合计金额：</p>
      </Col>
      <Col span="2">
      <p class="input-text" style="text-align: left" v-model="moneySum">{{moneySum}} 元</p>
      </Col>
    </Row>

    <Row class="margin-12" style="text-align: right">
      <Col span="12"><Button type="warning" @click="save('save')">保存</Button></Col>
      <Col span="2"><Button type="primary" @click="save('submit')">提交</Button></Col>
      <Col span="2"><Button type="default" shape="circle" @click="back()">返回</Button></Col>
    </Row>

    <Modal
      v-model="chooseCompanyModal"
      title="选择供应商"
      @on-cancel="chooseCompanyModal=false" class="info">

      <Row>
        <Col span="5">
        <p class="input-text">公司名称：</p>
        </Col>
        <Col span="11">
        <p class="input-text" style="text-align: left;padding-bottom: 10px"><Input v-model="company_key"  style="width: 200px"></Input></p>
        </Col>
        <Col  span="3">
        <Button type="primary" @click="searchcompany">查询</Button>
        </Col>
      </Row>

      <Row>
        <Col>
        <Table stripe border highlight-row :columns="choose_company" :data="data1" size="small" ref="table"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="company_total" :current="company_current" @on-change="company_changePage" :page-size="company_size"></Page>
          </div>
        </div>
        </Col>
      </Row>

    </Modal>

    <Modal
      v-model="addModal"
      title="添加商品"
      @on-cancel="addModal=false" class="info">

      <Row>
        <Col span="5">
          <p class="input-text">商品名称：</p>
        </Col>
        <Col span="11">
          <p class="input-text" style="text-align: left;padding-bottom: 10px"><Input v-model="key"  style="width: 200px"></Input></p>
        </Col>
        <Col  span="3">
          <Button type="primary" @click="searchproduct">查询</Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table stripe border highlight-row :columns="choose_products" :data="data2" size="small" ref="table"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="product_total" :current="product_current" @on-change="product_changePage" :page-size="product_size"></Page>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate} from '@/api/common.js'


export default {
  data () {
    return {
      addModal: false,
      key: '',
      moneySum: 0,
      countSum: 0,
      company_key: '',
      company_total:0,
      company_size:5,
      company_current:1,
      product_key: '',
      product_total:0,
      product_size:5,
      product_current:1,
      data2: [],
      data1: [],
      houseList: [
        {
          label: '主仓库',
          value: '主仓库'
        }
      ],
      chooseCompanyModal: false,
      product: {
        fullName: '',
        spec: '',
        specList: [
          {
            label: '包',
            value: '包'
          },
          {
            label: '箱',
            value: '箱'
          },
          {
            label: '瓶',
            value: '瓶'
          }
        ],
        unit: '',
        quantity: '',
        price: '',
        accountdPrice: '',
        account: '',
        money: '',
        accountdMoney: ''
      },
      infoModal: false,
      formItem: {
        wareHouse: '',
        company: '',
        companyId: '',
        createdAt: _timestrToDate(Date.now()),
        createdBy: '',
        companyContact: '',
        companyContactPhone: '',
        inputs: [],
        financeTitile: '',
        remark: ''
      },
      tableTitle: [
        {
          title: '编号',
          key: 'id',
          width: 60
        },
        {
          title: '商品全名称',
          key: 'name'
        },
        {
          title: '规格',
          key: 'spec',
          width: 70
        },
        {
          title: '单位',
          key: 'unit',
          width: 70
        },
        {
          title: '数量',
          key: 'quantity',
          width: 120,
          render:(h,params)=>{
            return h('InputNumber',{
              props:{
                value: params.row.quantity,
              },
              attrs:{
                id: 't_' + params.row.id
              },

              on:{
                'on-change':(val)=>{
                  var id = params.row.id;
                  var datas = this.formItem.inputs;
                  var value = val;
                  var tmp;
                  var idx;
                  var countSum = 0;
                  var moneySum = 0;
                  var pi = 0.00;
                  datas.forEach(function(v,i,datas){
                    if (v.id == id){
                      idx = i;
                      v.quantity = value;
                      v.money = (value * v.price).toFixed(2);
                      v.accountedMoney = (value * v.price * (v.account/10)).toFixed(2);
                      v.accountedPrice = (v.price *  (v.account/10)).toFixed(2);
                      tmp = v;
                    }
                    pi = parseFloat(v.accountedMoney);
                    countSum += v.quantity;
                    moneySum += pi;
                  });
                  this.countSum = countSum;
                  this.moneySum = moneySum.toFixed(2);
                  datas.splice(idx,1,tmp);
                }
              }
            },'查看');
          }
        },
        {
          title: '单价',
          key: 'price',
          width: 120,
          render:(h,params)=>{
            return h('InputNumber',{
              props:{
                value: params.row.price,
              },
              attrs:{
                id: 'p_' + params.row.id
              },

              on:{
                'on-change':(val)=>{
                  var id = params.row.id;
                  var datas = this.formItem.inputs;
                  var value = val;
                  var tmp;
                  var idx;
                  var countSum = 0;
                  var moneySum = 0;
                  var pi = 0.00;
                  datas.forEach(function(v,i,datas){
                    if (v.id == id){
                      idx = i;
                      v.price = value;
                      v.money = (value * v.quantity).toFixed(2);
                      v.accountedMoney = (value * v.quantity * (v.account/10)).toFixed(2);
                      v.accountedPrice = (v.price *  (v.account/10)).toFixed(2);
                      tmp = v;
                    }
                    pi = parseFloat(v.accountedMoney);
                    countSum += v.quantity;
                    moneySum += pi;
                  });
                  this.countSum = countSum;
                  this.moneySum = moneySum.toFixed(2);
                  datas.splice(idx,1,tmp);
                }
              }
            },'查看');
          }
        },
        {
          title: '折扣',
          key: 'account',
          width: 70
        },
        {
          title: '金额',
          key: 'money',
          width: 70
        },
        {
          title: '折后单价',
          key: 'accountedPrice',
          width: 100
        },
        {
          title: '折后金额',
          key: 'accountedMoney',
          width: 100
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'id',
          render:(h,params)=>{
            return h('Button',{
              props:{
                type:'info',
                size:'small'
              },
              on:{
                click:()=>{
                  this.deleteproduct(params.row.id);
                }
              }
            },'移除');
          }
        }
      ],
    choose_products: [
      {
        title: '操作',
        key: 'c',
        render:(h,params)=>{
          return h('Button',{
            props:{
              type:'info',
              size:'small'
            },
            on:{
              click:()=>{
                this.addproducttoInput(params.row);
              }
            }
          },'添加');
        }
      },
      {
        title: '编号',
        key: 'id',
        width: 60
      },
      {
        title: '商品全名称',
        key: 'name'
      },
      {
        title: '供应商',
        key: 'company'
      },
      {
        title: '单价',
        key: 'price'
      },
      {
        title: '规格',
        key: 'spec'
      },
      {
        title: '折扣',
        key: 'account'
      }
    ],
    choose_company:[
      {
        title: '操作',
        key: 'c',
        render:(h,params)=>{
          return h('Button',{
            props:{
              type:'info',
              size:'small'
            },
            on:{
              click:()=>{
                this.setcompanytoInput(params.row);
              }
            }
          },'设置');
        }
      },
      {
        title: '编号',
        key: 'id'
      },
      {
        title: '商家名称',
        key: 'companyName'
      },
      {
        title: '联系人',
        key: 'managerName'
      },
      {
        title: '联系方式',
        key: 'phoneNumber'
      },
      {
        title: '税号',
        key: 'taxNumber'
      },
      {
        title: '发票抬头',
        key: 'title'
      }

    ]
    }
  },
  mounted(){
    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
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
  },
  methods:{
    // 移除商品
    deleteproduct(id){
      var datas = this.formItem.inputs;
      datas.forEach(function(v,i,datas){
          if (v.id == id){
            datas.splice(i,1);
          }
      });
      this.updateCountAndMoney();
    },

    // 更新总价总数量
    updateCountAndMoney(){
      var datas = this.formItem.inputs;
      var countSum = 0;
      var moneySum = 0;
      var pi = 0.00;
      datas.forEach(function(v,i,datas){
        pi = parseFloat(v.accountedMoney);
        countSum += v.quantity;
        moneySum += pi;
      });
      this.countSum = countSum;
      this.moneySum = moneySum.toFixed(2);
    },
    // 选择供应商
    chooseCompany(){
      this.chooseCompanyModal = true;
    },
    // 添加商品
    addProduct(){
      this.addModal = true;
    },
    // 商品查询
    searchproduct(){
      axios.get(URL+'accountFinance/repoproducts',{
        params:{
          page:0,
          size:this.product_size,
          key:this.product_key
        }
      }).then(function(res){
        var data = res.data.data;
        this.product_total = data.total;
        this.product_current = data.current+1;
        this.data2 = data.data;
      }.bind(this)).catch(function(res){
        this.$Message.error('查询请求失败');
      }.bind(this))
    },
    // 商品翻页
    product_changePage(n){
      n = n-1;
      axios.get(URL+'accountFinance/repoproducts',{
        params:{
          page:n,
          size:this.product_size,
          key:this.product_key
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data2 = data.data;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    // 供应商查询
    searchcompany(){
      axios.get(URL+'accountFinance/companies',{
        params:{
          page:0,
          size:this.company_size,
          key:this.company_key
        }
      }).then(function(res){
        var data = res.data.data;
        this.company_total = data.total;
        this.company_current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(res){
        this.$Message.error('查询请求失败');
      }.bind(this));
    },
    // 供应商翻页
    company_changePage(n){
      n = n-1;
      axios.get(URL+'accountFinance/companies',{
        params:{
          page:n,
          size:this.company_size,
          key:this.company_key
        }
      }).then(function(res){
        var data = res.data.data;
        this.company_total = data.total;
        this.company_current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(res){
        this.$Message.error('查询请求失败');
      }.bind(this));
    },
    // 添加商品到进货单
    addproducttoInput(obj) {
      var datas = this.formItem.inputs;
      var f = true;
      datas.forEach(function(v,i,datas){
        if (v.id == obj.id){
          alert('该商品已经加入进货单');
          f = false;
        }
      });
      if (f) {
        obj.quantity = 1;
        obj.money = (obj.quantity * obj.price).toFixed(2);
        obj.accountedMoney = (obj.quantity * obj.price * (obj.account/10)).toFixed(2);
        obj.accountedPrice = (obj.price *  (obj.account/10)).toFixed(2);
        this.formItem.inputs.push(obj);
        this.updateCountAndMoney();
      }
    },
    // 选择供应商
    setcompanytoInput(obj){
      this.formItem.company =  obj.companyName;
      this.formItem.companyId =  obj.id;
      this.formItem.companyContact = obj.managerName;
      this.formItem.companyContactPhone = obj.phoneNumber;
      this.formItem.taxNumber = obj.taxNumber;
      this.formItem.financeTitile = obj.title;
      this.chooseCompanyModal = false;
    },

    save(type){
      var params = new URLSearchParams();
      params.append('recordId', "11");
      params.append('wareHouse', this.formItem.wareHouse);
      params.append('createdAt', this.formItem.createdAt);
      params.append('companyName', this.formItem.company);
      params.append('companyId', this.formItem.companyId);
      params.append('companyContact', this.formItem.companyContact);
      params.append('companyContactPhone', this.formItem.companyContactPhone);
      params.append('title', this.formItem.financeTitile);
      params.append('remark', this.formItem.remark);
      params.append('countSum', this.countSum);
      params.append('moneySum', this.moneySum);
      params.append('saveOrSubmit', type);
      this.formItem.inputs.forEach((value,index)=>{
        params.append('inputs['+index+'].id', value.id);
        params.append('inputs['+index+'].quantity', value.quantity);
        params.append('inputs['+index+'].remark', value.remark);
        params.append('inputs['+index+'].productId', value.id);
        params.append('inputs['+index+'].price', value.price);
        params.append('inputs['+index+'].account', value.account);
        params.append('inputs['+index+'].money', value.money);
        params.append('inputs['+index+'].accountedPrice', value.accountedPrice);
        params.append('inputs['+index+'].accountedMoney', value.accountedMoney);
      });
      axios.post(URL+'accountFinance/addInputs',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('添加成功');
          this.$router.push('/checkbalance/index/index');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));
    },
    back(){
      this.$router.push(
        {
          path: '/checkbalance/index/index'
        }
      );
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    text-align: right;
    line-height: 32px;
    padding-right: 30px;
  }
  .table{
    width: 100%;
    border-collapse: collapse;
  }
  .ivu-col-span-4{

  }
</style>

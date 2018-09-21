<template>
  <div class="content-box">
    <Row>
      <Col span="6">
      <Bread></Bread>
      </Col>
    </Row>

    <Row class="margin-10">
      <Col span="12">
        <div class="searchBox addBox">
          <Input v-model="key" icon="ios-search" placeholder="商家名称" style="width: 200px"></Input>
          <Select v-model="paid" style="width:100px" placeholder="是否付款">
            <Option v-for="item in paidList" :value="item.value" :key="item.label" >{{ item.label }}</Option>
          </Select>
          <Select v-model="received" style="width:100px" placeholder="是否收货">
            <Option v-for="item in receivedList" :value="item.value" :key="item.label" >{{ item.label }}</Option>
          </Select>
          <Button type="primary" @click="search">查询</Button>
          <Button type="success" @click="clear">置空</Button>
        </div>
      </Col>
      <Col span="2" offset="8">
      <div class="addBox">
        <Button type="info" icon="plus" @click="addInput">新增进货单</Button>
      </div>
      </Col>
    </Row>

    <div class="layout-content-main">
      <Table @on-row-click="getSumpay" stripe border highlight-row :columns="tableTitle" :data="data1" size="small" ref="table"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="current" @on-change="changePage" :page-size="size"></Page>
        </div>
      </div>
    </div>

    <Card style="width:350px">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        付款金额: {{showCom}}
      </p>
      <a slot="extra">
        <Icon type="ios-loop-strong"></Icon>
      </a>
      <ul>
        <li>已付款: <input readonly v-model="paidMoney"/>元</li>
        <li>未付款: <input readonly v-model="unpaidMoney"/>元</li>
      </ul>
    </Card>

  </div>
</template>

<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate} from '@/api/common.js'


export default {
  data () {
    return {
      key: '',
      showCom: '',
      paidMoney: '0',
      unpaidMoney: '0',
      paid: '',
      paidList: [
        {
          value: '0',
          label: '未付款'
        },
        {
          value: '1',
          label: '已付款'
        }
      ],
      received:'',
      receivedList: [
        {
          value: '0',
          label: '未收获'
        },
        {
          value: '1',
          label: '已收获'
        }
      ],
      beginTs: '',
      endTs: '',
      companyName: '',
      total:0,
      size:5,
      current:1,
      date: '',
      data1: [],
      tableTitle: [
        {
          title: '编号',
          key: 'id',
          width: 60
        },
        {
          title: '商家名称',
          key: 'companyName'
        },
        {
          title: '联系人',
          key: 'companyContact',
          width: 90
        },
        {
          title: '联系方式',
          key: 'companyContactPhone',
          width: 120
        },
        {
          title: '折后金额',
          key: 'moneySum',
          width: 90
        },
        {
          title: '制单时间',
          key: 'createdAt',
          render:(h,params)=>{
            var m = _timestrToDate(params.row.createdAt);
            return h('div', [
              h('Icon', {
                props: {
                  type: 'ionic'
                }
              }),
              h('normal', m)
            ]);
          }
        },
        {
          title: '收货',
          key: 'received',
          width: 70,
          render:(h,params)=>{
            var c = params.row.received;
            var m;
            if( c == true ){
              m = '是';
            }else {
              m = '否'
            }
            return h('div', [
              h('Icon', {
                props: {
                  type: 'ionic'
                }
              }),
              h('strong', m)
            ]);
          }

        },
        {
          title: '付款',
          key: 'paid',
          width: 70,
          render:(h,params)=>{
            var c = params.row.paid;
            var m;
            if( c == true ){
              m = '是';
            }else {
              m = '否'
            }
            return h('div', [
              h('Icon', {
                props: {
                  type: 'ionic'
                }
              }),
              h('strong', m)
            ]);
          }
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '查看明细',
          key: 'id',
          render:(h,params)=>{
            var rec = h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.finishReceived(params.row.id);
                }
              }
            }, '确认收货');
            var pay = h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.finishPaid(params.row.id);
                  }
                }
              }, '完成付款');
            var see = h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.showInfo(params.row.id);
                }
              }
            }, '查看');
            if (params.row.paid == true && params.row.received == false){
              return h('div', [rec, see]);
            }else if(params.row.paid == false && params.row.received == false){
              return h('div', [pay,rec, see]);
            }else if(params.row.paid == true && params.row.received == true){
              return h('div', [see]);
            }else if(params.row.paid == false && params.row.received == true){
              return h('div', [pay,see]);
            }
          }
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
    this.search();
  },
  methods:{
    // 完成付款
    finishPaid(id) {
      var params = new URLSearchParams();
      params.append('id', id);
      params.append('paid', true);
      axios.post(URL+'accountFinance/updateRepoInputStatus',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('修改成功');
        }
        this.search();
      }.bind(this)).catch(function(error){
        this.$Message.error('修改失败');
      }.bind(this));
    },
    // 完成收货
    finishReceived(id){
      var params = new URLSearchParams();
      params.append('id', id);
      params.append('received', true);
      axios.post(URL+'accountFinance/updateRepoInputStatus',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('修改成功');
        }
        this.search();
      }.bind(this)).catch(function(error){
        this.$Message.error('修改失败');
      }.bind(this));
    },
    statusChange(e){
    },
    dateChange(e){
      this.beginTs=Date.parse(new Date(e[0]));
      this.endTs=Date.parse(new Date(e[1]));
    },
    dataClear(){
      this.companyName = '';
      this.received = '';
      this.paid = '';

    },
    clear(){
      this.key = '';
      this.paid = '';
      this.received = '';
    },
    // 查看明细
    showInfo(idx){
      this.$router.push(
        {
          path: '/checkbalance/index/detail' ,
          query: {
            id:idx
          }
        }
      );
    },
    // 查询
    search(){
      axios.get(URL+'accountFinance/repoinputs',{
        params:{
          page:0,
          size:this.size,
          startTs:this.startTs,
          endTs:this.endTs,
          companyName:this.key,
          paid:this.paid,
          received: this.received,
          submitted: true
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(res){
        this.$Message.error('查询请求失败');
      }.bind(this));
    },
    changePage(n){
      n = n-1;
      this.spin = true;
      axios.get(URL+'accountFinance/repoinputs',{
        params:{
          page:n,
          size:this.size,
          startTs:this.startTs,
          endTs:this.endTs,
          companyName:this.key,
          paid:this.paid,
          received: this.received,
          submitted: true
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    addInput(){
      this.$router.push('/checkbalance/index/addInput');
    },
    getSumpay(obj){
      var companyName = obj.companyName;
      this.showCom = companyName;
      axios.get(URL+'accountFinance/getPayResultByCompany',{
        params:{
          companyName:companyName
        }
      }).then(function(res){
        var data = res.data.data;
        this.unpaidMoney = data.unpaidSum;
        this.paidMoney = data.paidSum;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

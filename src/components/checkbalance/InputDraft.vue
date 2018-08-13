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
      <Table  stripe border highlight-row :columns="tableTitle" :data="data1" size="small" ref="table"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="current" @on-change="changePage" :page-size="size"></Page>
        </div>
      </div>
    </div>
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
      total:0,
      size:10,
      current:1,
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
          key: 'companyContactPhone'
        },
        {
          title: '折后金额',
          key: 'moneySum'
        },
        {
          title: '制单时间',
          key: 'createdAt',
          render:(h,params)=>{
            var c = params.row.createdAt;
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
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'id',
          render:(h,params)=>{
            var edit = h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.edit(params.row.id);
                  }
                }
              }, '修改');
            var submit = h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '2px'
              },
              on: {
                click: () => {
                  this.submit(params.row.id);
                }
              }
            }, '提交');

              return h('div', [edit, submit]);
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
    // 置空查询条件
    clear(){
      this.key = '';
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
          submitted: false
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
      axios.get(URL+'order',{
        params:{
          page:n,
          size:this.size,
          companyName:this.key,
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
    // 修改
    edit(idx){
      this.$router.push(
        {
          path: '/checkbalance/index/inputDetailEdit' ,
          query: {
            id:idx
          }
        }
      );
    },
    submit(idx){
      var params = new URLSearchParams();
      params.append('id', idx);
      axios.post(URL+'accountFinance/submitInputs',params).then(function(res){

        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('提交成功');
          this.search();
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('提交失败');
      }.bind(this));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

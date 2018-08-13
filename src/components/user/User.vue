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
         <!--  <DatePicker type="daterange" placement="bottom-start" placeholder="选择日期" style="width: 200px" v-model="date"></DatePicker> -->
          <Input v-model="key" icon="ios-search" placeholder="公司名称/负责人手机号" style="width: 200px"></Input>
          <Select v-model="fv" @on-change="statusChange" style="width:100px" placeholder="是否过滤游客">
              <Option v-for="item in statusSelect" :value="item.value" :key="item.value" >{{ item.label }}</Option>
          </Select>
          <Button type="primary" @click="search">查询</Button>
        </div>
      </Col>
      <Col span="2" offset="8">
        <div class="addBox">
          <Button type="info" icon="plus" @click="addModal=true">添加新用户</Button>
        </div>
      </Col>
    </Row>

    <div class="layout-content-main">
     <Table stripe border highlight-row :columns="columns1" :data="data1" ></Table>
     <div style="margin: 10px;overflow: hidden">
         <div style="float: right;">
             <Page :total="total" :current="current" @on-change="changePage"></Page>
         </div>
     </div>
    </div>

    <Modal
        v-model="addModal"
        title="添加新用户"
        @on-ok="add"
        @on-cancel="addModal=false">

        <Row>
          <Col span="6">
              <p class="margin-10">公司名称</p>
          </Col>
          <Col span="18">
            <Input v-model="newUser.companyName" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司负责人</p>
          </Col>
          <Col span="18">
            <Input v-model="newUser.name" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司负责人联系方式</p>
          </Col>
          <Col span="18">
            <Input v-model="newUser.phone" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司地址</p>
          </Col>
          <Col span="18">
            <Input v-model="newUser.address" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">登录名</p>
          </Col>
          <Col span="18">
            <Input v-model="newUser.username" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">密码</p>
          </Col>
          <Col span="18">
            <Input v-model="newUser.password" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">税号</p>
          </Col>
          <Col span="18">
            <Input v-model="newUser.taxNumber" style="width: 300px" ></Input>
          </Col>
        </Row>
    </Modal>

    <Modal
        v-model="updateModal"
        title="用户修改"
        @on-ok="update"
        @on-cancel="updateModal=false">

        <Row>
          <Col span="6">
              <p class="margin-10">公司名称</p>
          </Col>
          <Col span="18">
            <Input v-model="updateUser.name" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司负责人</p>
          </Col>
          <Col span="18">
            <Input v-model="updateUser.managerName" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司负责人联系方式</p>
          </Col>
          <Col span="18">
            <Input v-model="updateUser.phoneNumber" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司地址</p>
          </Col>
          <Col span="18">
            <Input v-model="updateUser.address" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">登录名</p>
          </Col>
          <Col span="18">
            <Input v-model="updateUser.username" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">密码</p>
          </Col>
          <Col span="18">
            <Input v-model="updateUser.password" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">税号</p>
          </Col>
          <Col span="18">
            <Input v-model="updateUser.taxNumber" style="width: 300px" ></Input>
          </Col>
        </Row>
    </Modal>


    <Spin class="demo-spin-col" v-if="spin">
        <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
    </Spin>

  </div>
</template>

<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate,_timestrToHs} from '@/api/common.js'
export default {
  data () {
    return {
      fv:'0',
      statusSelect: [
                  {
                      value: '0',
                      label: '不过滤'
                  },
                  {
                      value: '1',
                      label: '过滤'
                  },
              ],
      newUser:{
        company:'',
        name:'',
        phone:'',
        username:'',
        address:'',
        password:'',
        taxNumber:''
      },
      updateUser:{},
      addModal:false,
      updateModal:false,
      date:'',
      total:0,
      current:1,
      size:10,
      spin:false,
      key:'',
      data1: [],

      columns1: [
                 {
                     title: '编号',
                     key: 'id'
                 },
                 {
                     title: '公司名称',
                     key: 'name'
                 },
                 {
                     title: '负责人姓名',
                     key: 'managerName',
                 },
                 {
                     title: '负责人手机号',
                     key: 'phoneNumber',
                 },
                 {
                     title: '信用额度',
                     key: 'reditAmount',
                 },
                 {
                     title: '登陆名',
                     key: 'username',
                 },
                 {
                     title: '创建时间',
                     key: 'createdAt',
                     render:(h,params)=>{
                      return _timestrToDate(params.row.createdAt);
                     }
                 },
                 {
                     title: '结算时间',
                     key: 'settleTs',
                     render:(h,params)=>{
                      return _timestrToDate(params.row.settleTs);
                     }
                 },
                 {
                     title: '账期状态',
                     key: 'cycleStatus',
                     render:(h,params)=>{
                        var type = params.row.cycleStatus==true || params.row.cycleStatus==null ? 'default' : 'info';
                        var statusName = params.row.cycleStatus==true || params.row.cycleStatus==null ? '正常' : '冻结';
                        return h('Button',{
                          props:{
                            type:type,
                            size:'small'
                          }
                        },statusName);
                     }
                 },
                 {
                     title: '操作',
                     key: 'action',
                     width: 200,
                     align: 'center',
                     render: (h, params) => {
                         var type =params.row.cycleStatus==true || params.row.cycleStatus==null ? 'error' : 'info';
                         var statusName = params.row.cycleStatus==true || params.row.cycleStatus==null ? '冻结' : '恢复正常';
                         return h('div', [
                             h('Button', {
                                 props: {
                                     type: 'warning',
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                         this.udpateShow(params.index);
                                     }
                                 }
                             }, '修改'),
                             h('Button', {
                                 props: {
                                     type: type,
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                        this.freez(params.index);
                                     }
                                 }
                             }, statusName),
                         ]);
                     }
                 }
             ],
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
    this.dataInit();
  },
  methods:{
    dataInit(){
      axios.get(URL+'user',{
        params:{
          page:0,
          size:this.size,
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    updateInit(){
      axios.get(URL+'user',{
        params:{
          page:this.current-1,
          size:this.size,
          key:this.key,
          fv:this.fv
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    changePage(n){
      n = n-1;
      this.spin = true;
      axios.get(URL+'user',{
        params:{
          page:n,
          size:this.size,
          key:this.key,
          fv:this.fv
        }
      })
        .then(function(res){
          var data = res.data.data;
          this.total = data.total;
          this.current = data.current+1;
          this.data1 = data.data;
          this.spin = false;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    search(){
      console.log(this.key);
      this.spin = true;
      axios.get(URL+'user',{
        params:{
          page:0,
          size:this.size,
          key:this.key,
          fv:this.fv
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
        this.spin = false;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    add(){
        var params = new URLSearchParams();
        params.append('name', this.newUser.name);
        params.append('companyName', this.newUser.companyName);
        params.append('phone', this.newUser.phone);
        params.append('address', this.newUser.address);
        params.append('username', this.newUser.username);
        params.append('password', this.newUser.password);
        params.append('taxNumber', this.newUser.taxNumber);
        axios.post(URL+'user',params).then(function(res){
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
    udpateShow(i){
      var id = this.data1[i].id;
      this.spin = true;
      axios.get(URL+'user/'+id).then(function(res){
        var data = res.data;
        this.updateUser = data.data;
        this.spin = false;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
      this.updateModal = true;
    },
    update(){
      if(this.updateUser.password==undefined){
        this.updateUser.password='';
      }
      var params = 'name='+this.updateUser.managerName+'&companyName='+this.updateUser.name+'&phone='+this.updateUser.phoneNumber+'&address='+this.updateUser.address+'&username='+this.updateUser.username+'&password='+this.updateUser.password+'&taxNumber='+this.updateUser.taxNumber;

      axios.put(URL+'user/'+this.updateUser.id+'?'+params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('修改成功');
          this.updateInit();
        }
        this.addModal = false;
      }.bind(this)).catch(function(error){
        this.$Message.error('修改失败');
      }.bind(this));
    },
    freez(index){
      var id = this.data1[index].id;
      var status = 1;
      if(this.data1[index].cycleStatus==true || this.data1[index].cycleStatus==null){
        status = 0;
      }
      axios.put(URL+'/user/cycle/'+id+'?state='+status).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('请求成功');
          this.updateInit();
        }
      }.bind(this)).catch(function(res){
        this.$Message.error('请求失败');
      }.bind(this));
    },
    statusChange(e){
      this.status = e;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>

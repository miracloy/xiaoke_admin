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
          <Input v-model="key" icon="ios-search" placeholder="公司名称/用户手机号/用户登录名" style="width: 300px"></Input>
          <Select v-model="fv" @on-change="statusChange" style="width:100px" placeholder="是否过滤游客">
              <Option v-for="item in statusSelect" :value="item.value" :key="item.value" >{{ item.label }}</Option>
          </Select>
          <Button type="primary" @click="search">查询</Button>
          <Button type="success" @click="clear">置空</Button>
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
             <Page :total="total" :page-size="size"  @on-change="changePage"></Page>
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
          <Tag>{{newUser.companyName}}</Tag>
          <Select filterable v-model="newUser.companyId" @on-change="newcompanyChange" style="width:200px" placeholder="选择公司">
            <Option v-for="item in  companyList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
          </Select>
          </Col>
        </Row>
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
          <p class="margin-10">用户手机号</p>
          </Col>
          <Col span="18">
          <Input v-model="newUser.userphone" style="width: 300px" ></Input>
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
            <Tag>{{updateUser.companyName}}</Tag>
            <!--<Input v-model="updateUser.name" style="width: 100px" ></Input>-->
            <Select filterable v-model="updateUser.companyId" @on-change="companyChange" style="width:200px" placeholder="选择公司">
              <Option v-for="item in  companyList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司负责人</p>
          </Col>
          <Col span="18">
            <Input readonly v-model="updateUser.managerName" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司负责人联系方式</p>
          </Col>
          <Col span="18">
            <Input readonly v-model="updateUser.phoneNumber" style="width: 300px" ></Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司地址</p>
          </Col>
          <Col span="18">
            <Input readonly v-model="updateUser.address" style="width: 300px" ></Input>
          </Col>
        </Row>
      <Row>
        <Col span="6">
        <p class="margin-10">用户公司别名</p>
        </Col>
        <Col span="18">
        <Input v-model="updateUser.companyName" style="width: 300px" ></Input>
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
          <p class="margin-10">登录名</p>
          </Col>
          <Col span="18">
          <Input v-model="updateUser.userphone" style="width: 300px" ></Input>
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
      fv:'1',
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
        company: '',
        name: '',
        phone: '',
        username: '',
        userphone: '',
        address: '',
        password: ''
      },
      companyList:[],
      updateUser:{},
      addModal:false,
      updateModal:false,
      total:0,
      current:1,
      size:1,
      spin:false,
      key:'',
      data1: [],

      columns1: [
                 {
                     title: '编号',
                     key: 'id',
                     width:60,
                 },
                 {
                     title: '公司名称',
                     key: 'companyName'
                 },
                 {
                     title: '负责人姓名',
                     key: 'managerName',
                     width:100,
                 },
                 {
                     title: '用户手机',
                     key: 'phone',
                 },
                 {
                     title: '信用额度',
                     key: 'reditAmount',
                     width:90,
                 },
                 {
                     title: '登陆名',
                     key: 'username',
                 },
                 {
                     title: '创建时间',
                     key: 'createdAt',
                     render:(h,params)=>{
                      return h('span', _timestrToDate(params.row.createdAt));
                     }
                 },
                 {
                     title: '结算时间',
                     key: 'settleTs',
                     render:(h,params)=>{
                      return h('span',_timestrToDate(params.row.settleTs));
                     }
                 },
                 {
                     title: '账期状态',
                     key: 'cycleStatus',
                     width:90,
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
    //数据初始化
    dataInit(){
      this.doSearch(null, this.fv, this.size, 0);
      this.getCompanyList();
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
    // 翻页
    changePage(n){
      n = n-1;
      this.doSearch(this.key, this.fv, this.size, n);
      /*axios.get(URL+'user',{
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
      });*/
    },
    // 查询
    search(){
      this.doSearch(this.key, this.fv, this.size, 0);
    },
    // 查询
    doSearch(key, fv, size, page){
      axios.get(URL+'user',{
        params:{
          page: page,
          size: size,
          key: key,
          fv: fv
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
        this.spin = false;
        debugger
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 置空
    clear(){
      this.key = '';
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
        params.append('companyId', this.newUser.companyId);

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
      this.getCompanyList();
    },
    update(){
      if(this.updateUser.password===undefined){
        this.updateUser.password='';
      }
      if(this.updateUser.companyId===undefined){
        this.updateUser.companyId='';
      }
      var params = 'companyName='+this.updateUser.companyName+'&username='+this.updateUser.username+
        '&password='+this.updateUser.password + '&companyId=' + this.updateUser.companyId;

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
    companyChange(e){
      let cid = e;
      axios.get(URL+'company/' + cid,{
        params:{}
      }).then(function(res){
        var datas = res.data.data;
        this.updateUser.name = datas.companyName;
        this.updateUser.managerName = datas.managerName;
        this.updateUser.phoneNumber = datas.phoneNumber;
        this.updateUser.address = datas.address;
        this.updateUser.companyId = datas.id;

      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    newcompanyChange(e){
      let cid = e;
      axios.get(URL+'company/' + cid,{
        params:{}
      }).then(function(res){
        var datas = res.data.data;
        this.newUser.companyName = datas.companyName;
        this.newUser.name = datas.managerName;
        this.newUser.phone = datas.phoneNumber;
        this.newUser.address = datas.address;
        this.newUser.companyId = datas.id;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    getCompanyList(){
      axios.get(URL+'company/getSimpleCompanies',{
        params:{}
      }).then(function(res){
        var datas = res.data.data;
        var list = new Array();
        datas.forEach(function(v,i,datas){
          var o = {
            label: v.companyName + ' ' + v.managerName,
            value: v.id
          };
          list.push(o);
        });
        this.companyList = list;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>

<template>
  <div class="content-box">
    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

    <Row class="margin-10">
      <Col span="2" offset="0">
        <div class="addBox">
          <Button type="info" icon="plus" @click="addModal=true">新增热门类型</Button>
        </div>
      </Col>
    </Row>
    
    <div class="layout-content-main">
     <Table stripe border highlight-row :columns="columns1" :data="data1"></Table>
     <div style="margin: 10px;overflow: hidden">
           <div style="float: right;">
               <Page :total="total" :current="current" @on-change="changePage"></Page>
           </div>
     </div>
    </div>

    <Modal
        v-model="addModal"
        title="新增"
        @on-cancel="addModal=false" class="info">
    
        <Row>
          <Col span="6">
              <p class="margin-10">类型名称（英文）</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <Input v-model="formItem.type"></Input>
              </p>
          </Col>
        </Row>

        <Row>
          <Col span="6">
              <p class="margin-10">类型名称（中文）</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <Input v-model="formItem.title"></Input>
              </p>
          </Col>
        </Row>

        <Row>
          <Col span="6">
              <p class="margin-10">是否启用</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <RadioGroup v-model="formItem.status">
                    <Radio label='1'>是</Radio>
                    <Radio label='0'>否</Radio>
                </RadioGroup>
              </p>
          </Col>
        </Row>

        <Row>
          <Col span="6">
              <p class="margin-10">优先级</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                 <InputNumber :max="10" :min="0" v-model="formItem.displayOrder"></InputNumber>
              </p>
          </Col>
        </Row>
        
        <div slot="footer">
          <Button type="primary" @click="add()">确定</Button>
        </div>
    </Modal>

    <Modal
        v-model="updateModal"
        title="修改"
        @on-cancel="updateModal=false" class="info">
    
        <Row>
          <Col span="6">
              <p class="margin-10">类型名称（英文）</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <Input v-model="formItem1.type"></Input>
              </p>
          </Col>
        </Row>

        <Row>
          <Col span="6">
              <p class="margin-10">类型名称（中文）</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <Input v-model="formItem1.title"></Input>
              </p>
          </Col>
        </Row>

        <Row>
          <Col span="6">
              <p class="margin-10">是否启用</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <RadioGroup v-model="formItem1.status">
                    <Radio label='1'>是</Radio>
                    <Radio label='0'>否</Radio>
                </RadioGroup>
              </p>
          </Col>
        </Row>

        <Row>
          <Col span="6">
              <p class="margin-10">优先级</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                 <InputNumber :max="10" :min="0" v-model="formItem1.displayOrder"></InputNumber>
              </p>
          </Col>
        </Row>
        
        <div slot="footer">
          <Button type="primary" @click="update()">确定</Button>
        </div>
    </Modal>

    <Modal
        v-model="bannerModal"
        title="所属消息">
        <Table stripe border highlight-row :columns="banner_column" :data="banners"></Table>
        <div style="margin: 10px;overflow: hidden">
              <div style="float: right;">
                  <Page :total="type_total" :current="type_page" @on-change="changePage"></Page>
              </div>
        </div>
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
import {_timestrToDate} from '@/api/common.js'
export default {
  data () {
    return {
      formItem:{
        type:'',
        title:'',
        status:'1',
        displayOrder:0,
      },
      formItem1:{
        type:'',
        title:'',
        status:'1',
        displayOrder:0,
      },
      addModal:false,
      bannerModal:false,
      updateModal:false,
      update_id:-1,
      total:0,
      current:1,
      type_page:1,
      type_total:0,
      spin:false,
      searchStr:'',
      size:10,
      banners:[],
      bannerTypeId:'',
      data1: [],
      banner_column:[
        {
          title:'ID',
          key:'id'
        },
        {
          title:'消息名称',
          key:'name'
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'error',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.unbind(params.row.id,this.bannerTypeId);
                            }
                        }
                    }, '解绑'),
                ]);
            }
          }
      ],
      columns1: [
                 {
                     title: '类型名称（英文）',
                     key: 'type'
                 },
                 {
                     title: '类型名称（中文）',
                     key: 'title',
                 },
                 {
                     title: '是否启用',
                     key: 'status',
                     render:(h,params)=>{
                        var msg = params.row.status==true ? '启用' : '停用';
                        var type = params.row.status==true ? 'success' : 'error';

                        return h('div', [
                            h('Button', {
                                props: {
                                    type: type,
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, msg),
                        ]);

                     }
                 },
                 {
                     title: '优先级',
                     key: 'displayOrder',
                     render:(h,params)=>{
                        return params.row.displayOrder;
                     }
                 },
                 {
                     title: '消息',
                     key: 'id',
                     render: (h, params) => {
                         return h('div', [
                             h('Button', {
                                 props: {
                                     type: 'info',
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                        this.listBannersByBanner(params.row.id);
                                     }
                                 }
                             }, '所属消息'),
                         ]);
                      }
                 },
                 {
                     title: '操作',
                     key: 'action',
                     width: 200,
                     align: 'center',
                     render: (h, params) => {
                         return h('div', [
                             h('Button', {
                                 props: {
                                     type: 'primary',
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                         this.updateModal = true;
                                         this.update_id = params.row.id;
                                         this.formItem1 = {
                                          type:params.row.type,
                                          title:params.row.title,
                                          status:params.row.status===true ? '1' :'0',
                                          displayOrder:params.row.displayOrder,
                                         };
                                     }
                                 }
                             }, '修改'),
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
                                         this.delete(params.index);
                                     }
                                 }
                             }, '删除'),
                         ]);
                     }
                 }
             ],
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

  },
  methods:{
    dataInit(){
      axios.get(URL+'bannerType',{
        params:{
          page:0,
          size:this.size,
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    updateInit(){
      axios.get(URL+'bannerType',{
        params:{
          page:this.current-1,
          size:this.size,
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    changePage(n){
      n = n-1;
      axios.get(URL+'bannerType',{
        params:{
          page:n,
          size:this.size,
        }
      })
        .then(function(res){
          var data = res.data.data;
          this.total = data.total;
          this.current = data.current+1;
          this.data1 = data.data.data;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    add(){
      var params = new URLSearchParams();
      
      params.append('type', this.formItem.type);
      params.append('title', this.formItem.title);
      params.append('status', this.formItem.status==='1'?true:false);
      params.append('displayOrder', this.formItem.displayOrder);

      axios.post(URL+'bannerType/save',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('添加成功');
          this.addModal = false;
          this.formItemClear();
          this.updateInit();
        }

      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));
    },
    update(){
      var params = new URLSearchParams();
      
      params.append('type', this.formItem1.type);
      params.append('title', this.formItem1.title);
      params.append('status', this.formItem1.status==='1'?true:false);
      params.append('displayOrder', this.formItem1.displayOrder);

      axios.post(URL+'/bannerType/status/'+this.update_id,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('请求成功');
          this.updateModal = false;
          this.updateInit();
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('请求失败');
      }.bind(this));
    },
    delete(index){
      var id = this.data1[index].id;
      axios.delete(URL+'bannerType/'+id).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.updateInit();
          this.$Message.success('删除成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('删除失败');
      }.bind(this));
    },
    formItemClear(){
      this.formItem = {
        type:'',
        title:'',
        status:'1',
        displayOrder:0,
      };
    },
    // 获取某一热门类型绑定的消息列表
    listBannersByBanner(id){
      this.bannerTypeId = id;
      axios.get(URL+'bannerType/listBannersByBannerTypeId',{
        params:{
          bannerTypeId:id,
          page:0,
          size:this.size
        }
      }).then(function(res){
        var data = res.data.data;
        this.banners = data.data.data;
        this.type_page = data.current+1;
        this.type_total = data.total;
        this.bannerModal = true;
      }.bind(this));
    },
    // 解绑
    unbind(bannerId,bannerTypeId){

      var params = new URLSearchParams();
      
      params.append('bannerTypeId', bannerTypeId);
      params.append('bannerId', bannerId);
     

      axios.post(URL+'/bannerType/unbind',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('请求成功');
          this.listBannersByBanner(bannerTypeId);
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('请求失败');
      }.bind(this));

    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

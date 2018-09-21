<template>
	<div class="content-box">

    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

    <Collapse simple v-model="name">
      <Panel name="1">
        一级大类
        <div slot="content">
          <Row>
            <Col span="24">
            <h3>添加商品</h3>
            </Col>
          </Row>



          <Row class="margin-10">
            <Col span="2">
            <div class="addBox">
              <Button type="info" icon="plus" @click="addo">添加</Button>
            </div>
            </Col>
          </Row>
          <div class="layout-content-main">
            <Table stripe border highlight-row :columns="columns2" :data="data2" size="small"></Table>
          </div>

          <Modal :transfer="false"
                 :mask-closable="false"
            v-model="addModal_HOME"
            title="添加一级分类"
            @on-ok="add('HOME')"
            @on-cancel="cancel">

            <Row class="margin-10">
              <Col span="6">
              <p class="input-text">名称：</p>
              </Col>
              <Col span="16">
                <Input class="input-text" v-model="signData.name" placeholder="名称" style="width: 200px;"></Input>
              </Col>
            </Row>

            <Row class="margin-10">
              <Col span="6">
              <p class="input-text">小程序显示：</p>
              </Col>
              <Col span="16">
                <RadioGroup  class="input-text" v-model="signData.isOnShow">
                  <Radio label="1" >显示</Radio>
                  <Radio label="0" >隐藏</Radio>
                </RadioGroup>
              </Col>
            </Row>

            <Row class="margin-10">
              <Col span="6">
              <p class="input-text">排序：</p>
              </Col>
              <Col span="16">
                <Input class="input-text" v-model="signData.order" placeholder="排序" style="width: 80px" ></Input>
              </Col>
            </Row>

            <Row class="margin-10">
              <Col span="6">
              <p class="input-text">图片：</p>
              </Col>
              <Col span="16">
              <div class="demo-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="upload"
                :data="headers"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="//up.qbox.me"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal :transfer="false" title="类目图标" :mask-closable="false" v-model="visible">
                <img :src="'http://oyh65u6th.bkt.clouddn.com/' + imgName + ''" v-if="visible" style="width: 100%">
              </Modal>
              </Col>
            </Row>

          </Modal>


        </div>
      </Panel>
      <Panel name="2">
        二级类目
        <div slot="content">

          <Row class="margin-10">
            <Col span="2">
              <div class="addBox">
                <Button type="success" icon="plus" @click="addSecondCategory">..</Button>
              </div>
            </Col>
            <Col>
              <Button type="info" icon="plus" @click="addModal=true">添加</Button>
              <Button type="success"  @click="all">全部</Button>
            </Col>
          </Row>

        <div class="layout-content-main">
          <Table stripe border highlight-row :columns="columns1" :data="data1" size="small"></Table>
        </div>
        <Modal
          v-model="addModal"
          title="添加分类"
          @on-ok="add('CATEGORY')"
          @on-cancel="addModal=false">
          <p class="margin-10">名称 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="signData.name" placeholder="名称" style="width: 300px" ></Input></p>
          <p class="margin-10">是否对外开放 &nbsp;&nbsp;&nbsp;&nbsp;
            <RadioGroup v-model="signData.isOnShow">
              <Radio label="1" >显示</Radio>
              <Radio label="0" >隐藏</Radio>
            </RadioGroup>
          </p>
          <p class="margin-10">排序 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="signData.order" placeholder="排序" style="width: 300px" ></Input></p>
          <p class="margin-10">排序 &nbsp;&nbsp;&nbsp;&nbsp;
            <Select multiple v-model="signData.parent" style="width:400px" placeholder="一级">
              <Option v-for="item in homeList" :value="item.id" :key="item.name" >{{ item.name }}</Option>
            </Select>
          </p>
        </Modal>

        <Modal
          v-model="UpdateModal"
          title="修改分类"
          @on-ok="update('category')"
          @on-cancel="UpdateModal=false">
          <p class="margin-10">名称 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="updateData.name" placeholder="名称" style="width: 300px" ></Input></p>
          <p class="margin-10">排序 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="updateData.order" placeholder="排序" style="width: 300px" ></Input></p>
          <p class="margin-10" v-if="updateData.showList">排序 &nbsp;&nbsp;&nbsp;&nbsp;
            <Select multiple v-model="updateData.parent" style="width:400px" placeholder="一级">
              <Option v-for="item in homeList" :value="item.id" :key="item.name" >{{ item.name }}</Option>
            </Select>
          </p>
        </Modal>

        <Spin class="demo-spin-col" v-if="spin">
          <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
        </div>
      </Panel>
    </Collapse>






	</div>
</template>
<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import E from 'wangeditor'
export default {
  data () {
    return {
      name: ['1', '2'],
      addModal:false,
      UpdateModal:false,
      spin:false,
      signData:{
      	name:'',
        isOnShow: '1',
      	order:0,
        parent: [],
        imgs:[]
      },
      updateData:{
        name:'',
        order:0,
        parent: []
      },
      update_id:0,
      data1: [],

      addModal_HOME: false,
      data2: [],
      homeList: [],
      parent: '',

      uploadList: [],
      defaultList: [],
      visible: false,
      imgName:'',
      token:'',
      columns1: [
                 {
                     title: '类别名称',
                     key: 'name'
                 },
                 {
                     title: '商品',
                     key: 'goods',
                     render:(h,params)=>{
                        return h('Button',{
                                props:{
                                  type:'primary',
                                  size:'small'
                                },
                                on:{
                                	click:()=>{
                                		this.$router.push('/goods/index/index?currentCategoryId='+params.row.id + '&currentCategoryName=' + params.row.name);
                                	}
                                }
                              },'查看');
                     }
                 },
                {
                  title: '状态',
                  key: 'isOnShow',
                  render: (h, params) => {
                    var type2 = params.row.isOnShow==0 || params.row.isOnShow==null? 'dashed' : 'default';
                    var typeName2 = params.row.isOnShow==0 || params.row.isOnShow==null ? '已隐藏' : '显示中';
                    var icon2 = params.row.isOnShow==0 || params.row.isOnShow==null ? 'ios-arrow-thin-up' : 'ios-arrow-thin-down';

                    return h('div', [
                      h('Button', {
                        props: {
                          type: type2,
                          size: 'small',
                          shape: 'circle'
                        },
                        style: {
                          marginRight: '5px'
                        }
                      }, typeName2),
                      h('Button', {
                        props: {
                          type: 'default',
                          size: 'small',
                          icon:icon2,
                        },
                        on: {
                          click: () => {
                            this.changeOnShow(params.row._index);
                          }
                        }
                      }),
                    ]);
                  }
                },
                {
                  title: '父类',
                  key: 'parentName',
                },
                 {
                     title: '排序',
                     key: 'displayOrder',
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
                                     type: 'warning',
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                         this.UpdateModal = true;
                                         this.updateData.name = params.row.name;
                                         this.updateData.order = params.row.displayOrder;
                                         this.update_id = params.row.id;
                                         this.updateData.parent = params.row.parentId;
                                         this.updateData.showList = true;
                                     }
                                 }
                             }, '修改'),
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
                                         this.deleteCate(params.row.id);
                                     }
                                 }
                             }, '删除'),
                         ]);
                     }
                 }
             ],
      columns2: [
        {
          title: '类别名称',
          key: 'name'
        },
        {
          title: '商品',
          key: 'goods',
          render:(h,params)=>{
            return h('Button',{
              props:{
                type:'success',
                size:'small'
              },
              on:{
                click:()=>{
                 // this.$router.push('/goods/index/index?categoryId='+params.row.id);
                  this.filterCategory(params.row.id);
                }
              }
            },'查看');
          }
        },
        {
          title: '状态',
          key: 'isOnShow',
          render: (h, params) => {
            var type2 = params.row.isOnShow==0 || params.row.isOnShow==null? 'dashed' : 'default';
            var typeName2 = params.row.isOnShow==0 || params.row.isOnShow==null ? '已隐藏' : '显示中';
            var icon2 = params.row.isOnShow==0 || params.row.isOnShow==null ? 'ios-arrow-thin-up' : 'ios-arrow-thin-down';

            return h('div', [
              h('Button', {
                props: {
                  type: type2,
                  size: 'small',
                  shape: 'circle'
                },
                style: {
                  marginRight: '5px'
                }
              }, typeName2),
              h('Button', {
                props: {
                  type: 'default',
                  size: 'small',
                  icon:icon2,
                },
                on: {
                  click: () => {
                    this.changeOnShow_HOME(params.row._index);
                  }
                }
              }),
            ]);
          }
        },
        {
          title: '排序',
          key: 'displayOrder',
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
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.UpdateModal = true;
                    this.updateData.name = params.row.name;
                    this.updateData.order = params.row.displayOrder;
                    this.update_id = params.row.id;
                    this.updateData.showList = false;
                  }
                }
              }, '修改'),
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
                    this.deleteCate(params.row.id);
                  }
                }
              }, '删除'),
            ]);
          }
        }
      ],
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
          this.uploadList = this.$refs.upload.fileList;
          axios.get(URL+'token').then(function(res){
            this.token = res.data.data;
            console.log(this.token);
            this.qiniu();
          }.bind(this)).catch(function(error){
            console.log(error);
          });
          this.dataInit()
  },
  methods:{
    addo(){
      this.addModal_HOME=true;
    }
    ,
    dataInit(){
      this.getSecondCategory();
      this.getFirstCategory();

    },
    // 获取二级类目
    getSecondCategory(){
      axios.get(URL+'category').then(function(res){
        var data = res.data;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 获取一级类目
    getFirstCategory(){
      axios.get(URL+'category?categoryType=HOME').then(function(res){
        var data = res.data;
        this.data2 = data.data;
        this.homeList = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    all(){
      this.getSecondCategory();
    },
    filterCategory(id){
      axios.get(URL+'category/byparent?defaultParentCategory=' + id).then(function(res){
        var data = res.data;
        this.data1 = data.data;
        //this.parent = id;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
/*    filterCategory2(){
      let id = this.parent = id;
      this.filterCategory(id);
    },*/
  	add(type){
  	  if (this.signData.name == ''){
        this.$Message.error('商品名称不能为空');
        return;
      }
      var params = new URLSearchParams();
      params.append('name', this.signData.name);
      params.append('order', this.signData.order);
      params.append('isOnShow', this.signData.isOnShow);
      params.append('parent', this.signData.parent);
      params.append('imgs', this.signData.imgs);
      params.append('type', type);
      axios.post(URL+'category',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.signData.name = '';
          this.signData.order = 0;
          this.signData.isOnShow = '1';
          this.signData.parent = [];
          this.dataInit();
          this.$Message.success('添加成功');
        }
        this.signData.imgs=[];
        this.$refs.upload.fileList.splice(0, 1);
        this.imgName = '';
        this.visible = false;
      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));
  	},
    update(type){
      var params = new URLSearchParams();
      params.append('name', this.updateData.name);
      params.append('order', this.updateData.order);
      params.append('categoryId', this.update_id);
      if (type == 'home'){

      } else {
        params.append('parent', this.updateData.parent);
      }
      axios.post(URL+'category/update', params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.dataInit();
          this.$Message.success('修改成功');
        }
        this.updateData.name = '';
        this.updateData.order = 0;
        this.updateData.parent =[];
        this.update_id = 0;
      }.bind(this)).catch(function(error){
        this.$Message.error('修改失败');
      }.bind(this));
    },
    deleteCate(id){
      axios.delete(URL+'category/'+id).then(function(res){
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
    changeOnShow(index){
      var onshow = 0;
      var id = this.data1[index].id;
      if(this.data1[index].isOnShow==1){
        this.data1[index].isOnShow = 0;
        onshow = 0;
      }else{
        this.data1[index].isOnShow = 1;
        onshow = 1;
      }
      var params = new URLSearchParams();
      params.append('onshow',onshow);
      axios.post(URL+'category/onShow/'+id,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('请求成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('请求失败');
      }.bind(this));
    },
    changeOnShow_HOME(index){
      var onshow = 0;
      var id = this.data2[index].id;
      if(this.data2[index].isOnShow==1){
        this.data2[index].isOnShow = 0;
        onshow = 0;
      }else{
        this.data2[index].isOnShow = 1;
        onshow = 1;
      }
      var params = new URLSearchParams();
      params.append('onshow',onshow);
      axios.post(URL+'category/onShow/'+id,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('请求成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('请求失败');
      }.bind(this));
    },

    // 初始化七牛上传的方法
    qiniu(){
      var editor = new E('#editorElem')
      editor.customConfig.onchange = (html) => {
        this.formItem.longDescription = html;
      }
      editor.customConfig.uploadImgServer = '//up.qbox.me';
      editor.customConfig.uploadFileName = 'file';

      // 属性值会自动进行 encode ，此处无需 encode
      editor.customConfig.uploadImgParams = {
        token: this.token,
      }

      editor.customConfig.uploadImgHooks = {
        // 如果服务器端返回的不是 {errno:0, checkbalance: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var url = 'http://oyh65u6th.bkt.clouddn.com/'+result.key
          insertImg(url)

          // result 必须是一个 JSON 格式字符串！！！否则报错
          //
        }
      }

      editor.create();
    },
    // 上传图片相关
    handleView (name) {
     //this.imgName = name;
      this.visible = true;
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess (res, file) {
      file.url = 'http://oyh65u6th.bkt.clouddn.com/'+res.key;
      this.imgName = res.key;
      this.signData.imgs.push(res.key);
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      });
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        });
      }
      return check;
    },
    addSecondCategory(){
  	  this.addModal = true;
    },
    cancel(){
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(0, 1);
      this.addModal_HOME=false;
    }
  }
}
</script>
<style scoped>
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
  .pic-modal{
    z-index: 100;
  }
  .add-modal .ivu-modal-mask{
    z-index: 90;
  }
  .input-text{
    text-align: center;
    line-height: 32px;
  }
</style>

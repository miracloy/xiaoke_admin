<template>
  <div class="content-box">

    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

    <Row>
        <Col span="24">
          <h3>修改Banner</h3>
        </Col>
      </Row>


      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">名称</p>
        </Col>
        <Col span="10">
          <Input v-model="formItem.name" style="width: 300px"></Input>
        </Col>
      </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">简介</p>
        </Col>
        <Col span="10">
          <Input v-model="formItem.description" style="width: 300px"></Input>
        </Col>
      </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">显示级别</p>
        </Col>
        <Col span="10">
          <InputNumber v-model="formItem.displayOrder" style="width: 300px"></InputNumber>
        </Col>
      </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">热门类型</p>
        </Col>
        <Col span="10">
          <Select v-model="formItem.recommendId" style="width:200px">
              <Option v-for="item in bannerType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">主图</p>
          </Col>
          <Col span="10">
            <div class="demo-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <!-- <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon> -->
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
                type="drag"
                action="//up.qbox.me"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
            <Modal title="View Image" v-model="visible">
                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
            </Modal>
          </Col>
        </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">选择路径</p>
          </Col>
          <Col span="10">
          <CheckboxGroup v-model="formItem.types">
              <Checkbox label="1"> 消息</Checkbox>
              <Checkbox label="2"> 插屏</Checkbox>
              <Checkbox label="3"> banner页</Checkbox>
          </CheckboxGroup>
          </Col>
      </Row>

      <Row class="margin-10" v-show="formItem.types&&formItem.types.indexOf('2')!=-1">
          <Col span="4">
            <p class="input-text">插屏图</p>
          </Col>
          <Col span="10">
            <div class="demo-upload-list" v-for="item in uploadList1">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <!-- <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon> -->
                        <Icon type="ios-trash-outline" @click.native="handleRemove1(item)"></Icon>
                    </div>
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
            </div>
            <Upload
                ref="upload1"
                :data="headers"
                :show-upload-list="false"
                :default-file-list="defaultList1"
                :on-success="handleSuccess1"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload1"
                type="drag"
                action="//up.qbox.me"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
            <Modal title="View Image" v-model="visible1">
                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible1" style="width: 100%">
            </Modal>
          </Col>
        </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">图文详情</p>
          </Col>
          <Col span="16">
            <div id="editorElem" style="text-align:left" v-show="!addModal && !addGroupModal"></div>
          </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">清单详情</p>
          </Col>
          <Col span="10">
              <table class="table">
                <tr v-for="(v,i) in formItem.skuGroups">
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
                    <Button type="info" size="small" icon="plus-circled" @click="addModal=true">添加单个商品</Button>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="text-align:center;">
                    <Button type="primary" size="small" icon="plus-circled" @click="addGroupModal=true">添加常用商品组</Button>
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
import E from 'wangeditor'
export default{
  data(){
    return {
      formItem:{},
      bannerType:[],
      longMedia:[],
      withMedia:[],
      token:'',
      defaultList: [],
      defaultList1: [],
      imgName: '',
      visible: false,
      visible1: false,
      uploadList: [],
      uploadList1: [],
      token:'',
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
      addGroupModal:false,
      productGroup:{},
      group_index:0,
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
    this.uploadList1 = this.$refs.upload1.fileList;


    var id = this.$route.params.id;
    axios.get(URL+'banner/'+id).then(function(res){
      this.formItem = res.data.data;
      this.formItem.types.forEach((value,index)=>{
        this.formItem.types[index] = this.formItem.types[index].toString();
      });

      if(this.formItem.longUrl){
        this.longMedia.push(this.formItem.longUrl);
        this.uploadList.push({
          url:this.formItem.longUrl,
          status:'finished'
        });
      }
      if(this.formItem.wideUrl){
        this.withMedia.push(this.formItem.wideUrl);
        this.uploadList1.push({
          url:this.formItem.wideUrl,
          status:'finished'
        });
      }

      this._getToken();
    }.bind(this)).catch(function(error){
      console.log(error);
    });

    this._getCategory();
    this._getGroup();
    this._getBennerType();
  },
  methods:{
    _getToken(){
      axios.get(URL+'token').then(function(res){
        this.token = res.data.data;
        this.qiniu();
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 初始化七牛上传的方法
    qiniu(){
      var editor = new E('#editorElem')
      editor.customConfig.onchange = (html) => {
        this.formItem.content = html;
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
      editor.txt.html(this.formItem.content);
    },
    // 上传图片相关
    handleView (name) {
        this.imgName = name;
        this.visible = true;
    },
    handleRemove (file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        this.longMedia = [];
    },
    handleRemove1 (file) {
        const fileList = this.$refs.upload1.fileList;
        this.$refs.upload1.fileList.splice(fileList.indexOf(file), 1);
        this.withMedia = [];
    },
    handleSuccess (res, file) {
        file.url = 'http://oyh65u6th.bkt.clouddn.com/'+res.key;
        this.longMedia.push(res.key);
    },
    handleSuccess1 (res, file) {
        file.url = 'http://oyh65u6th.bkt.clouddn.com/'+res.key;
        this.withMedia.push(res.key);
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
        const check = this.uploadList.length < 1;
        if (!check) {
            this.$Notice.warning({
                title: 'Up to one pictures can be uploaded.'
            });
        }
        return check;
    },
    handleBeforeUpload1 () {
        const check = this.uploadList1.length < 1;
        if (!check) {
            this.$Notice.warning({
                title: 'Up to one pictures can be uploaded.'
            });
        }
        return check;
    },

    save(){
      this.formItem.withMedia = this.withMedia[0] ? this.withMedia[0] : '';
      this.formItem.longMedia = this.longMedia[0] ? this.longMedia[0] : '';


      var params = new URLSearchParams();
      if(this.formItem.withMedia){
        params.append('withMedia', this.formItem.withMedia);
      }
      if(this.formItem.longMedia){
        params.append('longMedia', this.formItem.longMedia);
      }

      params.append('name', this.formItem.name);
      params.append('description', this.formItem.description);
      params.append('content', this.formItem.content);
      params.append('types', this.formItem.types);
      params.append('displayOrder', this.formItem.displayOrder);
      params.append('recommendId', this.formItem.recommendId);

      this.formItem.skuGroups.forEach((value,index)=>{
        params.append('cartForms['+index+'].skuId', value.id);
        params.append('cartForms['+index+'].num', value.quantity);
      });

      var id = this.$route.params.id;
      axios.post(URL+'banner/'+id,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('保存成功');
          this.$router.push('/banner/index/index');
        }

      }.bind(this)).catch(function(error){
        this.$Message.error('保存失败');
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
      // console.log(id);
      // console.log(this.goodsSkuData[sku_index]);
      this.goodsSkuData[sku_index].quantity = 1;
      this.formItem.skuGroups.push(this.goodsSkuData[sku_index]);
      this.goodsAddSkuModel = false;
    },
    plus(v,i){
      v.quantity++;
      Vue.set(this.formItem.skuGroups,i,v);
    },
    minus(v,i){
      v.quantity--;
      Vue.set(this.formItem.skuGroups,i,v);
      if(v.quantity==0){
          this.formItem.skuGroups.splice(i,1);
      }

    },
    numberChange(e){
      // 数量限制待处理
      e.target.value = parseInt(e.target.value);
    },
    getGroup(i){
      this.group_index = i;
    },
    productGroupAdd(){
      this.productGroup[this.group_index].skuGroups.forEach((value,index)=>{
        this.formItem.skuGroups.push(value);
      });
      this.addGroupModal = false;
    },
    // 获取热门类型
    _getBennerType(){
      axios.get(URL+'bannerType/list').then(function(res){
        var data = res.data.data;
        for(var i = 0; i<data.length;i++){
          this.bannerType.push({
            label:data[i].title,
            value:data[i].id
          });
        }

      }.bind(this)).catch(function(error){
        console.log(error);
      });
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

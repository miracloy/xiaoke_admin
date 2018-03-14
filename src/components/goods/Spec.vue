<template>
  <div class="content-box">

    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

    <Row class="margin-10">
      <Col span="2" offset="1">
        <div class="addBox">
          <Button type="info" icon="plus" @click="addModal=true">添加规格</Button>
        </div>
      </Col>
    </Row>

    <Row class="margin-10">
      <Col span="20" offset="1">
           <Collapse accordion>
               <Panel v-for="(v,i) in data1" :key="v.id" :name="v.attributeName">
                    {{v.attributeName}}  &nbsp;&nbsp;&nbsp;<Button type="info" size="small" @click="specAdd(i)" icon="android-add"></Button>&nbsp;&nbsp;&nbsp;<Button type="warning" size="small" icon="edit" @click="update(v)"></Button>&nbsp;&nbsp;&nbsp;<Button type="error" size="small" icon="android-delete" @click="del(v)"></Button>
                    <div slot="content">
                        <Row>
                           <Col span="3" v-for="(v1,i1) in v.allowedValues" :key="i1">
                             <Row>
                               <Col span="10">
                                 <p class="margin-10">{{v1.attributeValue}}</p>
                               </Col>
                               <Col span="14">
                                 <p class="margin-10">
                                   <Button type="warning" size="small" icon="edit" @click="specUpdate(v1)"></Button>
                                   <Button type="error" size="small" icon="android-delete" @click="specDelete(v1)"></Button>
                                 </p>
                               </Col>
                             </Row>
                           </Col>
                        </Row>
                    </div>
                   
               </Panel>
           </Collapse> 
      </Col>
    </Row>
    
   <Spin class="demo-spin-col" v-if="spin">
       <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
       <div>Loading</div>
   </Spin>

    <Modal
        v-model="addModal"
        title="添加规格"
        @on-ok="add"
        @on-cancel="addModal=false">
        规格名称： <Input style="width:200px;" v-model="addName"></Input>
    </Modal>
    
    <Modal
        v-model="updateModal"
        title="修改规格"
        @on-ok="updateDo"
        @on-cancel="updateModal=false">
        规格名称： <Input style="width:200px;" v-model="updateName"></Input>
    </Modal>

    <Modal
        v-model="specModal"
        title="添加规格值"
        @on-ok="specAddDo"
        @on-cancel="specModal=false">
        规格值： <Input style="width:200px;" v-model="specVal"></Input>
    </Modal>

    <Modal
        v-model="specUpdateModal"
        title="修改规格值"
        @on-ok="specUpdateDo"
        @on-cancel="specUpdateModal=false">
        规格值： <Input style="width:200px;" v-model="specUpdateVal"></Input>
    </Modal>

  </div>
</template>
<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
export default {
  data () {
    return {
      addModal:false,
      updateModal:false,
      specModal:false,
      specUpdateModal:false,
      spin:false,
      data1:[],
      addName:'',
      specVal:'',
      specId:'',
      updateName:'',
      updateId:'',
      specUpdateVal:'',
      specUpdateId:'',
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
      axios.get(URL+'productoption').then(function(res){
        var data = res.data;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    add(){
      var params = new URLSearchParams();
      params.append('name', this.addName);
      axios.post(URL+'productoption',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.addName = '';
          this.dataInit();
          this.$Message.success('添加成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));

    },
    specAdd(i){
      this.specModal = true;
      this.specId = this.data1[i].id;
    },
    specAddDo(){
      var params = new URLSearchParams();
      params.append('name', this.specVal);
      axios.post(URL+'productoption/'+this.specId,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.specVal = '';
          this.dataInit();
          this.$Message.success('添加成功');
        }
        
      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));
    },
    update(v){
      this.updateName = v.attributeName;
      this.updateId = v.id;
      this.updateModal = true;
    },
    updateDo(){
      axios.put(URL+'productoption/'+this.updateId+'?name='+this.updateName).then(function(res){
        this.updateName = '';
        this.updateId = '';
        this.dataInit();
        this.$Message.success('修改成功');
      }.bind(this)).catch(function(error){
        this.$Message.error('修改失败');
      }.bind(this));
    },
    specUpdate(v){
      this.specUpdateVal = v.attributeValue;
      this.specUpdateId = v.valueId;
      this.specUpdateModal = true;
    },
    specUpdateDo(){
      axios.put(URL+'productoption/optionvalue/'+this.specUpdateId+'?name='+this.specUpdateVal).then(function(res){
        this.specUpdateVal = '';
        this.specUpdateId = '';
        this.dataInit();
        this.$Message.success('修改成功');
      }.bind(this)).catch(function(error){
        this.$Message.error('修改失败');
      }.bind(this));
    },
    del(v){
      axios.delete(URL+'productoption/'+v.id).then(function(res){
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
    specDelete(v){
      axios.delete(URL+'productoption/optionvalue/'+v.valueId).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.dataInit();
          this.$Message.success('删除成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('删除失败');
      }.bind(this));
    }
  }
}
</script>
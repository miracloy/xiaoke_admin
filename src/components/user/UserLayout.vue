<template>
	<div class="layout-content">
	    <Row>
	        <Col span="3">
	            <Menu active-name="1-1" width="auto" :open-names="['1']">
	                <Submenu name="1">
	                    <template slot="title">
	                        <Icon type="ios-person"></Icon>
	                        用户管理
	                    </template>
	                    <MenuItem name="1-1"><router-link tag="div" to="/user/index/index">用户列表</router-link></MenuItem>
                      <Submenu name="1-4">
                        <template slot="title">公司</template>
                        <MenuItem name="1-4-1"><router-link tag="div" to="/user/index/company">服务客户</router-link></MenuItem>
                        <MenuItem name="1-4-2"><router-link tag="div" to="/user/index/supplyCompany">供应商</router-link></MenuItem>
                      </Submenu>
                      <MenuItem name="1-5"><router-link tag="div" to="/user/index/invoice">发票</router-link></MenuItem>
                    </Submenu>
                </Submenu>
	            </Menu>
	        </Col>
	        <Col span="21">
	           <router-view></router-view>
	        </Col>
	    </Row>
	</div>
</template>

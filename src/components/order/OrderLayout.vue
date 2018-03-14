<template>
	<div class="layout-content">
	    <Row>
	        <Col span="3">
	            <Menu active-name="1-1" width="auto" :open-names="['1']">
	                <Submenu name="1">
	                    <template slot="title">
	                        <Icon type="ios-list"></Icon>
	                        订单管理
	                    </template>
	                    <MenuItem name="1-1"><router-link tag="div" to="/order/index/index">订单列表</router-link></MenuItem>
	                    <MenuItem name="1-2"><router-link tag="div" to="/order/index/stock">采销货物统计</router-link></MenuItem>
	                </Submenu>
	            </Menu>
	        </Col>
	        <Col span="21">
	           <router-view></router-view>
	        </Col>
	    </Row>
	</div>
</template>
<template>
	<div class="layout-content">
	    <Row>
	        <Col span="3">
	            <Menu active-name="1-1" width="auto" :open-names="['1']">
	                <Submenu name="1">
	                    <template slot="title">
	                        <Icon type="ios-paper"></Icon>
	                        清单管理
	                    </template>
	                    <MenuItem name="1-1"><router-link tag="div" to="/bill/index/index">清单列表</router-link></MenuItem>
	                    <MenuItem name="1-2"><router-link tag="div" to="/bill/index/normal">商品组合</router-link></MenuItem>
	                    <MenuItem name="1-3"><router-link tag="div" to="/bill/index/billpush">清单推送</router-link></MenuItem>
	                </Submenu>
	            </Menu>
	        </Col>
	        <Col span="21">
	           <router-view></router-view>
	        </Col>
	    </Row>
	</div>
</template>
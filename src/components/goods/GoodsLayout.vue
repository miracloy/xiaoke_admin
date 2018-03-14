<template>
	<div class="layout-content">
	    <Row>
	        <Col span="3">
	            <Menu active-name="1-1" width="auto" :open-names="['1']">
	                <Submenu name="1">
	                    <template slot="title">
	                        <Icon type="ios-cart"></Icon>
	                        商品管理
	                    </template>
	                    <MenuItem name="1-1"><router-link tag="div" to="/goods/index/index">商品列表</router-link></MenuItem>
	                    <MenuItem name="1-2"><router-link tag="div" to="/goods/index/sign">商品类别</router-link></MenuItem>
	                    <MenuItem name="1-3"><router-link tag="div" to="/goods/index/spec">商品规格</router-link></MenuItem>
	                </Submenu>
	            </Menu>
	        </Col>
	        <Col span="21">
	           <router-view></router-view>
	        </Col>
	    </Row>
	</div>
</template>
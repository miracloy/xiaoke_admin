<template>
	<div class="layout-content">
	    <Row>
	        <Col span="3">
	            <Menu active-name="1-1" width="auto" :open-names="['1']">
	                <Submenu name="1">
	                    <template slot="title">
	                        <Icon type="android-settings"></Icon>
	                        广告消息
	                    </template>
	                    <MenuItem name="1-1"><router-link tag="div" to="/banner/index">广告消息</router-link></MenuItem>
	                </Submenu>
	            </Menu>
	        </Col>
	        <Col span="21">
	           <router-view></router-view>
	        </Col>
	    </Row>
	</div>
</template>
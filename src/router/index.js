import Vue from 'vue'
import VueRouter from 'vue-router'

import iView from 'iview'
import 'iview/dist/styles/iview.css'   // 使用 CSS


import Layout from '@/components/Layout.vue'
import Login from '@/components/Login.vue'

// import GoodsLayout from '@/components/goods/GoodsLayout.vue'
// import Goods from '@/components/goods/Goods.vue'
// import GoodsSign from '@/components/goods/GoodsSign.vue'
// import GoodsAdd from '@/components/goods/GoodsAdd.vue'
// import GoodsUpdate from '@/components/goods/GoodsUpdate.vue'
// import SignGoods from '@/components/goods/SignGoods.vue'
// import Spec from '@/components/goods/Spec.vue'

// import BillLayout from '@/components/bill/BillLayout.vue'
// import Bill from '@/components/bill/Bill.vue'
// import BillNormal from '@/components/bill/BillNormal.vue'
// import BillAdd from '@/components/bill/BillAdd.vue'
// import BillDetail from '@/components/bill/BillDetail.vue'
// import BillUpdate from '@/components/bill/BillUpdate.vue'

// import OrderLayout from '@/components/order/OrderLayout.vue'
// import Order from '@/components/order/Order.vue'
// import Stock from '@/components/order/Stock.vue'

// import FinanceLayout from '@/components/finance/FinanceLayout.vue'
// import Finance from '@/components/finance/Finance.vue'
// import FinanceCompany from '@/components/finance/FinanceCompany.vue'
// import CompanyDetail from '@/components/finance/CompanyDetail.vue'

// import SettingLayout from '@/components/setting/SettingLayout.vue'
// import Setting from '@/components/setting/Setting.vue'

// import Test from '@/components/Test.vue'
// import Welcome from '@/components/Welcome.vue'

// import UserLayout from '@/components/user/UserLayout.vue'
// import User from '@/components/user/User.vue'

const GoodsLayout = (resolve)=>{
  import('@/components/goods/GoodsLayout.vue').then((module)=>{
    resolve(module)
  })
}
const GoodsSign = (resolve)=>{
  import('@/components/goods/GoodsSign.vue').then((module)=>{
    resolve(module)
  })
}
const Goods = (resolve)=>{
  import('@/components/goods/Goods.vue').then((module)=>{
    resolve(module)
  })
}
const GoodsAdd = (resolve)=>{
  import('@/components/goods/GoodsAdd.vue').then((module)=>{
    resolve(module)
  })
}
const GoodsUpdate = (resolve)=>{
  import('@/components/goods/GoodsUpdate.vue').then((module)=>{
    resolve(module)
  })
}
const SignGoods = (resolve)=>{
  import('@/components/goods/SignGoods.vue').then((module)=>{
    resolve(module)
  })
}
const Spec = (resolve)=>{
  import('@/components/goods/Spec.vue').then((module)=>{
    resolve(module)
  })
}
const GoodsUpdateSpec = (resolve)=>{
  import('@/components/goods/GoodsUpdateSpec.vue').then((module)=>{
    resolve(module)
  })
}

const BillLayout = (resolve)=>{
  import('@/components/bill/BillLayout.vue').then((module)=>{
    resolve(module)
  })
}
const Bill = (resolve)=>{
  import('@/components/bill/Bill.vue').then((module)=>{
    resolve(module)
  })
}
const BillAdd = (resolve)=>{
  import('@/components/bill/BillAdd.vue').then((module)=>{
    resolve(module)
  })
}
const BillDetail = (resolve)=>{
  import('@/components/bill/BillDetail.vue').then((module)=>{
    resolve(module)
  })
}
const BillUpdate = (resolve)=>{
  import('@/components/bill/BillUpdate.vue').then((module)=>{
    resolve(module)
  })
}
const BillNormal = (resolve)=>{
  import('@/components/bill/BillNormal.vue').then((module)=>{
    resolve(module)
  })
}
const BillGroupAdd = (resolve)=>{
  import('@/components/bill/BillGroupAdd.vue').then((module)=>{
    resolve(module)
  })
}
const BillGroupUpdate = (resolve)=>{
  import('@/components/bill/BillGroupUpdate.vue').then((module)=>{
    resolve(module)
  })
}
const BillPush = (resolve)=>{
  import('@/components/bill/BillPush.vue').then((module)=>{
    resolve(module)
  })
}
const BillPushAdd = (resolve)=>{
  import('@/components/bill/BillPushAdd.vue').then((module)=>{
    resolve(module)
  })
}

const OrderLayout = (resolve)=>{
  import('@/components/order/OrderLayout.vue').then((module)=>{
    resolve(module)
  })
}
const Order = (resolve)=>{
  import('@/components/order/Order.vue').then((module)=>{
    resolve(module)
  })
}
const Stock = (resolve)=>{
  import('@/components/order/Stock.vue').then((module)=>{
    resolve(module)
  })
}

const FinanceLayout = (resolve)=>{
  import('@/components/finance/FinanceLayout.vue').then((module)=>{
    resolve(module)
  })
}
const Finance = (resolve)=>{
  import('@/components/finance/Finance.vue').then((module)=>{
    resolve(module)
  })
}
const FinanceCompany = (resolve)=>{
  import('@/components/finance/FinanceCompany.vue').then((module)=>{
    resolve(module)
  })
}
const CompanyDetail = (resolve)=>{
  import('@/components/finance/CompanyDetail.vue').then((module)=>{
    resolve(module)
  })
}

// const SettingLayout = (resolve)=>{
//   import('@/components/setting/SettingLayout.vue').then((module)=>{
//     resolve(module)
//   })
// }
// const Setting = (resolve)=>{
//   import('@/components/setting/Setting.vue').then((module)=>{
//     resolve(module)
//   })
// }

const Test = (resolve)=>{
  import('@/components/Test.vue').then((module)=>{
    resolve(module)
  })
}
const Welcome = (resolve)=>{
  import('@/components/Welcome.vue').then((module)=>{
    resolve(module)
  })
}

const UserLayout = (resolve)=>{
  import('@/components/user/UserLayout.vue').then((module)=>{
    resolve(module)
  })
}
const User = (resolve)=>{
  import('@/components/user/User.vue').then((module)=>{
    resolve(module)
  })
}

const BannerLayout = (resolve)=>{
  import('@/components/banner/BannerLayout.vue').then((module)=>{
    resolve(module)
  })
}
const Banner = (resolve)=>{
  import('@/components/banner/Banner.vue').then((module)=>{
    resolve(module)
  })
}
const BannerAdd = (resolve)=>{
  import('@/components/banner/BannerAdd.vue').then((module)=>{
    resolve(module)
  })
}
const BannerUpdate = (resolve)=>{
  import('@/components/banner/BannerUpdate.vue').then((module)=>{
    resolve(module)
  })
}

Vue.use(VueRouter);
Vue.use(iView);

const Router  = new VueRouter({
  routes: [
    {path:'/',redirect:'/index/welcome'},
    {path:'/login',component:Login},
    {
      path: '/index/welcome',
      redirect: '/index/welcome/index',
      component:Layout,
      children:[
        {
          path:'index',
          component:Welcome,
        }
      ]
    },
    {
      path: '/goods',
      redirect: '/goods/index',
      component:Layout,
      children:[
        {
          path:'index',
          meta:{
            breadcrumb:'商品管理'
          },
          redirect: '/goods/index/index',
          component:GoodsLayout,
          children:[
            {
              path:'index',
              meta:{
                breadcrumb:'商品列表'
              },
              component:Goods
            },
            {
              path:'sign',
              meta:{
                breadcrumb:'商品标签'
              },
              component:GoodsSign
            },
            {
              path:'add',
              meta:{
                breadcrumb:'添加商品'
              },
              component:GoodsAdd
            },
            {
              path:'update/:id',
              meta:{
                breadcrumb:'更新商品'
              },
              component:GoodsUpdate
            },
            {
              path:'updateSpec/:id',
              meta:{
                breadcrumb:'规格'
              },
              component:GoodsUpdateSpec
            },
            {
              path:'sign_goods',
              meta:{
                breadcrumb:'商品类别'
              },
              component:SignGoods
            },  
            {
              path:'spec',
              meta:{
                breadcrumb:'商品规格'
              },
              component:Spec
            }           
          ] 
        }
      ]
    },
    {
      path: '/user',
      redirect: '/user/index',
      component:Layout,
      children:[
        {
          path:'index',
          meta:{
            breadcrumb:'用户管理'
          },
          redirect: '/user/index/index',
          component:UserLayout,
          children:[
            {
              path:'index',
              meta:{
                breadcrumb:'用户列表'
              },
              component:User
            },            
          ] 
        }
      ]
    },
    {
      path: '/bill',
      redirect: '/bill/index',
      component:Layout,
      children:[
        {
          path:'index',
          meta:{
            breadcrumb:'清单管理'
          },
          redirect: '/bill/index/index',
          component:BillLayout,
          children:[
            {
              path:'index',
              meta:{
                breadcrumb:'清单列表'
              },
              component:Bill
            },
            {
              path:'normal',
              meta:{
                breadcrumb:'商品组合'
              },
              component:BillNormal
            }, 
            {
              path:'groupAdd',
              meta:{
                breadcrumb:'添加商品组合'
              },
              component:BillGroupAdd
            }, 
            {
              path:'groupUpdate/:id',
              meta:{
                breadcrumb:'修改商品组合'
              },
              component:BillGroupUpdate
            }, 
            {
              path:'add',
              meta:{
                breadcrumb:'新增清单'
              },
              component:BillAdd
            },    
            {
              path:'detail/:id',
              meta:{
                breadcrumb:'清单详情'
              },
              component:BillDetail
            },   
            {
              path:'update/:id',
              meta:{
                breadcrumb:'清单修改'
              },
              component:BillUpdate
            },  
            {
              path:'billpush',
              meta:{
                breadcrumb:'清单推送'
              },
              component:BillPush
            },
            {
              path:'billpushadd',
              meta:{
                breadcrumb:'新建清单推送'
              },
              component:BillPushAdd
            },     
          ] 
        }
      ]
    },
    {
      path: '/order',
      redirect: '/order/index',
      component:Layout,
      children:[
        {
          path:'index',
          meta:{
            breadcrumb:'订单管理'
          },
          redirect: '/order/index/index',
          component:OrderLayout,
          children:[
            {
              path:'index',
              meta:{
                breadcrumb:'订单列表'
              },
              component:Order
            }, 
            {
              path:'stock',
              meta:{
                breadcrumb:'采销货物统计'
              },
              component:Stock
            },          
          ] 
        }
      ]
    },
    {
      path: '/finance',
      redirect: '/finance/index',
      component:Layout,
      children:[
        {
          path:'index',
          meta:{
            breadcrumb:'财务'
          },
          redirect: '/finance/index/index',
          component:FinanceLayout,
          children:[
            {
              path:'index',
              meta:{
                breadcrumb:'资金明细'
              },
              component:Finance
            },
            {
              path:'company',
              meta:{
                breadcrumb:'未结账期明细'
              },
              component:FinanceCompany
            }, 
            {
              path:'company_detail',
              meta:{
                breadcrumb:'公司账款明细详情'
              },
              component:CompanyDetail
            },         
          ] 
        }
      ]
    },
    {
      path: '/banner',
      redirect: '/banner/index',
      component:Layout,
      children:[
        {
          path:'index',
          meta:{
            breadcrumb:'广告消息'
          },
          redirect: '/banner/index/index',
          component:BannerLayout,
          children:[
            {
              path:'index',
              meta:{
                breadcrumb:'广告消息'
              },
              component:Banner
            },   
            {
              path:'add',
              meta:{
                breadcrumb:'添加广告消息'
              },
              component:BannerAdd
            },   
            {
              path:'update/:id',
              meta:{
                breadcrumb:'修改广告消息'
              },
              component:BannerUpdate
            },      
          ] 
        }
      ]
    },
    // {
    //   path: '/setting',
    //   redirect: '/setting/index',
    //   component:Layout,
    //   children:[
    //     {
    //       path:'index',
    //       meta:{
    //         breadcrumb:'设置'
    //       },
    //       redirect: '/setting/index/index',
    //       component:SettingLayout,
    //       children:[
    //         {
    //           path:'index',
    //           meta:{
    //             breadcrumb:'系统设置'
    //           },
    //           component:Setting
    //         },          
    //       ] 
    //     }
    //   ]
    // },
    {
      path: '/test',
      component:Test,
    },
  ]
});

Router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('token');
    next();
  } else {
    let token = window.sessionStorage.getItem('token');
    if (!token) {
      next({path: '/login'})
    } else {
      next()
    }
    next();
  }
});

export default Router;

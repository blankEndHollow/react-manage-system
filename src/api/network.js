import axios from 'axios'
import { message } from 'antd'
//引入jsonp函数
import jsonp from 'jsonp'

export let baseURL = 'http://120.55.193.14:5000'
// export let baseURL = 'http://127.0.0.1:5000'
//包装请求函数
function net (config) {
  const work = axios.create({
    timeout:30000,
    baseURL
    
  })

  return new Promise( resolve => {
    try{
      work(config)
      .then( ({data}) => resolve(data) )
    }catch(err){
      message.error(err)
      resolve(err)
    }
  })
}



//用户登录
export const login = data =>{
  return net({
    method:'post',
    url:'/login',
    data
  })
}

//添加用户
export const raiseUser = data =>{
  return net({
    method:'post',
    url:'/manage/user/add',
    data
  })
}
//获取天气接口
export const weather = city => new Promise( (resolve , reject) => {
  jsonp('https://tianqiapi.com/api?version=v6&appid=98289993&appsecret=I297gQ12',{}, (err,data)=>{
    err ? resolve(null) : resolve(data)
  })
})

//获取分类
export const categoryPop = params => net({
  method:'get',
  url:'/manage/category/list',
  params
})  

//添加分类
export const categoryAdd = data => net({
  method:'post',
  url:'/manage/category/add',
  data
})

//更新分类
export const categoryUpdate = data => net({
  method:'post',
  url:'/manage/category/update',
  data
})

//获取商品
export const productPop = params => net({
  method : 'get',
  url: '/manage/product/list',
  params
})

//商品搜索分页列表
export const searchProducts = params => net({
  method:'get' , 
  url: '/manage/product/search',
  params
})

//查询分类名称
export const getCategoryName = params => net({ 
  method:'get' , 
  url : '/manage/category/info' , 
  params
})

//更新商品状态
export const setStatus = data => net({
  url: '/manage/product/updateStatus',
  method:'post',
  data
})

//删除图片
export const delPic = name => net({
  method:'post' , 
  url: '/manage/img/delete' ,
  data:{ name }
})

//添加商品
export const ProductOpreat = data => net({
  method: 'post' ,
  url: `/manage/product/${data._id ? 'update': 'add'}` ,
  data
})

//获取角色列表
export const rolePop = () => net({
  method:'get' ,
  url: '/manage/role/list'
})

//添加角色
export const sendRole = roleName => net({
  method:'post' ,
  url:'/manage/role/add' ,
  data:{ roleName }
})

//修改角色权限
export const sendAuth = data => net({
  method: 'post' ,
  url: '/manage/role/update' , 
  data
})

//获取所有用户
export const userPop = () => net({
  method: 'get' ,
  url: "/manage/user/list"
})

//删除用户
export const userDel = userId => net({ 
  method:'post' , 
  url:'/manage/user/delete' ,
  data:{ userId }
 })

 //添加或修改用户
 export const userPush = data => net({
   method: 'post' ,
   url:`/manage/user/${ data._id ? 'update' : 'add' }` ,
   data
 })
 
export default net
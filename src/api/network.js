import axios from 'axios'
import { message } from 'antd'
//引入jsonp函数
import jsonp from 'jsonp'

export let baseURL = 'http://120.55.193.14:5000'
// export let baseURL = 'http://127.0.0.1:5000'

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

export default net
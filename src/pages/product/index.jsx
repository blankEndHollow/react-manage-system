import { Component , lazy , Suspense } from 'react'
//路由组件
import { Switch , Route , Redirect } from 'react-router-dom'
//等待显示
import Loading from '../loading'
/*商品分类*/
export default class Category extends Component {
  render(){
    return (
      <Suspense fallback={<Loading/>} >
      <Switch>
        {/* 显示商品列表 */}
        <Route path='/product' exact  component={ lazy( () => import('./children/product-home') ) } />
        {/* 商品详情 */}
        <Route path='/product/detail' component={ lazy( () => import('./children/product-detail') ) } />
        {/* 添加和修改 */}
        <Route path='/product/update' component={ lazy( () => import('./children/product-update') ) } />
        {/* 主页为主 */}
        <Redirect to='/product'/>
      </Switch>
      </Suspense>
    )
  }
}
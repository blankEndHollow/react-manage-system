import { Component , lazy, Suspense  } from 'react'

//引入路由模块
import { BrowserRouter , Route  , Switch, Redirect , } from 'react-router-dom'

//引入等待模块
import Loading from './pages/loading'


export default class App extends Component {

  render () {
    return ( 
        <BrowserRouter>

          <Suspense fallback={ <Loading />}>
            <Switch>
             
              {/* 登录模块 */}
              <Route path='/login'  component={lazy( () => import('./pages/login'))} />
              {/* 注册模块 */}
              <Route path='/register' component={ lazy( () => import('./pages/register'))} />
               {/* 管理模块 */}
               <Route path='/'  component={ lazy( () => import('./pages/admin'))  } />
            </Switch>
          </Suspense>
        </BrowserRouter>
    )
  }
}
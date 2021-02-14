import { render  } from 'react-dom'

//主框架
import App from './App'
//内存数据
import free from './utils/memoryFree'
//存储器
import memory from './utils/memory'

//从本地存储内取出数据存放到内存
try{
  free.user = JSON.parse(memory.getUser())
}
catch(err){}

render(<App/>, document.querySelector('#root'))
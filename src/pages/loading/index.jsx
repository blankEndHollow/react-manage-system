import { Component } from 'react'
import { Spin  } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{fontSize:76}} spin />

export default class Loading extends Component {
  render () {
    return (
      <div style={{
        height:'100%',
        width:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
        }}>
        <Spin size='large'  indicator={antIcon} />
      </div>
    )
  }
}
const { override , fixBabelImports , addLessLoader } = require('customize-cra')

module.exports = override(
  fixBabelImports('import',{
    libraryName: 'antd',
    libraryDirectory:'es',
    // style:'css'
    style:true
  }),
  //配置主题颜色
  addLessLoader({
    javascriptEnabled: true,
    modifyVars:{
      '@primary-color':'#61649f'
    }
  })
)




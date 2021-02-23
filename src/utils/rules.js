//空值验证
export const empty = { required: true , message: 'It cannot be empty' } 
//最小值验证
export const min = { validator(rolu ,val){
  if(Number(val) > 0)
  {
    return Promise.resolve()
  }else{
    return Promise.reject('Cannot be less than zero')
  }
      
} }
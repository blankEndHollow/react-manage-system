import free from './memoryFree'
const store = window.localStorage
,KEY_LOCA = 'ANTO_DENGYAN'
export default {
  saveUser(user){
    store.setItem(KEY_LOCA,user)
    try{
      free.user = JSON.parse(user)
    }
    catch(err){}
  },
  getUser(){
    return store.getItem(KEY_LOCA)
  }
  ,
  removeUser(){
    store.removeItem(KEY_LOCA)
  }
}
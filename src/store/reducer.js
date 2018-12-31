// state
const baseState = {
    token:'',
    userInfo:{
        avatar_url:'',
        id:'',
        loginname:''
    } 
}
export default (state=baseState,action) => {
    if(action.type==='SET_TOKEN'){
        return Object.assign({},state,{token:action.value})
    }
    if(action.type==='SET_USERINFO'){
        return Object.assign({},state,{userInfo:action.value})
    }
    if(action.type==='LOGOUT'){
        return Object.assign({},baseState)
    }
    return state
}
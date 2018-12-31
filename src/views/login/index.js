import './login.css'
import React, { Component } from 'react'
import axios from 'axios'
import qs from 'qs'
import store from '../../store'
export default class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
            inputToken:'',
            ...store.getState()
        }
        this.subscribeStore=this.subscribeStore.bind(this)
        this.handleChange=this.handleChange.bind(this)
        this.submit=this.submit.bind(this)
        this.toUserInfo=this.toUserInfo.bind(this)
        this.addTopic=this.addTopic.bind(this)
        this.hideLogin=this.hideLogin.bind(this)
        this.logout=this.logout.bind(this)
        store.subscribe(this.subscribeStore)  
    }
    subscribeStore(){
        this.setState(store.getState()) 
    }
    handleChange(e){  
        const value = e.target.value
        this.setState(()=>{
           return{
                inputToken:value
           }
        })
    }
    submit(){
        if(this.state.inputToken===''){
            alert("请输入token值")
          }else{
            axios.post('https://cnodejs.org/api/v1/accesstoken', qs.stringify({
              accesstoken:this.state.inputToken
            }))
            .then((res)=>{
              if(res.data.success){
                  let data=res.data
                  delete data.success
                  store.dispatch({
                      type:'SET_TOKEN',
                      value:this.state.inputToken
                  })
                  store.dispatch({
                      type:'SET_USERINFO',
                      value:data
                  })
                  this.hideLogin() 
              }else{
                alert(res.data.error_msg)
              }
            })
            .catch((err)=>{
              if(err.response.status===401){
                this.setState(()=>{
                    return {
                        inputToken:''
                    }
                })
                alert(err.response.data.error_msg)
              }else{
                alert('登录失败')
              }
            })
          }
    }
    logout(){
        store.dispatch({
            type:'LOGOUT'
        })
        this.hideLogin()
    }
    hideLogin(){
        const { toggleLogin } = this.props
        toggleLogin()
    }
    toUserInfo(e,name){
        e.stopPropagation() 
        this.props.history.push(`/user/${name}`)
    }
    addTopic(){
        this.props.history.push('/new')
    }
    render(){
        return (
            <div className='login' onClick={this.hideLogin}>
                <div className='login-part' onClick={(e)=>{e.stopPropagation()}}>
                {
                    this.state.token&&this.state.userInfo.avatar_url?
                    (
                        <div>
                            <div className="loginName" onClick={(e)=>{this.toUserInfo(e,this.state.userInfo.loginname)}}>{this.state.userInfo.loginname}</div>
                            <div>
                                <img src={this.state.userInfo.avatar_url} style={{width:'100px'}} />
                            </div>
                            <div className="handle-part">
                                <button onClick={this.addTopic}>发布话题</button>
                            </div>
                            <div className="handle-part">
                                <button className="logout-btn" onClick={this.logout}>登出</button>
                            </div>
                        </div>           
                    ):(
                        <div>
                            <div>
                                <input placeholder="请输入token" value={this.state.inputToken} onChange={this.handleChange}></input>
                                <div className="handle-part">
                                    <button onClick={this.submit}>确认</button>
                                </div>
                            </div>
                        </div>
                    )
                }
                </div>
            </div>
        )
    }
}
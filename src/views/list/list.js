import './list.css'
import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import noUser from '../../assets/noUser.png'
import Login from '../login'
import store from '../../store'
export default class list  extends Component {
  constructor(props){
    super(props)
    this.state={
      tab:'all',
      page:1,
      list:[],
      loadingStatus:true,
      tabStatus:false,
      showLogin:false,
      ...store.getState()
    }
    this.loadMoreData=this.loadMoreData.bind(this)
    this.changeTab=this.changeTab.bind(this)
    this.tabType=this.tabType.bind(this)
    this.toUserInfo=this.toUserInfo.bind(this)
    this.showTab=this.showTab.bind(this)
    this.toggleLogin=this.toggleLogin.bind(this)
    this.subscribeStore=this.subscribeStore.bind(this)
    store.subscribe(this.subscribeStore)
  }
  subscribeStore(){
    this.setState(store.getState()) 
  }
  componentWillMount(){
    axios.get(`https://cnodejs.org/api/v1/topics?page=${this.state.page}&tab=${this.state.tab}`)
    .then((res)=>{
      this.setState({
        list:res.data.data,
        loadingStatus:false
      })
      window.scroll(0,0)
    })
    .catch((err)=>{
      this.setState({
        loadingStatus:false
      })
      alert(err)
    })
  }
  componentDidMount(){
    window.addEventListener('scroll', this.loadMoreData)
  }
  componentWillUnmount(){
    window.removeEventListener('scroll', this.loadMoreData)
  }
  loadMoreData(){
    let top=document.body.scrollTop||document.documentElement.scrollTop
    let wHeight=window.innerHeight
    let bHeight=document.body.clientHeight||document.documentElement.clientHeight
    if(top+wHeight>=bHeight){
        this.setState((state)=>({
          loadingStatus:true,
          page:++state.page
        }),()=>{
          axios.get(`https://cnodejs.org/api/v1/topics/?tab=${this.state.tab}&page=${this.state.page}`)
          .then((res)=>{
              this.setState((state)=>({               
                list:state.list.concat(res.data.data),
                loadingStatus:false,
              }))          
          })
          .catch((err)=>{
              this.setState({
                loadingStatus:false
              })
              alert(err)
          })
        })
    }
  }
  changeTab(e,val){
    e.preventDefault()
    this.setState({
      tab:val,
      loadingStatus:true,
      tabStatus:false
    },()=>{
      axios.get(`https://cnodejs.org/api/v1/topics?page=${this.state.page}&tab=${this.state.tab}`)
      .then((res)=>{
        this.setState({
          list:res.data.data,
          loadingStatus:false
        })
        window.scroll(0,0)
      })
      .catch((err)=>{
        this.setState({
          loadingStatus:false
        })
        alert(err)
      })
    })
  }
  toUserInfo(e,name){
    e.stopPropagation() 
    this.props.history.push(`/user/${name}`)
  }
  tabType(val){
    switch(val){
        case "share":return "分享";
        case "ask":return "问答";
        case "job":return "招聘";
        case "dev":return "客户端测试";
        default:return ""
    }
  }
  showTab(){
    this.setState({
      tabStatus:!this.state.tabStatus,
    })
  }
  toggleLogin(){
    this.setState((prevState)=>{
      return {
        showLogin:!prevState.showLogin
      }
    })
  }
  render(){
    return(
      <div className={this.state.loadingStatus?'list loading':'list'}>
        <div className='nav'>
          <div className='container'>
            <div className='toggle' onClick={this.showTab}>
              <i></i>
              <i className='middle'></i>
              <i></i>
            </div>
            <ul className={this.state.tabStatus?'nav-ul show':'nav-ul'}>
              <li><a href="/" onClick={(e)=>{this.changeTab(e,'all')}} className={this.state.tab==='all'?'active':''}>全部</a></li>
              <li><a href="/" onClick={(e)=>{this.changeTab(e,'good')}} className={this.state.tab==='good'?'active':''}>精华</a></li>
              <li><a href="/" onClick={(e)=>{this.changeTab(e,'share')}} className={this.state.tab==='share'?'active':''}>分享</a></li>
              <li><a href="/" onClick={(e)=>{this.changeTab(e,'ask')}} className={this.state.tab==='ask'?'active':''}>问答</a></li>
              <li><a href="/" onClick={(e)=>{this.changeTab(e,'job')}} className={this.state.tab==='job'?'active':''}>招聘</a></li>    
              <li><a href="/" onClick={(e)=>{this.changeTab(e,'dev')}} className={this.state.tab==='dev'?'active':''}>客户端测试</a></li>       
            </ul>
          </div>
          <div className="user" onClick = {this.toggleLogin}>
              <img src={this.state.userInfo.avatar_url||noUser} title={this.state.userInfo.loginname||'请登录'}/>
            </div>
            {
              this.state.showLogin?(
              <Login toggleLogin={this.toggleLogin} history={this.props.history}/>
              ):null
            }
        </div>
        <div className='container'>
        <ul className='article-list'>        
          {
            this.state.list.map((item,index)=>{
              return(
                <li key={index}>
                  <div className='user_icon'>
                    <img src={item.author.avatar_url} alt={item.author.loginname} onClick={(e)=>{this.toUserInfo(e,item.author.loginname)}} />
                    <div className='name'>{item.author.loginname}</div>
                  </div>
                  <div className='info'>
                    <div className='marked'>
                        {
                          item.top?<span><span className='top'>置顶</span>·</span>:null
                        }
                        {
                          item.good?<span><span className='good'>精华</span>·</span>:null
                        }
                        <span className='tab'>{this.tabType(item.tab)}</span>
                      </div>
                      <Link className='title' to={'/detail/'+item.id}>{item.title}</Link>
                      <div className='visit'>回复数:{item.reply_count} / 点击数:{item.visit_count}</div>
                  </div>
                </li>
              )
            })
          }
        </ul>
        </div>
      </div>
    )
  }
}
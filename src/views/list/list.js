import './list.scss'
import React,{Component} from 'react'
import axios from 'axios'
export default class list  extends Component {
  constructor(props){
    super(props)
    this.state={
      tab:'all',
      page:1,
      list:[],
      loadingStatus:false
    }
    this.changeTab=this.changeTab.bind(this)
    this.tabType=this.tabType.bind(this)
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
  changeTab(val){
    this.setState({
      tab:val
    })
    axios.get(`https://cnodejs.org/api/v1/topics?page=${this.state.page}&tab=${val}`)
    .then((res)=>{
      this.setStae({
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
  tabType(val){
    switch(val){
        case "share":return "分享";
        case "ask":return "问答";
        case "job":return "招聘";
        case "dev":return "客户端测试"
        default:return ""
    }
  }
  render(){
    return(
      <div className='list'>
        <div className='nav'>
          <div className='container'>
            <ul className='nav-ul'>
              <li><a href="#" onClick={(e)=>{this.changeTab('all')}} className={this.state.tab==='all'?'active':''}>全部</a></li>
              <li><a href="#" onClick={(e)=>{this.changeTab('good')}} className={this.state.tab==='good'?'active':''}>精华</a></li>
              <li><a href="#" onClick={(e)=>{this.changeTab('share')}} className={this.state.tab==='share'?'active':''}>分享</a></li>
              <li><a href="#" onClick={(e)=>{this.changeTab('ask')}} className={this.state.tab==='ask'?'active':''}>问答</a></li>
              <li><a href="#" onClick={(e)=>{this.changeTab('job')}} className={this.state.tab==='job'?'active':''}>招聘</a></li>    
              <li><a href="#" onClick={(e)=>{this.changeTab('dev')}} className={this.state.tab==='dev'?'active':''}>客户端测试</a></li>       
            </ul>
          </div>
        </div>
        <ul className='article-list container'>
          {
            this.state.list.map((item,index)=>{
              return(
                <li className='clearfix' key={index}>
                  <div className='user_icon'>
                    <img src={item.author.avatar_url} />
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
                        <span className='tab'>{(e)=>{this.tabType(item.tab)}}</span>
                      </div>
                      <a className='title' href={'/detail/'+item.id}>{item.title}</a>
                      <div className='visit'>回复数:{item.reply_count} / 点击数:{item.visit_count}</div>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
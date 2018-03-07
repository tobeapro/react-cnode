import './user.css'
import React,{Component} from 'react'
import {Link,withRouter} from 'react-router-dom'
import axios from 'axios'
import back from '../../assets/back.png'
class user extends Component {
  constructor(props){
    super(props)
    this.state={
      data:{
        recent_topics:[],
        recent_replies:[]
      },
      loadingStatus:true
    }
    this.toHome=this.toHome.bind(this)
    this.createTime=this.createTime.bind(this)
    // this.loadUserInfo=this.loadUserInfo.bind(this)
  }
  componentDidMount(){
    this.loadUserInfo()
  }
  loadUserInfo=(e,name)=>{
    name=name||this.props.match.params.loginname
    axios.get('https://cnodejs.org/api/v1/user/'+name)
    .then((res)=>{
      this.setState({
        data:res.data.data,
        loadingStatus:false
      })
    })
    .catch((err)=>{    
      this.setState({
        loadingStatus:false
      })
      if(err.response.status===404){
        alert(err.response.data.error_msg)
        this.props.history.push('/')
        return
      }
      alert('服务出错')
    })
  }
  toHome(){
    this.props.history.push("/")
  }
  createTime(time){
    let now=new Date()
      time=new Date(time)
      if(now.getFullYear()-time.getFullYear()>0){
        return now.getFullYear()-time.getFullYear()+"年"
      }else if(now.getMonth()-time.getMonth()>0){
        return now.getMonth()-time.getMonth()+"月"
      }else if(now.getDate() - time.getDate()>0){
        return now.getDate() - time.getDate()+"日"
      }else if(now.getHours()-time.getHours()>0){
        return now.getHours()-time.getHours()+"小时"
      }else if(now.getMinutes() - time.getMinutes()>0){
        return now.getMinutes() - time.getMinutes()+"分钟"
      }else{
        return now.getSeconds()-time.getSeconds()+"秒"
      }
  }
  render(){
    return(
      <div className={this.state.loadingStatus?'user loading':'user'}>
        <div className='back'>
          <div className='toHome' onClick={this.toHome}>
            <img src={back} alt='back' />
          </div>
        </div>
        <div className='container'>
            <h4>个人信息</h4>
            <div className='info'>
                <div className='avatar'>
                  <img src={this.state.data.avatar_url} alt={this.state.data.loginname} />
                </div>
                <p className='name'>{this.state.data.loginname}</p>
                <p className='score'>积分:{this.state.data.score}</p>
                <p className='github'>
                  <a href={'https://github.com/'+this.state.data.githubUsername} target="_blank">@仓库地址</a>
                </p>
                <p className='createTime'>注册时间{this.createTime(this.state.data.create_at)}前</p>
            </div>
            <h4>创建的话题</h4>
            <div className='createTopic'>
                <ul className='topic-list'>
                  {
                    this.state.data.recent_topics.map((item,index)=>{
                      return(
                        <li key={index}>
                          <img src={item.author.avatar_url} alt={item.author.loginname} />
                          <Link className='title' to={'/detail/'+item.id}>{item.title}</Link>
                        </li>
                      )
                    })
                  }
                </ul>
            </div>
            <h4>最近参与的话题</h4>
            <div className='joinTopic'>
                <ul className='topic-list'>
                  {
                    this.state.data.recent_replies.map((item,index)=>{
                      return(
                        <li key={index}>
                          <img src={item.author.avatar_url} alt={item.author.loginname} onClick={(e)=>{this.loadUserInfo(e,item.author.loginname)}} />
                          <Link className='title' to={'/detail/'+item.id}>{item.title}</Link>
                        </li>
                      )
                    })
                  }
                </ul>
            </div>
        </div>
      </div>
    )
  }
}
export default withRouter(user)
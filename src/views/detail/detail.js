import './detail.css'
import React,{Component} from 'react'
import axios from 'axios'
import qs from 'qs'
import noUser from '../../assets/noUser.png'
import back from '../../assets/back.png'
export default class detail extends Component {
  constructor(props){
    super(props)
    this.state={
      detail:{
        author:{
          loginname:''
        },
        replies:[]
      },
      showStatus:false,
      loadingStatus:true,
      replyText:'',
      replyId:'',
      commentText:'',
      noUser,
      back,
      replyIndex:0
      }
    this.toHome=this.toHome.bind(this)
    this.countTime=this.countTime.bind(this)
    this.tabType=this.tabType.bind(this)
    this.toUserInfo=this.toUserInfo.bind(this)
    this.reply=this.reply.bind(this)
    this.confirmReply=this.confirmReply.bind(this)
    this.changeReplyText=this.changeReplyText.bind(this)
  }
  componentWillMount(){
    axios.get('https://cnodejs.org/api/v1/topic/'+this.props.match.params.id)
        .then((res)=>{
            this.setState({
              detail:res.data.data,
              loadingStatus:false
            })          
        })
        .catch((err)=>{
            this.setState({
              loadingStatus:false
            })
            if(err.response.status===400){
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
  countTime(time){
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
  tabType(val){
    switch(val){
        case "share":return "分享";
        case "ask":return "问答";
        case "job":return "招聘";
        case "dev":return "客户端测试"
        default:return ""
    }
  } 
  toUserInfo(e,name){
    e.stopPropagation()
    this.props.history.push("/user/"+name)
  }
  reply(e,item){
    e.stopPropagation()
    this.setState({
      replyId:item.id,
      replyText:`@${item.author.loginname} `
    })
  }
  changeReplyText(e){
    this.setState({
      replyText:e.target.value
    })
  }
  confirmReply(e){
    e.stopPropagation()
    if(this.token===''){
        alert('请先登录')
        return
    }else{
        axios.post(`https://cnodejs.org/api/v1/topic/${this.props.match.params.id}/replies`,qs.stringify({
            accesstoken:this.state.token,
            content:this.state.replyText,
            reply_id:this.state.replyId
        }))
        .then((res)=>{
            if(res.data.success){
                axios.get('https://cnodejs.org/api/v1/topic/'+this.props.match.params.id)
                .then((res)=>{
                    window.scrollTo(0,document.body.scrollHeight)
                    this.setState({
                      replyText:'',
                      detail:res.data.data
                    })
                })
                .catch((err)=>{
                    alert(err)
                })
            }else{
                alert(res)
            }                   
        })
        .catch((err)=>{
            if(err.response.status===400){
                alert(err.response.data.error_msg)
                return
            }
            alert(err)
        })
    }
  }
  render(){
    return(
      <div className={this.state.loadingStatus?'detail loading':'detail'}>
        <div className='back'>
          <div className='toHome' onClick={this.toHome}>
            <img src={back} alt='back' />
          </div>
        </div>
        <div className='container'>
          <div className='header'>
            <div className='title'>{this.state.detail.title}</div>
            <div className='info'>
              {
                this.state.detail.top?
                <span className='top'>置顶</span>:''
              }
              <span>作者:{this.state.detail.author.loginname} · </span>
              <span>发布于:{this.countTime(this.state.detail.create_at)}前 · </span>
              <span>最后编辑:{this.countTime(this.state.detail.last_reply_at)}前 ·</span>
              <span>来自:{this.tabType(this.state.detail.tab)}</span>
            </div>
          </div>
          <div className='content' dangerouslySetInnerHTML={{__html:this.state.detail.content}}>
          </div>
          <div className='reply'>
              <h4>共有评论{this.state.detail.reply_count}条</h4>
              <ul className='reply-list'>
                {
                  this.state.detail.replies.map((item,index)=>{
                    return(
                     <li key={index}>
                        <div className='author'>
                          <img src={item.author.avatar_url} alt={item.author.avatar_url} className='avatar' onClick={(e)=>{this.toUserInfo(e,item.author.loginname)}} />
                          <span className='name'>{item.author.loginname}</span>
                          <span className='time'>{index+1}楼·{this.countTime(item.create_at)}前</span>
                        </div>
                        <div className='reply-content' dangerouslySetInnerHTML={{__html:item.content}}></div>
                        <div className='reply-btn' onClick={(e)=>{this.reply(e,item)}}>回复</div>
                     </li> 
                    )
                  })
                }
              </ul>
          </div>
        </div>
        <div className='footer'>
           <div className='input'><input onChange={this.changeReplyText} value={this.state.replyText}/></div>
           <div className='confirm'>
                <button onClick={this.confirmReply}>确认</button>
           </div>
        </div>
      </div>
    )
  }
}
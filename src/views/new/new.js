import './new.css'
import React,{Component} from 'react'
import axios from 'axios'
import qs from 'qs'
import back from '../../assets/back.png'
import store from '../../store'
export default class newTopic extends Component {
  constructor(props){
    super(props)
    this.state={
      title:'',
      tab:'dev',
      content:'',
      ...store.getState()
    }
    this.toHome=this.toHome.bind(this)
    this.handleChangeTitle=this.handleChangeTitle.bind(this)
    this.handleChangeTab=this.handleChangeTab.bind(this)
    this.handleChangeContent=this.handleChangeContent.bind(this)
    this.submit=this.submit.bind(this)
    this.clear=this.clear.bind(this)
  }
  toHome(){
    this.props.history.push("/")
  }
  handleChangeTitle(e){
    this.setState({
      title:e.target.value
    })
  }
  handleChangeTab(e){
    this.setState({
      tab:e.target.value
    })
  }
  handleChangeContent(e){
    this.setState({
      content:e.target.value
    })
  }
  submit(){
    axios.post('https://cnodejs.org/api/v1/topics', qs.stringify({
        accesstoken:this.state.token,
        title:this.state.title,
        tab:this.state.tab,
        content:this.state.content
    }))
    .then((res)=>{
        if(res.data.success){
            this.props.history.push('/detail/'+res.data.topic_id)
        }else{
            alert(res.data.error_msg)
        }
    })
    .catch((err)=>{
        if(!err.response.data.success){
            alert(err.response.data.error_msg)
            return
        }
        alert("服务器异常")
    })
  }
  clear(){
      this.setState({
        content:''
      })
  }
  componentWillMount(){
    if(!this.state.token){
      alert('请先登录')
      this.props.history.push('/')
    }
  }
  render(){
    return(
      <div className='new'>
        <div className='back'>
          <div className='toHome' onClick={this.toHome}>
            <img src={back} alt='back' />
          </div>
        </div>
        <div className='container'>
          <div className="article">
            <div className='title'>
              <span>标题</span>
              <input placeholder='标题字数10字以上' value={this.state.title} onChange={this.handleChangeTitle}></input>
            </div>
            <div className='tab'>
              <span>选择模块</span>
              <select value={this.state.tab} onChange={this.handleChangeTab}>
                <option value="share">分享</option>
                <option value="ask">问答</option>
                <option value="job">招聘</option>
                <option value="dev">客户端测试</option>
              </select>
            </div>
            <div className='content'>
              <textarea placeholder='请输入话题内容' value={this.state.content} onChange={this.handleChangeContent}></textarea>
            </div>
            <div className='confirm'>
              <button onClick={this.submit}>提交</button>
              <button className="clear" onClick={this.clear}>清空</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
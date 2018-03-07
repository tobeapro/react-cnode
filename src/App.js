import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import List from './views/list/list.js'
import User from './views/user/user.js'
import detail from './views/detail/detail.js'
import NewTopic from './views/new/new.js'
import NoMatch from './views/noMatch'
import toTop from './assets/top.png'
class App extends Component {
  constructor(props){
    super(props)
    this.state={
      topStatus:false
    }
    this.screenScroll=this.screenScroll.bind(this)
    this.backTop=this.backTop.bind(this)
  }
  componentWillMount(){
    window.addEventListener('scroll',this.screenScroll)
  }
  screenScroll(){
    if(window.scrollY>200){
      if(this.state.topStatus){
        return
      }
      this.setState({
        topStatus:true
      })
    }else{
      if(!this.state.topStatus){
        return
      }
      this.setState({
        topStatus:false
      })
    }
  }
  backTop(){
    let timing=setInterval(()=>{
      if(window.scrollY<=10){
        window.scroll(0,0)
        clearInterval(timing)
      }else{
        window.scroll(0,window.scrollY*9/10)
      }       
    },10)    
  }
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Switch>
              <Route path="/" exact component={List}/>
              <Route path="/user/:loginname" component={User}/>
              <Route path="/detail/:id" component={detail}/>
              <Route path="/new" component={NewTopic}/>
              <Route component={NoMatch}/>
            </Switch>
          </div>
        </Router>
        <div className={this.state.topStatus?'backTop active':'backTop'} onClick={this.backTop} title="回到顶部">
          <img src={toTop} alt='回到顶部' />
        </div>
      </div>
    );
  }
}

export default App;

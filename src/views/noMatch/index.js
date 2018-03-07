import React,{Component} from 'react'
import notFound from '../../assets/notFound.png'
export default class noMatch extends Component {
  constructor(props){
    super(props)
    this.state={
    }
    this.toBack=this.toBack.bind(this)
  }
  toBack(){
    this.props.history.push('/')
  }
  render(){
    return(
      <div className='notFound' style={{position:'fixed',top:0,bottom:0,width:'100%',minWidth:'400px',backgroundColor:'#007bc1' }}>
        <img src={notFound} alt='notFound' onClick={this.toBack} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',cursor:'pointer'}} />
      </div>
    )
  }
}
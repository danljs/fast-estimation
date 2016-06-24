'use strict'
import React from 'react'
import { connect } from 'react-redux'
import QuoteRow from './quote_row'
import {post_message} from '../actions/index'

class quote extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      items: 
      [
        {amount:0}
      ],
      category: [],
      summary: 0.00
    }
  }

  componentDidMount(){
    // let xmlhttp = new XMLHttpRequest()
    // xmlhttp.onreadystatechange = ()=>{
    //   if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    //     this.setState({category: JSON.parse(xmlhttp.response).category})
    //   }
    // }
    // xmlhttp.open('GET', 'data/data.json', true)
    // xmlhttp.send()
    
  }

  componentWillReceiveProps(nextProps){
    if(!this.props.ws.connected && nextProps.ws.connected){
      this.props.dispatch(post_message({type:'json-request',data:'initial'}))
      return
    }
    switch(nextProps.ws.type){
      case 'json-response':
        this.setState({category: nextProps.ws.data.category})
        break
      case 'print-response':
        let url = window.URL.createObjectURL(new Blob([
          new Uint8Array(nextProps.ws.file.data)
          ],{type: "application/pdf"}));
        let b = document.createElement('a')
        b.href = url
        b.download = 'testtest.pdf'
        b.style.display = 'none'
        document.body.appendChild(b)
        b.click()
        document.body.removeChild(b)
        window.URL.revokeObjectURL(url);
        break
      default:
    }
  }

  render() {
    let lang = this.props.lang.keys
    let titles = this.state.category.map((c,i)=>c[lang.item_name])
    let items = this.state.items
    return (
      <div className='quote'>
        <div></div>
        <div className='row header'>
          <div className='add' onClick={e=>{
            this.setState({items: [...items, {}]})
          }}/>
          <input className='new-todo' placeholder={lang.what}/>
          <button onClick={e=>{
            //var aaa = this.state.items.map(c=>[...c.items.map(e=>e.item_name), c.quatity + '', c.amount])
            //var bbb = []
            //titles.map(c=>bbb.push({title:c,width:70}))
            //bbb.push({title:lang.quatity,width:70})
            //bbb.push({title:lang.amount,width:70})
            
            var xhr = new XMLHttpRequest()
            xhr.responseType = 'blob'
            xhr.onload = () => {
              if (xhr.readyState !== 4 || xhr.status !== 200) return
              var a = document.createElement('a')
              a.href = window.URL.createObjectURL(xhr.response)
              a.download = 'testtest.pdf'
              a.style.display = 'none'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
            xhr.onerror = (evt) => console.log(evt)
            xhr.onabort = (evt) => console.log(evt)
            // xhr.open('GET', 'http://localhost:8000/pdf')
            xhr.open('GET', 'pdf')
            xhr.send()
          }}>test</button>
          <div className='print' onClick={e=>{
            this.props.dispatch(post_message({type:'print-request',data:'print'}))
          }}/>
        </div>
        <section className='main'><ul>
          <li className='row title'>
          { 
            titles.map((c,i)=><div key={i} className={'item' + i}>{c}</div>)
          }
          <div className='quatity'>{lang.quatity}</div>
          <div className='amount'>{lang.amount}</div>
          </li>
          {
            items.map((c,i)=>
              <QuoteRow key={i} category={this.state.category} 
                onChange={value=>{
                  items[i] = value
                  this.setState({items: items})
                }}
                remove={e=>{
                  items.splice(i,1)
                  this.setState({items: items})
                }}
              />
            )
          }
        </ul></section>
        <div className='footer'>
          <div>{
            parseFloat(Math.round(items
            .map((c,i)=>!!!c.amount ? 0 : parseFloat(c.amount))
            .reduce((p,c) => p + c, 0) * 100) / 100).toFixed(2)
          }</div>
          <div>{lang.summary}:</div>
        </div>
      </div>
    )
  }
}
export default connect(any => any)(quote)
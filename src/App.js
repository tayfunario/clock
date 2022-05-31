import './App.css';
import React from 'react'

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      minute: 25,
      second: 0,
      break: 5,
      session: 25,
      lock: false, // timer çalışırken session ve break'ın değiştirilmesini engeller
      isTimerActive: false, // timer'a toggle mekanizması sağlamak için eklendi
      type: 'session',
      class: '#F9D923'
    }
    this.setSession = this.setSession.bind(this)
    this.setBreak = this.setBreak.bind(this)
    this.timer = this.timer.bind(this)
    this.restart = this.restart.bind(this)
    this.reset = this.reset.bind(this)
    this.alarm = this.alarm.bind(this)
    // eslint-disable-next-line
    let secondInterval = null
  }

  setSession(operation){
    if(this.state.lock === false){
      if(operation === 'incr'){
        if(this.state.session < 60){
          this.setState(state => ({
            session: state.session + 1,
          }))
          if(this.state.type === 'session'){
            this.setState(state =>({
              minute: state.session ,
              second: 0
            }))
          }
        }
      } else {
        if(this.state.session > 1){
          this.setState(state => ({
            session: state.session - 1,
          }))
          if(this.state.type === 'session'){
            this.setState(state =>({
              minute: state.session,
              second: 0
            }))
          }
        }
      }
    }
  }

  setBreak(operation){
    if(this.state.lock === false){
      if(operation === 'incr'){
        if(this.state.break < 60){
          this.setState(state => ({
            break: state.break + 1,
          }))
          if(this.state.type === 'break'){
            this.setState(state =>({
              minute: state.break,
              second: 0
            }))
          }
        }
      } else {
        if(this.state.break > 1){
          this.setState(state => ({
            break: state.break - 1,
          }))
          if(this.state.type === 'break'){
            this.setState(state =>({
              minute: state.break,
              second: 0
            }))
          }
        }
      }
    }
  }

  timer(){
    // toggle mekanizması
    this.setState(state => ({
      isTimerActive: !state.isTimerActive,
      lock: !state.lock
    }))

    if(this.state.isTimerActive === false){
        this.secondInterval = setInterval(() => {
          if(this.state.second === 0){
            this.setState(state => ({
              minute: state.minute - 1,
              second: 59
            }))
          } else {
            this.setState(state => ({
              second: state.second - 1
            }))
          }

          if(this.state.minute === 0){
            this.setState({
              class: '#EB5353'
            })
          } else {
            this.setState({
              class: '#F9D923'
            })
          }

          if(this.state.minute === 0 && this.state.second === 0){
            this.alarm()
            this.restart()
          }
        }, 1000)
    } else {
      clearInterval(this.secondInterval)
    }
  }
    
  restart(){
    if(this.state.type === 'session'){
      this.setState(state => ({
        type: 'break',
        minute: state.break,
        second: 0
      }))
    } else {
      this.setState(state => ({
        type: 'session',
        minute: state.session,
        second: 0
      }))
    }
  }

  reset(){
    this.setState(state => ({
      minute: state.session,
      second: 0,
      isTimerActive: false,
      type: 'session'
    }))
    clearInterval(this.secondInterval)
  }

  alarm(){
    const beep = document.querySelector('#beep')
    beep.play()
  }

  render(){
    return (
      <div id='container'>
        <audio src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" id='beep'></audio>
        <Settings {...this.state} setSession={this.setSession} setBreak={this.setBreak}/>
        <Clock {...this.state} zero={this.zero} timer={this.timer} reset={this.reset} />
      </div>
    )
  }
}

const Settings = (props) => (
  <div>
    <h1 id='title'>25+5 Clock</h1>
    <div id='b-s-flex'>
      <div id='break'>
        <div id='break-label'>Break Length</div>
        <div className='btn-wrapper'>
          <div id='break-increment' className='hover' onClick={() => props.setBreak('incr')}><i className="fa-solid fa-arrow-up"></i></div>
          <div id='break-length'><span id='break-length'>{props.break}</span></div>
          <div id='break-decrement' className='hover' onClick={() => props.setBreak('decr')}><i className="fa-solid fa-arrow-down"></i></div>
        </div>
      </div>
      <div id='session'>
        <div id='session-label'>Session Length</div>
        <div className='btn-wrapper'>
          <div id='session-increment' className='hover' onClick={() => props.setSession('incr')}><i className="fa-solid fa-arrow-up"></i></div>
          <div id='break-length'><span id='session-length'>{props.session}</span></div>
          <div id='session-decrement' className='hover' onClick={() => props.setSession('decr')}><i className="fa-solid fa-arrow-down"></i></div>
        </div>
      </div>
    </div>
  </div>
)

const Clock = (props) => (
  <div>
    <div id='clock'>
      <h2 id='timer-label'>{props.type}</h2>
      <span id='time-left' style={{color:props.class}} ><span id='minute'>{props.minute <= 9 && <span>0</span>}{props.minute}</span>:{props.second <= 9 && <span>0</span>}<span id='second'>{props.second}</span></span>
    </div>
    <div className='btn-wrapper'>
      <div id='start_stop' className='hover' onClick={props.timer}>
        <i className="fa-solid fa-play"></i>
        <i className="fa-solid fa-pause"></i>
      </div>
      <div id='reset' className='hover' onClick={props.reset}><i className="fa-solid fa-arrow-rotate-left"></i></div>
    </div>
  </div>
)

export default App;

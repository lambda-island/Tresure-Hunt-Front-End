import React, {Component} from 'react';
import './App.css';
import secToken from '../src/Components/tokens/Token'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    let config = {
      headers: {Authorization: secToken}
    }
    axios
      .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', config)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div className='App'>

      </div>
    )
  }
}

export default App;

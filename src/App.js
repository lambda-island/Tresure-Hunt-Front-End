import React, {Component} from 'react';
import './App.css';
// import DataDisplay from './Components/dataDisplay'
// import Traversal from './Components/Traversal'
import GraphMap from './Components/graphMap'

class App extends Component {
  
  render() {
    return (
      <div className='App'>
        {/* <Traversal /> */}
        <GraphMap />
      </div>
    )
  }
}

export default App;

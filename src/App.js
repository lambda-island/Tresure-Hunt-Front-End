import React, {Component} from 'react';
import Styled from 'styled-components'
import './App.css';
// import DataDisplay from './Components/dataDisplay'
// import Traversal from './Components/Traversal'
import GraphMap from './Components/graphMap'

const Main = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
`

class App extends Component {
  
  render() {
    return (
      <Main>
        {/* <Traversal /> */}
        <GraphMap />
      </Main>
    )
  }
}

export default App;

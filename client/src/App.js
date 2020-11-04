import React from 'react';

import './App.css';

class App extends React.Component {
/*
  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({data: res.express}))
      .catch(err => console.log(err));
  }

  callBackendAPI = async () => {
    let response = await fetch('/express_backend');
    let body = await response.json();

    if(response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  }
*/
  render() {
    return (
      <div className="App">
        <header className="App-header">

        </header>
      </div>
    );
  }

}

export default App;

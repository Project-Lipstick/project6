import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './landing';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class App extends React.Component {

    render() {
      return (
        <div>
          <Landing />
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

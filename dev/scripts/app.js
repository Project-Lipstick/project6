import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './landing';
import Discover from './discover';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class App extends React.Component {

    render() {
      return (
        <div>
          <Landing />
          <Discover />
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

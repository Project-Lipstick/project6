import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Landing from './landing';
import Profile from './profile';
import SearchForm from './SearchForm';
import ProfileView from './ProfileView';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class App extends React.Component {

    render() {
      return (
        <div>
          <Landing />
          <Profile />
          <h1>Makeup App</h1>
          <SearchForm />
          <ProfileView />
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import firebase from './firebase';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class Discover extends React.Component {
    constructor() {
        super();
        this.state = {
            userList: [],
        }
    }

    componentDidMount() {
        const dbRef = firebase.database().ref();

        dbRef.on('value', (res) => {
            const users = res.val();
            this.setState({
                userList: users,
            });
            console.log(users);
        });

    }

    
    render() {
        return (
            <section className="discoverContainer">
                <h2>Discover</h2>
            </section>
        )
    }
}

export default Discover;
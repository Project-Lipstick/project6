import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import firebase from './firebase';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Dashboard from './dashboard';


const provider = new firebase.auth.GoogleAuthProvider();

class Landing extends React.Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            userKey: "",
            userName: "",
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("existing user");
                this.setState({
                    loggedIn: true,
                    userKey: user.uid,
                    userName: user.displayName,
                });
            } else {
                console.log("you're not a user");
                this.setState({
                    loggedIn: false,
                    userKey: "",
                    userName: "",
                });
            }
        });
    }

    componentDidMount() {
    }

    login(e) {
        e.preventDefault();
        console.log('sign in');
        firebase.auth().signInWithPopup(provider)
            .then((user) => {
                this.setState({
                    loggedIn: true,
                    userKey: user.uid,
                    userName: user.displayName,
                });

                const userId = firebase.auth().currentUser.uid;

                const dbRef = firebase.database().ref(`${userId}/`);

                dbRef.update({
                    name: `${user.user.displayName}`,
                    email: `${user.user.email}`,
                });
            });
    }

    logout(e) {
        e.preventDefault();
        console.log('logout');
        firebase.auth().signOut()
            .then((user) => {
            });
        this.setState({
            loggedIn: false,
            userKey: "",
            userName: "",
        })
    }
    render() {
        return (
            <div>
                {this.state.loggedIn === false
                    ? <section>
                        <div>

                        </div>
                        <div className="wrapper">
                            <a href="" onClick={this.login}>Sign in with Google</a>
                        </div>
                    </section>
                    : <Dashboard
                        userKey={this.state.userKey}
                        userName={this.state.userName} />}
                <a href="" onClick={this.logout}>Logout</a>
            </div>
        )
    }
}

export default Landing;

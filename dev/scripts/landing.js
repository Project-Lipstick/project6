import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Form from './form';
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
        firebase.auth().onAuthStateChanged((data) => {
            if (data) {
                this.setState({
                    loggedIn: true,
                    userKey: data.uid,
                    userName: data.displayName,
                });
            } else {
                this.setState({
                    loggedIn: false,
                    userKey: "",
                    userName: "",
                });
            }
        });
    }

    login(e) {
        e.preventDefault();
        firebase.auth().signInWithPopup(provider)
            .then((data) => {
                this.setState({
                    loggedIn: true,
                    userKey: data.user.uid,
                    userName: data.user.displayName,
                });

                const userId = firebase.auth().currentUser.uid;

                const dbRef = firebase.database().ref(`${userId}/`);

                dbRef.update({
                    name: `${data.user.displayName}`,
                    email: `${data.user.email}`,
                });
            });
        }

    logout(e) {
        e.preventDefault();
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
                <div>
                    {this.state.loggedIn === false
                        ? <section className="landingContainer">
                            <div className="landingPageSideImage">
                                <img src="./dev/images/sideImage.jpg" alt=""/>
                            </div>
                            <div className="landingControls">
                                <div className="unitSignIn">
                                    <img className="signInLogo" src="./dev/images/logo.png" alt=""/>
                                    <a href="" onClick={this.login}>Sign In</a>
                                </div>
                            </div>
                        </section>
                        : <Dashboard
                            userKey={this.state.userKey}
                            userName={this.state.userName} />}
                </div>
            </div>
        )
    }
}

export default Landing;

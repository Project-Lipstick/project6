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
            const userData = res.val();
            const dirtyUserList = [];

            for (let user in userData) {
                dirtyUserList.push(userData[user]);
            };

            const userList = dirtyUserList.filter(function(item){
                return item.existingUser === true && item.name !== 'Demo Mode';
            });

            this.setState({
                userList,
            });
        });
    }

    
    render() {
        return (
            <section className="discoverContainer">
                <h2>Discover</h2>
                <div className="wrapper">
                    {this.state.userList.map((userList) => {
                        return <UserCard
                            key={userList.name}
                            name={userList.name}
                        />
                    })}
                </div>
            </section>
        )
    }
}

class UserCard extends React.Component {
    render(){
        return(
            <div>
                
            </div>
        )
    }
}

export default Discover;
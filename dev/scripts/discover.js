import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import firebase from './firebase';
import PublicPage from './publicpage';
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
                <section>
                    <h2>Discover</h2>
                    <div className="clearfix">
                        {this.state.userList.map((userList) => {
                            return <UserCard
                                key={userList.id}
                                userUrl={userList.id}
                                name={userList.name}
                                image={userList.imageUrl}
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
            
            <div className="userCard clearfix">
                <img src={this.props.image} alt="" />
                <h3>{this.props.name}</h3>
                <Link to={`/discover/${this.props.userUrl}`}>View Profile</ Link>
            </div>
            
        )
    }
}

export default Discover;
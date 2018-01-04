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
            searchList: [],
            searching: false,
            searchQuery: '',
        }
        this.searchField = this.searchField.bind(this);
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

    searchField(e) {
        e.preventDefault();
        if (e.target.value !== '') {
            this.setState({
                searching: true,
            });
        } else {
            this.setState({
                searching: false,
            });
        }

        const searchQuery = e.target.value;
        const userList = this.state.userList;
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        const searchList = userList.filter(function(user){
            return user.name.includes(capitalizeFirstLetter(searchQuery));
        });
        this.setState({
            searchList,
        });
    }

    
    render() {
        return (
                <section>
                    <h2>Discover</h2>
                    <form name="userSearch">
                        <input type="text" onChange={this.searchField}/>
                    </form>
                    
                    {this.state.searching === false ?
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
                    :
                    <div className="clearfix">
                        {this.state.searchList.map((searchList) => {
                        return <UserCard
                            key={searchList.id}
                            userUrl={searchList.id}
                            name={searchList.name}
                            image={searchList.imageUrl}
                        />
                        })}
                    </div>
                    }
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
                {/* <Link to={`/discover/${this.props.userUrl}`}>View Profile</ Link> */}
            </div>
            
        )
    }
}

export default Discover;
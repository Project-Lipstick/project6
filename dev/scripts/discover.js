import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import firebase from './firebase';
import PublicPage from './publicpage';
import DiscoverProfile from './discoverProfile';
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
        console.log("discover did mount");
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

        const searchQuery = e.target.value.toLowerCase();
        const userList = this.state.userList;
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        const searchList = userList.filter(function(user){
            return user.search.includes(searchQuery);
        });
        this.setState({
            searchList,
        });
    }

    
    render() {
        return (
            <Router>
                <section className="discoverContainer">
                    <h2 className="profileHeading">Discover Users</h2>
                    <form name="userSearch">
                        <input type="text" placeholder="Search" onChange={this.searchField}/>
                    </form>
                    
                    {this.state.searching === false ?
                    <div className="clearfix">
                        {this.state.userList.map((userList) => {
                            return (
                                <Link to={`/discover/${userList.id}`} key={userList.name} >
                                    <div className="userCard clearfix" key={userList.id}>
                                        <img src={userList.imageUrl} alt="" />
                                        <h3>{userList.name}</h3>
                                    </div>
                                </Link>
                            )
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
            </Router>
        )
    }
}

// class UserCard extends React.Component {
//     render(){
//         return(
//             <div className="userCard clearfix">
//                 <img src={this.props.image} alt="" />
//                 <h3>{this.props.name}</h3>
//                 <Link to={`/discover/${this.props.userUrl}`}>View Profile</ Link>
//                 <Switch>
//                     <Route path={`/discover/${this.props.userUrl}`} render={props => <DiscoverProfile {...props} userUrl={this.props.userUrl} />} />
//                 </Switch>
//             </div>
//         )
//     }
// }

export default Discover;
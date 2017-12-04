import React from 'react';
import firebase from 'firebase';
import Form from './form';
import AdminView from './adminview';
import SearchForm from './searchform';
import PublicPage from './publicpage';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userKey: "",
            userName: "",
            existingUser: "",
        }
        this.editInfo = this.editInfo.bind(this);
    }

    componentDidMount() {
        const userId = this.props.userKey;
        
        const dbRef = firebase.database().ref(`${userId}`);
        
        dbRef.on("value", (res) => {
            const data = res.val();
            
            const userStanding = data.existingUser;
            if(data.existingUser === true){
                this.setState({
                    existingUser: true
                })
            }else{
                this.setState({
                    existingUser: false
                })
            }   
        })
    }

    editInfo(e){
        e.preventDefault();
        this.setState({
            existingUser: true
        })

        const dbRef = firebase.database().ref(`${this.props.userKey}`);

        dbRef.update({
            existingUser: true
        })
    }

    render() {
        return (
            <div>
                {this.state.existingUser === false
                    ? <section>
                        <Form userkey={this.props.userKey} />
                        <button onClick={this.editInfo}>BUTTON</button>
                    </section>
                    : <TopNav userkey={this.props.userKey} />}
            </div>
        )
    }
}

class TopNav extends React.Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
    }

    logout(e) {
        e.preventDefault();
        firebase.auth().signOut()
            .then((user) => {
            });
        this.setState({
            loggedIn: false,
            userKey: this.props.userkey,
            userName: "",
        })
    }

    render() {
        return (
            <Router>
                <div className="wrapper">
                    <ul>
                        <li><Link to={'/AdminView'}>Dashboard</Link></li>
                        <li><Link to={'/SearchForm'}>Search</Link></li>
                        <li><Link to={'/PublicPage'}>Public Page</Link></li>
                        <li onClick={this.logout}>Logout</li>
                    </ul>
                    <Switch>
                        <Route exact path="/AdminView" render={props => <AdminView {...props} userkey={this.props.userkey}/>}/>
                        <Route exact path="/SearchForm" render={props => <SearchForm {...props} userkey={this.props.userkey}/>}/>
                        <Route exact path="/PublicPage" render={props => <PublicPage {...props} userkey={this.props.userkey}/>}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default Dashboard;

// <Router>
//     <div className=“wrapper”>
//           <Switch>
//         <Route
//             exact path=“/”
//               render={props => <LandingPage {...props} formSubmit={this.getMeetups} />}
//         />
//             <Route
//             exact path=“/meetups”
//               render={props => <Meetups {...props} data={this.state.meetups} onClick={this.getRestaurantRefs} />}
//         />
//             <Route
//             exact path=“/restaurants”
//               render={props => <Restaurants {...props} data={this.state.restaurants} />}
//         />
//           </Switch>
//         </div>
//       </Router >
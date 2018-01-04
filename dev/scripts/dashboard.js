import React from 'react';
import firebase from 'firebase';
import Form from './form';
import AdminView from './adminview';
import SearchForm from './searchform';
import PublicPage from './publicpage';
import Discover from './discover';
import DiscoverProfile from './discoverprofile';
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
        this.endDemo = this.endDemo.bind(this);
    }

    logout(e) {
        e.preventDefault();
        firebase.auth().signOut();
    }

    endDemo(e) {
        e.preventDefault();
        console.log("end demo");
    }

    render() {
        return (
            <Router>
                <div className="wrapper clearfix">
                    <h3 className="navLogo">Caboodle</h3>
                    <ul className="nav clearfix">
                        <li><Link to={'/'} className="navLink" >Dashboard</Link></li>
                        <li><Link to={'/search'} className="navLink"  >Search</Link></li>
                        {/* <li><Link to={'/discover'} className="navLink"  >Discover</Link></li> */}
                        <li><Link to={`/public/${this.props.userkey}`} className="navLink">Public</Link></li>
                        {this.props.userkey === "demo" ?
                        <li className="navLink">
                            <a href="https://makeup-fun.firebaseapp.com/">Logout</a>
                        </li>
                        : 
                        <li onClick={this.logout} className="navLink">Logout</li>
                        }
                    </ul>
                    <Switch className="switch">
                        <Route exact path="/" render={props => <AdminView {...props} userkey={this.props.userkey}/>}/>
                        <Route exact path="/discover" render={props => <Discover {...props} userkey={this.props.userkey}/>}/>
                        <Route exact path="/search" render={props => <SearchForm {...props} userkey={this.props.userkey}/>}/>
                        <Route exact path={`/public/${this.props.userkey}`} render={props => <PublicPage {...props} userkey={this.props.userkey}/>}/>
                        <Route exact path={`/discover/${this.props.userUrl}`} render={props => <DiscoverProfile {...props} userUrl={this.props.userUrl}/>}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default Dashboard;
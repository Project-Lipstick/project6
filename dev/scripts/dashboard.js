import React from 'react';
import firebase from 'firebase';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class Dashboard extends React.Component {
    constructor(){
        super();
        this.state = {
            userKey: "",
            userName: "",
        }
    }

    componentDidMount() {
        this.setState({
            userKey: this.props.userKey,
            userName: this.props.userName,

        });
    }
    render() {
        return (
            <section className="adminPage">
                <h1>Hayyy {this.state.userName}</h1>
            </section>
        )
    }
}

export default Dashboard;
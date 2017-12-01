import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class ProfileView extends React.Component{
    constructor(){
        super();
        this.state={
            currentItems: []
        }
        this.removeItem = this.removeItem.bind(this);
    }

    componentDidMount(){
        const dbRef = firebase.database().ref("N5eadjZta9gfwlPBYiKIx2Q1G7v1").child("selections");

        const userItems = [];
        dbRef.on("value", (res) => {
            const data = res.val();

            for (let key in data) {
                const value = data[key];
                userItems.push(value);
            }
            this.setState({
                currentItems: userItems
            })
        })
    }
    
    removeItem(e, key) {
        e.preventDefault();
        const selectionRef = key;
        const toRemove = firebase.database().ref("N5eadjZta9gfwlPBYiKIx2Q1G7v1").child(`selections/${key}`);
        
        toRemove.remove();

        const dbRef = firebase.database().ref("N5eadjZta9gfwlPBYiKIx2Q1G7v1").child("selections");

        const userItems = [];
        dbRef.on("value", (res) => {
            const data = res.val();

            for (let key in data) {
                const value = data[key];
                userItems.push(value);
            }
            this.setState({
                currentItems: userItems
            })
        })
    }

    render(){
        return(
            <div>
                {this.state.currentItems.map((item)=>{
                    return(
                    <div key={item.selectionKey}>
                        <div className="wrapper">
                            <img src={item.imageUrl} alt=""/>
                            <h1>{item.brandTitle}</h1>
                            <p>{item.productDescription}</p>
                            <a href="" onClick={(e) => this.removeItem(e, item.selectionKey)}>test</a>
                        </div>
                    </div>
                    )
                })}
            </div>
        )
    }
}

export default ProfileView
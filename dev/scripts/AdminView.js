import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';
import EditingBox from './EditingBox';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
class AdminView extends React.Component{
    constructor(){
        super();
        this.state = {
            currentItems: [],
            active: false,
            showColors: false,
            testColor: "",
            note: "",
            instagram: "",
            twitter: "",
            imageUrl: "",
        }
        this.removeItem = this.removeItem.bind(this);
        this.toggleClass = this.toggleClass.bind(this);
        this.addPublic = this.addPublic.bind(this);
        this.removePublic = this.removePublic.bind(this);
        this.showColors = this.showColors.bind(this);
    }
    

    componentDidMount(){
        const itemRef = firebase.database().ref(`${this.props.userkey}`).child("selections");
        const userItems = [];
        itemRef.once("value", (res) => {
            const data = res.val();
            for (let key in data) {
                const value = data[key];
                userItems.push(value);
            }
            this.setState({
                currentItems: userItems,
            })
        })

        const infoRef = firebase.database().ref(`${this.props.userkey}`);
        const userInfo = [];
        infoRef.on("value", (res) => {
            const data = res.val();
            userInfo.push(res);
            this.setState({
                instagram: data.instagram,
                twitter: data.twitter,
                note: data.note,
                imageUrl: data.imageUrl,
            })
        })
    }
    
    removeItem(e, key) {
        e.preventDefault();
        const toRemove = firebase.database().ref(`${this.props.userkey}`).child(`selections/${key}`);
        toRemove.remove();
        const dbRef = firebase.database().ref(`${this.props.userkey}`).child("selections");
        const newUserItems = [];
        dbRef.on("value", (res) => {
            const data = res.val();
            for (let key in data) {
                const value = data[key];
                newUserItems.push(value);
            }
            this.setState({
                currentItems: newUserItems
            })
        })
    }
    addPublic(e, key) {
        e.preventDefault();
        const dbRef = firebase.database().ref(`${this.props.userkey}`).child(`selections/${key}`);
        dbRef.update({
            active: true,
        });
    }
    removePublic(e, key) {
        e.preventDefault();
        const dbRef = firebase.database().ref(`${this.props.userkey}`).child(`selections/${key}`);
        dbRef.update({
            active: false,
        });
    }
    toggleClass(){
        const currentState = this.state.active;
        this.setState({ active: !currentState})
    }
    toggleColor(e, colorValue){
        e.preventDefault();
        this.setState({
            testColor: colorValue
        })
        const dbRef = firebase.database().ref(`${this.props.userkey}`);
        dbRef.update({
            backgroundColor: colorValue
        })
    }

    showColors(e){
        e.preventDefault();
        this.setState({ showColors: !this.state.showColors });
    }


    render() {
        const divStyle = {
            background: "black",
            width: "50px",
            height: "50px",
        }
        return (
            <section className="adminContainer">
                <h2 className="sectionHeading">Dashboard</h2>
                <div>
                    <div>
                        <div className="userDetails">
                            <div className="imgContainer">
                                <img src={this.state.imageUrl} alt=""/>
                            </div>
                            <div className="userContent">
                                <p className="bodyContent">{this.state.note}</p>
                            </div>
                            <div className="contentEdit">
                                <p className="bodyContent">Click to edit your information!</p>
                                <EditingBox
                                    userkey={this.props.userkey} />
                            </div>
                        </div>
                        <p>{this.state.note}</p>
                        <a href={`${this.state.twitter}`}>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                        <a href={`${this.state.instagram}`}>
                            <i className="fa fa-instagram" aria-hidden="true"></i>
                        </a>
                    </div>
                    {this.state.currentItems.map((item) => {
                        return (
                            <div key={item.selectionKey}>
                                <div className="wrapper">
                                    <img src={item.imageUrl} alt="" />
                                    <h1>{item.brandTitle}</h1>
                                    <p>{item.productDescription}</p>
                                    <a href="" onClick={(e) => this.removeItem(e, item.selectionKey)}>test</a>
                                    <a href="" onClick={(e) => this.addPublic(e, item.selectionKey)}>Add Public</a>
                                    <a href="" onClick={(e) => this.removePublic(e, item.selectionKey)}>Remove Public</a>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <p onClick={this.showColors}>Show Colors</p>
                {this.state.showColors ?
                <div>
                    <div style={divStyle} onClick={(e) => this.toggleColor(e, "userOption1")}></div>
                    <div style={divStyle} onClick={(e) => this.toggleColor(e, "userOption2")}></div>
                    <div style={divStyle} onClick={(e) => this.toggleColor(e, "userOption3")}></div>
                    <div style={divStyle} onClick={(e) => this.toggleColor(e, "userOption4")}></div>
                    <p>Click to change accent color on your public page</p>
                </div>
                    : null}
            </section>
        )
    }
}
export default AdminView
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';
import EditingBox from './EditingBox';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
class AdminView extends React.Component {
    constructor() {
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


    componentDidMount() {
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

    toggleClass() {
        const currentState = this.state.active;
        this.setState({ active: !currentState })
    }

    toggleColor(e, colorValue) {
        e.preventDefault();
        this.setState({
            testColor: colorValue
        })
        const dbRef = firebase.database().ref(`${this.props.userkey}`);
        dbRef.update({
            backgroundColor: colorValue
        })
    }

    showColors(e) {
        e.preventDefault();
        this.setState({ showColors: !this.state.showColors });
    }
    
    render() {
        return (
            <section className="adminContainer">
                <h2 className="sectionHeading">Dashboard</h2>
                <div>
                    <div>
                        <div className="userDetails clearfix">
                            <div className="imgContainer">
                                <img src={this.state.imageUrl} alt="" />
                            </div>
                            
                            <div className="userContentContainer">
                                <div className="userContent">
                                    <p><span className="bioTitle">Current Bio</span></p>
                                    <p className="bodyContent">{this.state.note}</p>
                                    <a href={`${this.state.twitter}`}>
                                        <i className="fa fa-twitter" aria-hidden="true"></i>
                                    </a>
                                    <a href={`${this.state.instagram}`}>
                                        <i className="fa fa-instagram" aria-hidden="true"></i>
                                    </a>
                                </div>
                                <div className="contentEdit">
                                    <p className="bodyContent"></p>

                                    <EditingBox
                                        userkey={this.props.userkey} />

                                    <div className="colorContainer">
                                    <p className="editColorTitle" onClick={this.showColors}>Edit Profile Color</p>
                                    {this.state.showColors ?
                                        <div className="colorBoxes">
                                            <div className="colors color1" onClick={(e) => this.toggleColor(e, "userOption1")}></div>
                                            <div className="colors color2" onClick={(e) => this.toggleColor(e, "userOption2")}></div>
                                            <div className="colors color3" onClick={(e) => this.toggleColor(e, "userOption3")}></div>
                                            <div className="colors color4" onClick={(e) => this.toggleColor(e, "userOption4")}></div>
                                        </div>
                                        : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="mainBagTitle">My Bag</h2>
                    </div>

                    {this.state.currentItems.map((item) => {
                        return (
                            <div className="bagContainer" key={item.selectionKey}>
                                <div className="bagItems">
                                    <img src={item.imageUrl} alt="" />
                                    <h3>{item.brandTitle}</h3>
                                    <p>{item.productDescription}</p>
                                    <div className="bagLinksContainer">
                                        <div className="removeFromBag">
                                            <a href="" onClick={(e) => this.removeItem(e, item.selectionKey)}><i className="fa fa-minus-square-o" aria-hidden="true"></i></a>
                                        </div>

                                        <div className="bagLinks">
                                            <div className="bagTitle">
                                                <h3>Public View</h3>
                                            </div>

                                            <div className="bagRemoveAdd">
                                                <div className="bagRemoveIcons addPublic">
                                                    <a href="" onClick={(e) => this.addPublic(e, item.selectionKey)}><i className="fa fa-plus-square-o" aria-hidden="true"></i></a>
                                                </div>

                                                <div className="bagRemoveIcons removePublic">
                                                    <a href="" onClick={(e) => this.removePublic(e, item.selectionKey)}><i className="fa fa-minus-square" aria-hidden="true"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        )
    }
}
export default AdminView
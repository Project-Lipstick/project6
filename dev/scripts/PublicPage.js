import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';

class PublicPage extends React.Component{
    constructor() {
        super();
        this.state = {
            publicItems: [],
            instagram: "",
            twitter: "",
            note: "",
            imageUrl: "",
            name: "",
            colorPick: "",
        }
    }

    componentDidMount(){
        const dbRef = firebase.database().ref(`${this.props.userkey}`).child("selections");

        const deactiveItem = [];
        dbRef.once("value", (res) => {
            const data = res.val();
            for (let key in data) {
                const value = data[key];
                deactiveItem.push(value);
            }

            const activeItems = [];
            for (var i = 0; i < deactiveItem.length; i++) {
                if (deactiveItem[i].active === true) {
                    activeItems.push(deactiveItem[i]);
                } 
            }

            this.setState({
                publicItems: activeItems,
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
                name: data.name,
                colorPick: data.backgroundColor,
            })
        })
    }
render(){
    return(
        <section className="profileContainer">
            <div className="imageContainer"> 
                <div className="profileImage">
                    <img src={this.state.imageUrl} alt="" />
                    <div className={this.state.colorPick}></div>
                </div>
            </div>

            <div className="profileContent">
                <h2 className="profileHeading">{this.state.name}</h2>
                <p className="bodyContent">{this.state.note}</p>
                <a href={`http://twitter.com/${this.state.twitter}`}>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                </a>
                <a href={`http://instagram.com/${this.state.instagram}`}>
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                </a>

                <div>
                    <h1 className="publicMakeupTitle">My Makeup Bag</h1>
                </div>
                {this.state.publicItems.map((items) => {
                    return(
                        <div className="publicMakeupContainer" key={items.selectionKey}>
                            <div className="publicMakeup">
                                <img src={items.imageUrl} alt="" />
                                <h3>{items.brandTitle}</h3>
                                <p>{items.productDescription}</p>
                                <div className="publicLink">
                                    <a href={items.productUrl}>Shop</a>
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



// adminjs -- in there we're going to make a button that you can toggle onClick
//we're going to a ternary that says for the previous button onClick if true then display in public page





export default PublicPage;
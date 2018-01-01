import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const provider = new firebase.auth.GoogleAuthProvider();

class Form extends React.Component {

    constructor() {
        super();
        this.state = {
            twitter: "",
            instagram: "",
            note: "",
            imageUrl: "",
            uploading: false,
        }
        this.handleClick = this.handleClick.bind(this);       
    }
    
    componentDidMount() {
        const dbRef = firebase.database().ref(`${this.props.userkey}`);

        dbRef.on('value', (snapshot) => {
            const newState=[];
            const data = snapshot.val();

            for (let key in data) {
                let newTwitter = data[`twitter`];
                let newNote = data[`note`];
                let newInstagram = data[`instagram`];
                let newImageUrl = data[`imageUrl`]

                this.setState({
                    twitter: newTwitter,
                    instagram: newInstagram,
                    imageUrl: newImageUrl,
                    note: newNote
                })
            }
        });
    }
    
    handleClick(e) {
        e.preventDefault();

        this.setState({
            uploading: true,
        });

        const newTwitter = this.twitter.value;
        const newInstagram = this.instagram.value;
        const newNote = this.note.value
        const dbRef = firebase.database().ref(`${this.props.userkey}`);

        const file = document.getElementById("userImage").files[0];

        const storageRef = firebase.storage().ref(file.name);

        storageRef.put(file).then(function (result) {
            storageRef.getDownloadURL()
                .then(function (result) {
                    dbRef.update({
                        imageUrl: result,
                        twitter: newTwitter,
                        instagram: newInstagram,
                        note: newNote,
                        existingUser: true,
                    })
                });
        });
    }
    render(){
        
        return(
            <div>
            {this.state.uploading === false ?
            <section className="formSection">
                <div className="formInputWrapper">
                    <div className="formBox">
                        <h1 className="formTitle">Create Your Profile</h1>
                        <form onSubmit={this.handleClick}>
                            <div className="note inputBox">
                                <label htmlFor="note">Describe Yourself</label>
                                <textarea className="formInput" name="note" id="note" placeholder="Max length 280 char." maxLength="280" ref={ref => this.note = ref}></textarea>
                            </div>
                            <div className="twitterLink inputBox">
                                <label htmlFor="twitter">Twitter Link</label>
                                <input placeholder="@yourtwitter"className="formInput" type="text" name="twitter" id="twitter" ref={ref => this.twitter = ref} />
                            </div>
                             <div className="instagramLink inputBox">
                                <label htmlFor="instagram">Instagram Link</label>
                                 <input placeholder="@yourinstagram"className="formInput" type="text" name="instagram" id="instagram" ref={ref => this.instagram = ref} />
                            </div>
                            <div className="userImage inputBox">
                                <label htmlFor="userImage">Profile Image</label>
                                <input className="formInput fileInput"
                                    type="file" name="userImage[]" id="userImage" ref={ref => this.imageUrl = ref} />
                            </div>
                            <input className="formSubmitButton" type="submit" value="Add" />
                        </form> 
                    </div>
                </div> 
            </section>
            : 
            <section className="profileCreation">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                    <h3>Creating Your Profile</h3>
                </div>
            </section>
            }
            </div>
        )
    }
}

export default Form;
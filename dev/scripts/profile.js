import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';
import EditingBox from './EditingBox';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const provider = new firebase.auth.GoogleAuthProvider();

class Profile extends React.Component {

    constructor() {
        super();
        this.state = {
            twitter: "",
            instagram: "",
            note: "",
            imageUrl: ""
        }
        this.handleClick = this.handleClick.bind(this);       
    }
    
    componentDidMount() {
        var dbRef = firebase.database().ref();

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
                console.log(this.state)
            }
        });
    }
    
    handleClick(e) {
        console.log('clicked');
        e.preventDefault();

        const newTwitter = this.twitter.value;
        const newInstagram = this.instagram.value;
        const newNote = this.note.value
        const dbRef = firebase.database().ref();

        this.setState({
            twitter: newTwitter,
            instagram: newInstagram,
            note: newNote
        });

        if (document.getElementById("userImage").value != "") {
            console.log("you have a file");
            const file = document.getElementById("userImage").files[0];

            const storageRef = firebase.storage().ref(file.name);

            storageRef.put(file).then(function (result) {

                storageRef.getDownloadURL()
                    .then(function (result) {
                        console.log(result);
                        this.setState({
                            imageUrl: result,
                        });
                        dbRef.update({
                            imageUrl: this.state.imageUrl,
                        })
                    }.bind(this));
            }.bind(this));
        } else {
            dbRef.update({
                twitter: newTwitter,
                instagram: newInstagram,
                note: newNote
            })
        }
    }
   
    render(){
        
        return(
            <div>
                <form onSubmit={this.handleClick}>
                    <div className="twitterLink">
                        <label htmlFor="twitter">Twitter Link</label>
                        <input type="text" name="twitter" ref={ref => this.twitter = ref} />
                    </div>
                    <div className="instagramLink">
                        <label htmlFor="instagram">Instagram Link</label>
                        <input type="text" name="instagram" ref={ref => this.instagram = ref} />
                    </div>
                    <div className="note">
                        <label htmlFor="profileNote"></label>
                        <textarea name="profileNote" id="" maxLength="280" ref={ref => this.note = ref}></textarea>
                    </div>
                    <div className="image">
                        <input type="file" name="userImage[]" id="userImage" />
                    </div>
                    <input className="submit" type="submit" value="Add" />
                </form>
               
                <div>
                    <img src={`${this.state.imageUrl}`} alt=""/>
                    <EditingBox/>
                    
                    <p>{this.state.note}</p>
                    <a href={`${this.state.twitter}`}>
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a href={`${this.state.instagram}`}>
                        <i className="fa fa-instagram" aria-hidden="true"></i>
                    </a>
                
                </div>
            </div>
        )
    }
}

export default Profile;
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const provider = new firebase.auth.GoogleAuthProvider();

export default class EditingBox extends React.Component {
    constructor() {
        super();
        this.state = {
            editing: false,
            note: "",
            instagram: "",
            twitter: "",
            imageUrl: ""
        };
        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }
    onChange(e) {
        const file = document.getElementById("userImage").files[0];
        const storageRef = firebase.storage().ref(file.name);
        storageRef.put(file).then(function (result) {
            storageRef.getDownloadURL()
                .then(function (result) {
                    this.setState({
                        imageUrl: result,
                    });
                    console.log(result);
                }.bind(this));
        }.bind(this));
    }

    save(e){
        e.preventDefault();
        const dbRef = firebase.database().ref(`${this.props.userkey}`);
        dbRef.update({
            note: this.note.value,
            instagram: this.instagram.value,
            twitter: this.twitter.value,
            imageUrl: this.state.imageUrl,
        });

        this.setState({
            editing: false,
        });
    }

    render() {
        let editingTemp = (
            <div>
                <p>{this.props.note}</p>
            </div>
        )
        if (this.state.editing) {
            editingTemp = (
                <form onSubmit={this.save}>
                    <div>
                        <input type="text" defaultValue={this.state.note} onChange={this.handleChange} name="note" ref={ref => this.note = ref} />
                        <input type="text" defaultValue={this.state.instagram} onChange={this.handleChange} name="instagram" ref={ref => this.instagram = ref} />
                        <input type="text" defaultValue={this.state.twitter} onChange={this.handleChange} name="twitter" ref={ref => this.twitter = ref} />
                        <input type="file" id="userImage" name="userImage[]" defaultValue={this.state.imageUrl}  onChange={this.onChange} ref={ref => this.imageUrl = ref}/>
                    </div>
                    <input type="submit" value="Done editing" />
                </form>
            )
        }
        return (
            <div className="editingBox">
                <i className="fa fa-edit" onClick={() => this.setState({ editing: true })}></i>
                {editingTemp}
            </div>
        )
    }

}
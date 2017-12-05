import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import firebase from './firebase';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class SearchForm extends React.Component {
    constructor() {
        super();

        this.state = {
            searchByBrand: "",
            searchByType: "",
            results: [],
            ids: []
        }
        this.handleBrand = this.handleBrand.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.pageResults = this.pageResults.bind(this);
    }

    handleBrand(e) {
        this.setState({
            searchByBrand: e.target.value,
        })
    }

    handleType(e) {
        this.setState({
            searchByType: e.target.value,
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        const brand = this.state.searchByBrand;
        const type = this.state.searchByType;
        const searchQuery = [];
        const apiUrl = 'http://makeup-api.herokuapp.com/api/v1/products.json?'

        if (brand === null) {
            searchQuery.push(`${apiUrl}product_type=${type}`);

            this.setState({
                searchByType: "",
                searchByBrand: "",
            })

        } else if (type === null) {
            searchQuery.push(`${apiUrl}brand=${brand}`);

            this.setState({
                searchByType: "",
                searchByBrand: "",
            })

        } else {
            searchQuery.push(`${apiUrl}brand=${brand}&product_type=${type}`);

            this.setState({
                searchByType: "",
                searchByBrand: "",
            })  
        }

        const test = [];

        axios.get(`${searchQuery}`)
            .then((res) => {
                const results = res.data
                test.push(results);
                this.pageResults(results)
            }).catch((err) => {
                console.log(err)
            })
        }


    componentDidMount() {
        const dbRef = firebase.database().ref("N5eadjZta9gfwlPBYiKIx2Q1G7v1").child("selections");
        const deactiveItem = [];
        dbRef.once("value", (res) => {
            const data = res.val();
            for (let key in data) {
                console.log(data)
                console.log(key)
                const value = data[key];
                deactiveItem.push(value);
                console.log(deactiveItem)
                console.log(value)
            }
            const activeItems = [];
            console.log(activeItems)
            for (var i = 0; i < deactiveItem.length; i++) {
                activeItems.push(deactiveItem[i].productId);
            }
            console.log(activeItems)
            this.setState({
                ids: activeItems
            })
        })
    }
        

        pageResults(results) {
            let existingIds = this.state.ids

            let filteredArray = results.filter(function (item) {
                return existingIds.indexOf(item["id"]) == -1;
            })

            this.setState({     
                results: filteredArray
            })
        }

    render() {
        return (
            <div>
                <div className="searchPage clearfix">
                    <div className="inputWrapper">
                        <form action="" onSubmit={this.handleSubmit} className="searchContainer clearfix">
                                <div className="brandContainer selectedContainer">
                                    <div className="textWrapper">
                                        <h3>Brand</h3>
                                        <input className="searchInput" type="text" name="brand" value={this.state.searchByBrand} onChange={this.handleBrand} autoFocus/>
                                    </div>
                                </div>
                                <div className="typeContainer selectedContainer">
                                    <div className="textWrapper"> 
                                        <h3>Makeup Type</h3>
                                        <input className="searchInput" type="text" name="type" value={this.state.searchByType} onChange={this.handleType} autoFocus/>
                                    </div>
                                </div>
                                <div className="submitContainer">
                                    <input className="searchSubmitButton"type="submit" name="submit" />
                                 </div>
                        </form>
                    </div>
                </div>
                <div className="returnedData">
                    {this.state.results.map((brand, index) => {
                        return <MakeUpProducts data={brand} key={index} userkey={this.props.userkey} />
                    })}
                </div>
            </div>
        )
    }
}

class MakeUpProducts extends React.Component {
    constructor() {
        super();
        this.state = {
            userSelect: {
                imageUrl: "",
                brandTitle: "",
                productDescription: "",
                productUrl: "",
                selectionKey: "",
            }
        }
        this.addItem = this.addItem.bind(this);
    }

    addItem(e) {
        e.preventDefault();
        const dbRef = firebase.database().ref(`${this.props.userkey}`).child("selections")
        
        const newSelection = {}
        const newRef = dbRef.push(newSelection)
            newRef.set({
                imageUrl: this.props.data.image_link,
                brandTitle: this.props.data.brand,
                productDescription: this.props.data.name,
                productUrl: this.props.data.product_link,
                productId: this.props.data.id,
                selectionKey: newRef.key,
                active: false,
            });
        }

    render() {
        return (
            <div className="bagContainer">
                <div className="bagItems">
                    <img src={this.props.data.image_link} alt="" />
                    <h3>{this.props.data.brand}</h3>
                    <p>{this.props.data.name}</p>
                    <div className="bagAdd">
                        <a href="" onClick={this.addItem}><i className="fa fa-plus-square-o" aria-hidden="true"></i></a> 
                    </div> 
                    <p className="visuallyHidden">{this.props.data.id}</p>
                </div>
            </div>
        )
    }
}


   
export default SearchForm;


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
        
        pageResults(results) {
            let existingIds = [8, 9, 11, 12]

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
                <div>
                    <form action="" onSubmit={this.handleSubmit}>
                        <div className="searchContainer">

                            <div className="brandContainer">
                                <input type="text" name="brand" value={this.state.searchByBrand} onChange={this.handleBrand} />
                            </div>

                            <div className="typeContainer">
                                <input type="text" name="type" value={this.state.searchByType} onChange={this.handleType} />
                            </div>

                            <div className="submitContainer">
                                <input type="submit" name="submit" />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="returnedData">
                    {this.state.results.map((brand, index) => {
                        return <MakeUpProducts data={brand} key={index} />
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
        const dbRef = firebase.database().ref("N5eadjZta9gfwlPBYiKIx2Q1G7v1").child("selections")
        
        const newSelection = {}
        const newRef = dbRef.push(newSelection)
            newRef.set({
                imageUrl: this.props.data.image_link,
                brandTitle: this.props.data.brand,
                productDescription: this.props.data.name,
                productUrl: this.props.data.product_link,
                selectionKey: newRef.key
            });
        }

    render() {
        return (
            <div>
                <a href="" onClick={this.addItem}>TEST</a>
                <img src={this.props.data.image_link} alt="" />
                <h3>{this.props.data.brand}</h3>
                <p>{this.props.data.name}</p>
                <a href={`${this.props.data.product_link}`} target="_blank">Buy Me</a>
                <p>{this.props.data.id}</p>
            </div>
        )
    }
}
   
export default SearchForm

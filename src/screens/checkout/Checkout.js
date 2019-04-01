import React, { Component } from 'react';
import './Checkout.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import * as Utils from "../../common/Utils";

const styles = {}

class Checkout extends Component {

    constructor(){
        super()
        this.state={
            open : false,
            paymentMethods: [],
            stateList : [],
            addressList : []
        }
    }

    componentWillMount(){
        /*
        restaurant_id: this.props.match.params.id,
                    itemList : this.state.addedItemsLists,
                    totalAmount : this.state.totalPrice
                    */
        if (Utils.isUndefinedOrNullOrEmpty(this.props.location.restaurant_id)) {
                this.props.history.push({
                  pathname: "/"
                });
        } else {
               console.log(" Call Api to get Payment and state and addresses")
               this.callApiToGetStateList();
               this.callApiToGetPaymentMethods();
               this.callApiToGetAddressListOfCustomer()
            
        }
    }

    callApiToGetStateList = () => {

        console.log("get State api started")
        let xhrPosts = new XMLHttpRequest();
        let that = this

        xhrPosts.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(JSON.parse(this.responseText));
                let data = JSON.parse(this.responseText);
                that.setState({
                    stateList: data.states
                })
            }
        });
        xhrPosts.open("GET", this.props.baseUrl + "/states");
        xhrPosts.send();
    }

    callApiToGetPaymentMethods = () => {

        console.log("get Payment api started")
        let xhrPosts = new XMLHttpRequest();
        let that = this

        xhrPosts.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(JSON.parse(this.responseText));
                let data = JSON.parse(this.responseText);
                that.setState({
                    paymentMethods: data.paymentMethods
                })
            }
        });
        xhrPosts.open("GET", this.props.baseUrl + "/payment");
        xhrPosts.send();
    }

    callApiToGetAddressListOfCustomer = () => {
        console.log("get Customer Address api started")
        let xhrPosts = new XMLHttpRequest();
        let that = this
        xhrPosts.addEventListener("readystatechange", function () {

            if (this.readyState === 4) {
                console.log(this.responseText.addresses);
                if(Utils.isUndefinedOrNullOrEmpty(this.responseText.addresses)){

                } else {

                }
                console.log(this.status)
                if (this.status === 200) {
                  console.log("success")
                }
                else if (this.status === 401) {
                   //console.log(data.message)
                }
            }
        });
        xhrPosts.open("GET", this.baseUrl + "/address/customer");
        xhrPosts.setRequestHeader('authorization', "Bearer " + sessionStorage.getItem('access-token'));
        xhrPosts.send();
    }

    callApiToSaveAddressOfCustomer = () => {
        let xhrPosts = new XMLHttpRequest();
        let that = this

        var obj = {};
        obj.city = "";
        obj.flat_building_name = "";
        obj.locality = "";
        obj.pincode = "";
        obj.state_uuid = "";

        xhrPosts.addEventListener("readystatechange", function () {

            if (this.readyState === 4) {
                console.log(this.responseText.addresses);
                console.log(this.status)
                if (this.status === 200) {
                  //console.log("success")
                }
                else if (this.status === 401) {
                   //console.log(data.message)
                }
            }
        });
        xhrPosts.open("POST", this.baseUrl + "/address");
        xhrPosts.setRequestHeader('authorization', "Bearer " + sessionStorage.getItem('access-token'));
        xhrPosts.send(obj);
    }
    
    render() {
        return(
            <div>
                 <Header
                    history={this.props.history}
                    showSearchArea={false} />
                    Checkout page
            </div>
        )
    }
}

Checkout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkout);

import React, { Component } from 'react';
import './Details.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import Star from '@material-ui/icons/Star';
import Divider from '@material-ui/core/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Card from "@material-ui/core/Card";
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import { CardContent } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import * as Utils from "../../common/Utils";
import {faStopCircle } from '@fortawesome/free-regular-svg-icons';

const styles = {
    star: {
        color: 'black',
    },
    icon: {
        margin: 10
    },
    card: {
        width: '90%',
        padding: 10,
        height: 'auto'
    },
    button :{
        width : '100%'
    },
    button1 : {
        width: '10%'
    }
};

class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurantDetail: {},
            locality: "",
            categoriesList: [],
            open: false,
            successMessage: "",
            totalNumberOfItems: 0,
            totalPrice: 0
        }
    }

    componentWillMount = () => {
        this.callApiToGetResturantDetail()
    }
    
    callApiToGetResturantDetail = () => {
        let restaurant_id = this.props.match.params.id;
        console.log(this.props.location.categories);
        let xhrPosts = new XMLHttpRequest();
        let that = this

        xhrPosts.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let data = JSON.parse(this.responseText);
                that.setState({
                    restaurantDetail: data,
                    locality: data.address.locality,
                    categoriesList: data.categories
                });
            }
        });

        xhrPosts.open("GET", this.props.baseUrl + "/restaurant/" + restaurant_id);
        xhrPosts.send();
    }

    addButtonHandler = (item_name) =>{
        console.log(item_name)
        this.setState({
            open: true,
            successMessage: "Item added to cart!"
        })
    }
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({ open: false });
    };
    checkoutButtonHandler = () => {
        // if item is empty 
        /*
        this.setState({
            open: true,
            successMessage: "Please add an item to your cart!"
        })
        */
        // Check for Customer logged in or not ....
        var token = sessionStorage.getItem('access-token');
        console.log(token)
        if (Utils.isUndefinedOrNullOrEmpty(token)){
            this.setState({
                open: true,
                successMessage: "Please login first!"
            })
        }
        else {
            console.log('Go to Checkout page')
        }
    }
    render() {
        const { classes } = this.props;

        return (
            <div>
                <Header
                    history={this.props.history}
                    showSearchArea={false} />
                <div className="restaurant-main-container">
                    <div className="restaurant-details-container">
                        <div className="image-container">
                            <img
                                className="restaurant-image"
                                src={this.state.restaurantDetail.photo_URL}
                                alt=""
                            />
                        </div>
                        <div className="information-container">
                            <div className="restaurant-name-container">
                                <div className="restaurant-name">
                                    {this.state.restaurantDetail.restaurant_name}
                                </div>
                            </div>
                            <div className="restaurant-locality-container">
                                <div className="restaurant-locality">
                                    {this.state.locality}
                                </div>
                            </div>

                            <div className="restaurant-categories-container">
                                <div className="restaurant-categories">
                                    {this.props.location.categories}
                                </div>
                            </div>
                            <div className="count-container">
                            <div className="data-container">
                                <div className="rating-details-container">
                                    <div className="rating-details">
                                        <Star className={classes.star} />
                                        <div className="rating-rr">{this.state.restaurantDetail.customer_rating}</div>
                                    </div>
                                    <div className="avg-rating">
                                        AVERAGE RATING BY  <span className="customer-rating">{this.state.restaurantDetail.number_customers_rated}</span>  CUSTOMERS
                                    </div>
                                </div>
                            </div>
                            <div className="data-container">
                                <div className="rating-details-container">
                                     <div className="rating-details"> 
                                            { '\u20B9' + this.state.restaurantDetail.average_price}
                                     </div>
                                     <div className="avg-rating">
                                        AVERAGE COST PER TWO PERSON
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="menu-cart-container">
                     <div className="menu-items-container">
                      {
                        this.state.categoriesList.map(category => (
                            <div key={category.id}>
                                <div className="category-name-container">
                                    {category.category_name}
                                </div>
                                <div className="divider-line">
                                    <Divider variant='fullWidth'/>
                                </div>
                                {category.item_list.map(item => (
                                    <div className="item-container" key={item.id}>
                                        <div className="item-info">
                                            {
                                                item.item_type === "NON_VEG" && 
                                                <FontAwesomeIcon icon={faCircle} className="non-veg"/>
                                            }
                                            {
                                                 item.item_type === "VEG" && 
                                                 <FontAwesomeIcon icon={faCircle} className="veg"/>
                                            }
                                            {item.item_name}
                                        </div>
                                        <div className="price-info">
                                             <span className="spacing">
                                                {'\u20B9' + parseFloat(Math.round(item.price * 100) / 100).toFixed(2)}
                                            </span> 
                                            <IconButton onClick={this.addButtonHandler.bind(this,item.item_name)}>
                                                 <Add />
                                            </IconButton>
                                            
                                        </div>
                                    </div>
                                 ))
                                }
                            </div>
                        ))
                      }
                     </div>
                     <div className="cart-container">
                         <Card className={classes.card}>
                            <CardContent>
                                <div>
                                  <Badge 
                                         badgeContent={this.state.totalNumberOfItems} 
                                         color="primary"
                                         invisible={false}>
                                     <ShoppingCart/>
                                  </Badge> 
                                  <span className="my-cart"> My Cart</span>
                                </div>
                                
                                 <div className="item-list">
                                     <FontAwesomeIcon icon={faStopCircle} className="non-veg"/>
                                     <span className="added-item-name"> Hakka noodles </span>
                                          <button className="button-size"> - </button>
                                          <span className="quantity-label"> 10 </span>
                                          <button className="button-size"> + </button>
                                     <span className="price-label"> {'\u20B9' + parseFloat(Math.round(255 * 100) / 100).toFixed(2)} </span>
                                 </div>
                                 <div className="item-list">
                                     <FontAwesomeIcon icon={faStopCircle} className="non-veg"/>
                                     <span className="added-item-name"> Hakka noodles </span>
                                     <button className="button-size"> - </button>
                                     <span className="quantity-label"> 10 </span>
                                     <button className="button-size"> + </button>
                                     <span className="price-label"> {'\u20B9' + parseFloat(Math.round(10 * 100) / 100).toFixed(2)} </span>
                                 </div>
                                
                                <div className="total-amount-section">
                                    <span> TOTAL AMOUNT </span>
                                    <span className="total-amount"> {'\u20B9' + parseFloat(Math.round(this.state.totalNumberOfItems * 100) / 100).toFixed(2)} </span>
                                </div>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="primary" className={classes.button} onClick={this.checkoutButtonHandler}>
                                    CHECKOUT
                                </Button>
                             </CardActions>
                         </Card>
                     </div>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    onClose={this.handleClose}
                    autoHideDuration={6000}
                    ContentProps={{
                        'aria-describedby': 'message-id'
                    }}
                    message={<span id="message-id"> {this.state.successMessage}</span>}
                    action={[
                        <IconButton
                          key="close"
                          aria-label="Close"
                          color="inherit"
                          className={classes.close}
                          onClick={this.handleClose}
                        >
                          <CloseIcon />
                        </IconButton>
                      ]}
                />
            </div>
        );
    }
}

Details.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Details);
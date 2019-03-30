
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

const styles = {
    star: {
        color: 'black',
    },
    icon: {
        margin: 10
      },
};

class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurantDetail: {},
            locality: "",
            categoriesList: []
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
                         Test
                     </div>
                </div>
            </div>
        );
    }
}

Details.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Details);
import React, { Component } from 'react';
import './Home.css';
import * as Utils from "../../common/Utils";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import Card from "@material-ui/core/Card";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from "@material-ui/core/CardContent";
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Star from '@material-ui/icons/Star';

const styles = {
    card: {
        maxWidth: 300,
        height: 'auto'
    },
    media: {
        height: 140,
        width: '100%',
    },
    cardContent: {
        margin: 'auto',
        maxWidth: 240,
        height: 160
    },
    star: {
        color: 'white',
    },
    rating: {
        color: 'white',
    }
};

class Home extends Component {

    constructor() {
        super();
        this.searchByRestaurantName = this.searchByRestaurantName.bind(this);
        this.state = {
            restaurantData: [],
            filteredRestaurantData: [],
            currentSearchValue: ""
        }
    }
    componentWillMount() {
        this.callApiToGetRestaurantData();
    }
    callApiToGetRestaurantData = () => {
        //GET /restaurant
        let xhrPosts = new XMLHttpRequest();
        let that = this

        xhrPosts.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(JSON.parse(this.responseText));
                let data = JSON.parse(this.responseText);
                that.setState({
                    restaurantData: data.restaurants
                })
            }
        });
        xhrPosts.open("GET", this.props.baseUrl + "/restaurant");
        xhrPosts.send();
    }

    searchByRestaurantName = event => {
        let currentRestaurantData = [...this.state.restaurantData];
        const searchValue = event.target.value;
        console.log(searchValue);
        if(!Utils.isEmpty(searchValue)){
            let searchResults = [];
            for (var restaurant in currentRestaurantData){                
                if (!Utils.isUndefinedOrNull(currentRestaurantData[restaurant].restaurant_name) &&
                    currentRestaurantData[restaurant].restaurant_name.toLowerCase().includes(searchValue.toLowerCase())) {
                        searchResults.push(currentRestaurantData[restaurant])
                }
            }
            this.setState({
                filteredRestaurantData: searchResults,
                currentSearchValue: searchValue
            })
        }
        else {
            this.setState({ currentSearchValue: searchValue });
        }
    };
    cardClickedHandler = (restaurant_id ,restaurant_categories) => {
        console.log(restaurant_id);
        
        this.props.history.push({
            pathname: "/restaurant/" + restaurant_id,
            categories: restaurant_categories
        })
    }

    render() {
        const { classes } = this.props;
        const dataSource = Utils.isUndefinedOrNullOrEmpty(
            this.state.currentSearchValue
          )
            ? this.state.restaurantData
            : this.state.filteredRestaurantData;

        return (
            <div>
                <Header history={this.props.history} 
                        searchByRestaurantName={this.searchByRestaurantName}
                        showSearchArea={true}/>
                <div className="flex-container">
                    {dataSource.map(restaurant => (
                        <Card className={this.props.card} key={restaurant.id}>
                            <CardActionArea onClick={this.cardClickedHandler.bind(this, restaurant.id , restaurant.categories)}>
                                <CardMedia
                                    className={classes.media}
                                    image={restaurant.photo_URL}
                                    title={restaurant.restaurant_name}
                                />
                                <CardContent className={classes.cardContent}>
                                    <div className="card-content-area">
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {restaurant.restaurant_name}
                                        </Typography> 
                                        <Typography component="p">
                                            {restaurant.categories}
                                        </Typography> 
                                        <div className="rating-price-container">
                                            <div className="rating-container">
                                                <Star className={classes.star} />
                                                <Typography className={classes.rating}>
                                                    <span>{restaurant.customer_rating}</span>
                                                </Typography>
                                                <Typography className={classes.rating}>
                                                    <span>{"(" + restaurant.number_customers_rated + ")"}</span>
                                                </Typography>
                                            </div>
                                            <div className="price-container">
                                                <Typography>
                                                    <span>{'\u20B9' + restaurant.average_price + " for two"}</span>
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                    }
                </div>
            </div>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);

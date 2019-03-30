import React, { Component } from 'react';
import './Home.css';
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
        height: 'auto',
    },
    media: {
        height: 140,
        width: '100%',
    },
    cardContent: {
        margin: 'auto',
        maxWidth: 240,
        height: 180
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
                    restaurantData: data
                })
            }
        });
        xhrPosts.open("GET", this.props.baseUrl + "/restaurant");
        xhrPosts.send();
    }

    cardClickedHandler = (restaurant_id) => {
        console.log(restaurant_id);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header history={this.props.history} />
                <div className="flex-container">
                    {this.state.restaurantData.map(restaurant => (
                        <Card className={this.props.card} key={restaurant.restaurants[0].id}>
                            <CardActionArea onClick={this.cardClickedHandler.bind(this,restaurant.restaurants[0].id)}>
                                <CardMedia
                                    className={classes.media}
                                    image={restaurant.restaurants[0].photo_URL}
                                    title={restaurant.restaurants[0].restaurant_name}
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {restaurant.restaurants[0].restaurant_name}
                                    </Typography> <br /><br />
                                    <Typography component="p">
                                        {restaurant.restaurants[0].categories}
                                    </Typography>
                                    <div className="rating-price-container">
                                        <div className="rating-container">
                                            <Star className={classes.star} />
                                            <Typography className={classes.rating}>
                                                <span>{restaurant.restaurants[0].customer_rating}</span>
                                            </Typography>
                                            <Typography className={classes.rating}>
                                                <span>{"(" + restaurant.restaurants[0].number_customers_rated + ")"}</span>
                                            </Typography>
                                        </div>
                                        <div className="price-container">
                                            <Typography>
                                                <span>{'\u20B9'+restaurant.restaurants[0].average_price + " for two"}</span>
                                            </Typography>
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

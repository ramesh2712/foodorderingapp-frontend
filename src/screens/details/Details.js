
import React, { Component } from 'react';
import './Details.css';
import * as Utils from "../../common/Utils";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';

const styles = {};

class Details extends Component {

    constructor(){
        super();
        this.state = {
            restaurantDetail : null
        }
    }

    componentWillMount = () => {
        this.callApiToGetResturantDetail()
    }
    callApiToGetResturantDetail = () => {
        let restaurant_id = this.props.match.params.id;
        console.log(restaurant_id)

        let xhrPosts = new XMLHttpRequest();
        let that = this

        xhrPosts.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(JSON.parse(this.responseText));
                let data = JSON.parse(this.responseText);
            }
        });
        xhrPosts.open("GET", this.props.baseUrl + "/restaurant/"+restaurant_id);
        xhrPosts.send();
    }

    render(){
        return(
            <div>
                <Header 
                     history={this.props.history}
                     showSearchArea={false}/>
                Details Page
            </div>
        );
    }
}

Details.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Details);
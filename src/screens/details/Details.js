
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
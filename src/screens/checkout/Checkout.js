import React, { Component } from 'react';
import './Checkout.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';

const styles = {}

class Checkout extends Component {

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
import React, { Component } from 'react';
import './Checkout.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import * as Utils from "../../common/Utils";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

const styles = {
    root: {
        width: '98%'
    },
    button: {
        marginTop: 50,
        marginRight: 20,
    },
    actionsContainer: {
        marginBottom: 30,
    }
}

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 8 * 2}}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Checkout extends Component {

    constructor() {
        super();
        this.state = {
            open: false,
            paymentMethods: [],
            stateList: [],
            addressList: [],
            activeStep: 0,
            value: 0
        }
    }


    componentWillMount() {
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
                if (Utils.isUndefinedOrNullOrEmpty(this.responseText.addresses)) {
                    that.setState({
                        addressList : []
                    })
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

    getSteps() {
        return ['Delivery', 'Payment'];
    }

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    }

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    }

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };
    
    getStepContent(step) {
        switch (step) {
          case 0:
            return `For each ad campaign that you create, you can control how much
                    you're willing to spend on clicks and conversions, which networks
                    and geographical locations you want your ads to show on, and more.`;
          case 1:
            return 'An ad group contains one or more ads which target a shared set of keywords.';
          case 2:
            return `Try out different ad text to see what brings in the most customers,
                    and learn how to enhance your ads using features like ad extensions.
                    If you run into any problems with your ads, find out how to tell if
                    they're running and how to resolve approval issues.`;
          default:
            return 'Unknown step';
        }
      }
    render() {
        const { classes } = this.props;
        const steps = this.getSteps();
        const { activeStep } = this.state;
        const { value } = this.state;

        return (
            <div>
                <Header
                    history={this.props.history}
                    showSearchArea={false} />
                <div className="checkout-main-container">
                    <div className="checkout-container">
                        <div className={classes.root}>
                            <Stepper activeStep={activeStep} orientation="vertical">
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <StepContent>
                                            {index === 0 && 
                                               <div>
                                                 <AppBar position="static">
                                                   <Tabs value={value} onChange={this.handleChange}>
                                                     <Tab label="Existing Address" />
                                                     <Tab label="New Address" />
                                                   </Tabs>
                                                 </AppBar>
                                                 { value === 0 && 
                                                    <TabContainer>
                                                        {
                                                            this.state.addressList.length === 0 &&
                                                            <Typography>
                                                                There are no saved addresses! You can save an address using the 'New Address' tab or using your ‘Profile’ menu option.
                                                            </Typography>
                                                        }
                                                       
                                                    </TabContainer>
                                                 }
                                                 { value === 1 && 
                                                    <TabContainer>New Address</TabContainer>
                                                 }
                                               </div>
                                            }
                                            <div className={classes.actionsContainer}>
                                                <div>
                                                    <Button
                                                        disabled={activeStep === 0}
                                                        onClick={this.handleBack}
                                                        className={classes.button}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={this.handleNext}
                                                        className={classes.button}
                                                    >
                                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                    </div>
                    <div className="summary-container">
                        Summary Page
                    </div>
                </div>
            </div>
        )
    }
}

Checkout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkout);
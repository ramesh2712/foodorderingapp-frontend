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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
    root: {
        width: '98%'
    },
    button: {
        marginTop: 30,
        marginRight: 20,
    },
    actionsContainer: {
        marginBottom: 30,
    },
    formControl: {
        width: "28%"
    }
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 8 * 2 }}>
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
            value: 0,
            flatBuildingNo: "",
            locality: "",
            city: "",
            state: "",
            pincode: "",
            flatBuildingNoRequired: "dispNone",
            localityRequired: "dispNone",
            cityRequired: "dispNone",
            stateRequired: "dispNone",
            pincodeRequired:"dispNone",
            validPincode : false
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
                        addressList: []
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
        obj.city = this.state.city;
        obj.flat_building_name = this.state.flatBuildingNo;
        obj.locality = this.state.locality;
        obj.pincode = this.state.pincode;
        for (let stateObj of this.state.stateList){
            if(stateObj.state_name === this.state.state){
                obj.state_uuid = this.stateObj.id;
                break;
            }
        }

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
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    handleOpen = () => {
        this.setState({ open: true });
    }
    
    inputFlatNumberChangeHandler = (e) => {
        this.setState({
            flatBuildingNo: e.target.value
        })
    }
    inputLocalityChangeHandler = (e) => {
        this.setState({
            locality: e.target.value
        })
    }
    inputCityChangeHandler = (e) => {
        this.setState({
            city: e.target.value
        })
    }
    inputStateChangeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    inputPincodeChangeHandler = (e) => {
        this.setState({
            pincode: e.target.value
        })
    }

    saveAddressHandler = () => {
        console.log("Save Address Clicked")
        this.state.flatBuildingNo === "" ? this.setState({ flatBuildingNoRequired: "dispBlock" }) : this.setState({ flatBuildingNoRequired: "dispNone" })
        this.state.locality === "" ? this.setState({ localityRequired: "dispBlock" }) : this.setState({ localityRequired: "dispNone" })
        this.state.state === "" ? this.setState({ stateRequired: "dispBlock" }) : this.setState({ stateRequired: "dispNone" })
        this.state.city === "" ? this.setState({ cityRequired: "dispBlock" }) : this.setState({ cityRequired: "dispNone" })

        let validPincodeNumber = this.pincodeValidation()
        if (validPincodeNumber === true && this.state.flatBuildingNo !== ""  &&
             this.state.locality !== "" && this.state.state !== "" && this.state.city !== "") {
                this.callApiToSaveAddressOfCustomer()
        }
    }

    pincodeValidation = () => {
        let isValidPincode = false;
        if (this.state.pincode === "") {
            this.setState({
                pincodeRequired: "dispBlock",
                validPincode: true
            })
        } else {
            // Check for Valid mobile no ...
            if (this.state.pincode.length === 6) {
                isValidPincode = true
                this.setState({
                    validPincode: true,
                    pincodeRequired: "dispNone"
                })
            } else {
                this.setState({
                    validPincode: false,
                    pincodeRequired: "dispBlock"
                })
            }
        }
        return isValidPincode
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
                                                    {value === 0 &&
                                                        <TabContainer>
                                                            {
                                                                this.state.addressList.length === 0 &&
                                                                <Typography>
                                                                    There are no saved addresses! You can save an address using the 'New Address' tab or using your ‘Profile’ menu option.
                                                            </Typography>
                                                            }

                                                        </TabContainer>
                                                    }
                                                    {value === 1 &&
                                                        <TabContainer>
                                                            <FormControl required className={classes.formControl}>
                                                                <InputLabel htmlFor="flatnumber"> Flat / Building No.</InputLabel>
                                                                <Input id="flatnumber" type="text" flatnumber={this.state.flatBuildingNo} onChange={this.inputFlatNumberChangeHandler} />
                                                                <FormHelperText className={this.state.flatBuildingNoRequired}>
                                                                    <span className="red">required</span>
                                                                </FormHelperText>
                                                            </FormControl> <br /> <br />
                                                            <FormControl className={classes.formControl}>
                                                                <InputLabel htmlFor="locality"> Locality </InputLabel>
                                                                <Input id="locality" type="text" locality={this.state.locality} onChange={this.inputLocalityChangeHandler} />
                                                                <FormHelperText className={this.state.localityRequired}>
                                                                    <span className="red">required</span>
                                                                </FormHelperText>
                                                            </FormControl> <br /> <br />
                                                            <FormControl required className={classes.formControl}>
                                                                <InputLabel htmlFor="city"> City </InputLabel>
                                                                <Input id="city" type="text" city={this.state.city} onChange={this.inputCityChangeHandler} />
                                                                <FormHelperText className={this.state.cityRequired}>
                                                                        <span className="red">required</span>
                                                                </FormHelperText>
                                                            </FormControl> <br /> <br />
                                                            <FormControl required className={classes.formControl}>
                                                                <InputLabel htmlFor="state"> State</InputLabel>
                                                                <Select 
                                                                     open={this.state.open}
                                                                     onClose={this.handleClose}
                                                                     onOpen={this.handleOpen}
                                                                     value={this.state.state}
                                                                     onChange={this.inputStateChangeHandler}
                                                                     inputProps={{
                                                                        name: 'state',
                                                                        id: 'demo-controlled-open-select',
                                                                      }}
                                                                      MenuProps={MenuProps}
                                                                 >
                                                                    {this.state.stateList.map(state => (
                                                                        <MenuItem key={state.id} value={state.state_name}>
                                                                          {state.state_name}
                                                                        </MenuItem>
                                                                     ))}
                                                               </Select>
                                                                <FormHelperText className={this.state.stateRequired}>
                                                                     <span className="red">required</span>
                                                                </FormHelperText>
                                                            </FormControl> <br /> <br />
                                                            <FormControl required className={classes.formControl}>
                                                                <InputLabel htmlFor="pincode"> Pincode </InputLabel>
                                                                <Input id="pincode" type="text" pincode={this.state.pincode} onChange={this.inputPincodeChangeHandler} />
                                                                <FormHelperText className={this.state.pincodeRequired}>
                                                                    {this.state.validPincode === true && <span className="red">required</span>}
                                                                    {this.state.validPincode === false && <span className="red">Pincode must contain only numbers and must be 6 digits long</span>}
                                                                </FormHelperText>
                                                            </FormControl> <br /> <br />
                
                                                            <Button variant="contained" color="secondary" onClick={this.saveAddressHandler} className={classes.loginButton}> SAVE ADDRESS
                                                            </Button>
                                                        </TabContainer>
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
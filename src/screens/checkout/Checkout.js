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
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Snackbar from '@material-ui/core/Snackbar';
import CardActions from '@material-ui/core/CardActions';

const styles = {
    root: {
        width: '100%'
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
    },
    gridListMain: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        width: '100%'
    },
    titleBar: {
        background: 'white',
        marginRight: 60
    },
    group: {
        margin: `10px 0`,
    },
    resetContainer: {
        padding: 20,
    },
    button1 :{
        width : '100%'
    },
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
            pincodeRequired: "dispNone",
            validPincode: false,
            addressId: '',
            selectedPayment: 'none',
            
        }
    }


    componentWillMount() {
        /*
        restaurant_id: this.props.match.params.id,
                    itemList : this.state.addedItemsLists,
                    totalAmount : this.state.totalPrice
                    */
        console.log(this.props.location.restaurant_id)
        console.log(this.props.location.restaurant_name)
        console.log(this.props.location.totalAmount)
        console.log(this.props.location.itemList)

        if (Utils.isUndefinedOrNullOrEmpty(this.props.location.restaurant_id)) {
            this.props.history.push({
                pathname: "/"
            });
        } else {
            console.log(" Call Api to get Payment and state and addresses")
            this.callApiToGetStateList();
            this.callApiToGetPaymentMethods();
            this.callApiToGetAddressListOfCustomer();
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
                console.log(JSON.parse(this.responseText).addresses);
                let addressList = JSON.parse(this.responseText).addresses;
                console.log(addressList)
                if (Utils.isUndefinedOrNullOrEmpty(addressList)) {
                    that.setState({
                        addressList: []
                    })
                } else {
                    if (this.status === 200) {
                        that.setState({
                            addressList: addressList
                        })
                    }
                }
            }
        });
        xhrPosts.open("GET", this.props.baseUrl + "/address/customer");
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

        for (let stateObj of this.state.stateList) {
            if (stateObj.state_name === this.state.state) {
                obj.state_uuid = stateObj.id;
                break;
            }
        }
        console.log(JSON.stringify(obj))
        xhrPosts.addEventListener("readystatechange", function () {

            if (this.readyState === 4) {
                console.log(this.responseText);
                console.log(this.status)
                if (this.status === 201) {
                    that.callApiToGetAddressListOfCustomer();
                }
            }
        });
        xhrPosts.open("POST", this.props.baseUrl + "/address");
        xhrPosts.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhrPosts.setRequestHeader('authorization', "Bearer " + sessionStorage.getItem('access-token'));
        xhrPosts.send(JSON.stringify(obj));
    }

    getSteps() {
        return ['Delivery', 'Payment'];
    }

    handleNext = () => {
        // Check for Address selected
        if(this.state.addressId !== ''){
            this.setState(state => ({
                activeStep: state.activeStep + 1,
            }));
        }
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
        if (validPincodeNumber === true && this.state.flatBuildingNo !== "" &&
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

    // Set Address 
    checkAddressHandler = (address) => {
        console.log(address.id)
        this.setState({
            addressId: address.id
        })
    }

    // Set Payment 
    placeOrderHandler = () => {
        console.log('place order')
    }
    checkPaymentHandler = (event) => {
        console.log(event.target.value)
        this.setState({ selectedPayment: event.target.value });
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
                                                            {
                                                                this.state.addressList.length !== 0 &&
                                                                <div>
                                                                    <GridList className={classes.gridListMain} cols={3}>
                                                                        {this.state.addressList.map(address => (
                                                                            <GridListTile key={address.id}>
                                                                                <Typography component="p">{address.flat_building_name}</Typography>
                                                                                <Typography component="p">{address.locality}</Typography>
                                                                                <Typography component="p">{address.city}</Typography>
                                                                                <Typography component="p">{address.pincode}</Typography>
                                                                                <Typography component="p">{address.state.state_name}</Typography>
                                                                                <GridListTileBar
                                                                                    classes={{
                                                                                        root: classes.titleBar
                                                                                    }}
                                                                                    actionIcon={
                                                                                        <IconButton onClick={this.checkAddressHandler.bind(this, address)}>
                                                                                            {this.state.addressId === address.id &&
                                                                                                <CheckCircle style={{ color: 'green' }} />
                                                                                            }
                                                                                            {this.state.addressId !== address.id &&
                                                                                                <CheckCircle style={{ color: 'grey' }} />
                                                                                            }
                                                                                        </IconButton>
                                                                                    }
                                                                                />
                                                                            </GridListTile>
                                                                        ))
                                                                        }
                                                                    </GridList>
                                                                </div>
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
                                            {
                                                index === 1 &&
                                                <div className="payment-container">
                                                    <FormControl component="fieldset" className={classes.formControl}>
                                                        <FormLabel component="legend" className="payment-container">Select Mode of Payment</FormLabel>
                                                        <RadioGroup
                                                            aria-label="Payment"
                                                            name="payment"
                                                            className={classes.group}
                                                            value={this.state.selectedPayment}
                                                            onChange={this.checkPaymentHandler}
                                                        >
                                                            {
                                                                this.state.paymentMethods.map( payment => (
                                                                    <FormControlLabel value={payment.payment_name} control={<Radio />} label={payment.payment_name}  key={payment.id}/>
                                                                ))
                                                             }                                                            
                                                        </RadioGroup>
                                                    </FormControl>
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
                            {activeStep === steps.length && (
                             <Paper square elevation={0} className={classes.resetContainer}>
                                <Typography >View the summary and place your order now!</Typography>
                                 <Button onClick={this.handleReset} className={classes.button}>
                                           Change
                                </Button>
                             </Paper>
                            )}
                        </div>
                    </div>
                    <div className="summary-container">
                        <Card className="cardStyle">
                            <CardContent>
                                <Typography variant="headline" component="h2">
                                    Summary
                                </Typography>
                                <div className="res-name">
                                    <Typography >
                                         <span className="summery-info">   {this.props.location.restaurant_name} </span>
                                    </Typography>
                                </div>
                                <div className="amount-container">
                                    <span className="net-amount-label"> Net Amount </span>
                                    <span className="net-amount-label"> {'\u20B9' + parseFloat(Math.round(this.props.location.totalAmount * 100) / 100).toFixed(2)} </span>
                                </div>
                           </CardContent>
                           <CardActions>
                                <Button variant="contained" color="primary" className={classes.button1} onClick={this.placeOrderHandler}>
                                    PLACE ORDER
                                </Button>
                             </CardActions>
                         </Card>
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
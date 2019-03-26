import React, { Component } from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import { SvgIcon, withStyles } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Fastfood from '@material-ui/icons/Fastfood';
import Search from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
    root: {
        color: '#fff',
        width: '320px',
        fontSize: 15,
        '&:after': {
            // The MUI source seems to use this but it doesn't work
            borderBottom: '1px solid white',
        },
    }
})

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: "center" }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {

    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            value: 0,
            contactNoRequired: "dispNone",
            contactno: "",
            passwordRequired: "dispNone",
            password: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            email: ""
        };
    }
    openModalHandler = () => {
        this.setState({ modalIsOpen: true })
    }
    closeModalHandler = () => {
        this.setState({ modalIsOpen: false })
        // Login 
        this.setState({ contactNoRequired: "dispNone" })
        this.setState({ passwordRequired: "dispNone" })
        this.setState({ value: 0 })
       // Signup
        this.setState({ emailRequired: "dispNone"})
        this.setState({ firstnameRequired: "dispNone"})
    }
    tabChangeHandler = (event, value) => {
        this.setState({ value });
    }
    loginClickHandler = () => {
        this.state.contactno === "" ? this.setState({ contactNoRequired: "dispBlock" }) : this.setState({ contactNoRequired: "dispNone" })
        this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" })
    }
    signupClickHandler = () => {
        this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" })
        this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" })
        this.state.contactno === "" ? this.setState({ contactNoRequired: "dispBlock" }) : this.setState({ contactNoRequired: "dispNone" })
        this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" })
    }
    inputContactnoChangeHandler = (e) => {
        this.setState({
            contactno: e.target.value
        })
    }
    inputPasswordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    inputFirstnameChangeHandler = (e) => {
        this.setState({
            firstname: e.target.value
        })
    }
    inputLastnameChangeHandler = (e) => {
        this.setState({
            lastname: e.target.value
        })
    }
    inputEmailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <header className="app-header">
                    <div>
                        <SvgIcon className="app-logo">
                            <Fastfood />
                        </SvgIcon>
                    </div>
                    <div>
                        <Input className={classes.root}
                            id="input-with-icon-adornment"
                            startAdornment={
                                <InputAdornment position="start" className="search">
                                    <SvgIcon>
                                        <Search />
                                    </SvgIcon>
                                </InputAdornment>
                            }
                            placeholder="Search by Restaurant Name"
                        />
                    </div>
                    <div className="login-button">
                        <Button variant="contained" color="default" onClick={this.openModalHandler} >
                            <SvgIcon>
                                <AccountCircle />
                            </SvgIcon>
                            <span className="login-spacing">Login</span>
                        </Button>
                    </div>
                </header>
                <Modal ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}>
                    <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="LOGIN" />
                        <Tab label="SIGNUP" />
                    </Tabs>
                    {this.state.value === 0 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="contactno"> Contact No.</InputLabel>
                                <Input id="contactno" type="text" contactno={this.state.contactno} onChange={this.inputContactnoChangeHandler} />
                                <FormHelperText className={this.state.contactNoRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl> <br /> <br />
                            <FormControl required>
                                <InputLabel htmlFor="password"> Password</InputLabel>
                                <Input id="password" type="password" password={this.state.password} onChange={this.inputPasswordChangeHandler} />
                                <FormHelperText className={this.state.passwordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl> <br /> <br />
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}> LOGIN
                            </Button>
                        </TabContainer>
                    }
                    {this.state.value === 1 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="firstname"> First Name </InputLabel>
                                <Input id="firstname" type="text" firstname={this.state.firstname} onChange={this.inputFirstnameChangeHandler} />
                                <FormHelperText className={this.state.firstnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl> <br /> <br />
                            <FormControl>
                                <InputLabel htmlFor="lastname"> Last Name </InputLabel>
                                <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.inputLastnameChangeHandler} />
                            </FormControl> <br /> <br />
                            <FormControl required>
                                <InputLabel htmlFor="email"> Email </InputLabel>
                                <Input id="email" type="text" lastname={this.state.email} onChange={this.inputEmailChangeHandler} />
                                <FormHelperText className={this.state.emailRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl> <br /> <br />
                            <FormControl required>
                                <InputLabel htmlFor="contactno"> Contact No.</InputLabel>
                                <Input id="contactno" type="text" contactno={this.state.contactno} onChange={this.inputContactnoChangeHandler} />
                                <FormHelperText className={this.state.contactNoRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl> <br /> <br />
                            <FormControl required>
                                <InputLabel htmlFor="password"> Password</InputLabel>
                                <Input id="password" type="password" password={this.state.password} onChange={this.inputPasswordChangeHandler} />
                                <FormHelperText className={this.state.passwordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl> <br /> <br />
                            <Button variant="contained" color="primary" onClick={this.signupClickHandler}> SIGNUP
                            </Button>
                        </TabContainer>
                    }
                </Modal>
            </div>
        )
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Header);
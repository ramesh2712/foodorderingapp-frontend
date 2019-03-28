import React, {Component} from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import { SvgIcon, withStyles } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Fastfood from '@material-ui/icons/Fastfood';
import Search from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';

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
class Header extends Component {

    render(){
        const { classes } = this.props;

        return(
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
                         <Button variant="contained" color="default" > 
                         <SvgIcon>
                             <AccountCircle />
                         </SvgIcon>
                            <span className="login-spacing">Login</span> 
                         </Button>
                    </div>
                </header>
            </div>
        )
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Header);
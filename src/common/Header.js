import React, {Component} from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import { SvgIcon } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

class Header extends Component {

    render(){
        return(
            <div>
                <header className="app-header">
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

export default Header;
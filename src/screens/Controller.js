import React, {Component} from 'react';
import Home from '../screens/home/Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class Controller extends Component{
constructor(){
    super();
    this.baseUrl = 'http://192.168.29.233:8080';
}

    render(){
        return(
            <Router>
                <div className="main-container">
             <Route exact path='/' render={(props) => <Home {...props} baseUrl = {this.baseUrl}/> }/>

                
                </div>

            </Router>



        )
    }
}

export default Controller;
import React , {Component} from 'react';
import './Home.css';
import Header from '../../common/header/Header';

class Home extends Component{
    render(){
        return (
              <div>
                 <Header history={this.props.history}/>
              </div>
        )
    }
}

export default Home;
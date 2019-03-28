import React, {Component} from 'react';
import Header from '../../common/header/Header'
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import './Home.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { CardMedia } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import 'font-awesome/css/font-awesome.min.css';


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    upcomingMoviesHeading: {
        textAlign: 'center',
        background: '#ff9999',
        padding: '8px',
        fontSize: '1rem'
    },
    gridListUpcomingMovies: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        width: '100%'
    },
    gridListMain: {

        display: "flex",
        transform: 'translateZ(0)',
        cursor: 'pointer',
        border: "1px solid rgba(0,0,0,.3)",
        padding: theme.spacing.unit * 2,
        margin: theme.spacing.unit * 4,
    },
    title: {
        color: theme.palette.primary,
        fontSize: 18
        
    }

})

class Home extends Component{

    constructor(){
        super();
        this.state ={
            restaurants: [{}]
                           
        }
        
    }

    componentWillMount(){
        let data =null ;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange",function(){
            if(this.readyState === 4){
                console.log(JSON.parse(this.responseText));
               // that.setState({restuarantsList : JSON.parse(this.responseText).restaurants});
                that.setState({restaurants:JSON.parse(this.responseText).restaurants});

            }
        })
          console.log(this.state.restaurants);
        xhr.open("GET",this.props.baseUrl + "/api/restaurant");
        xhr.setRequestHeader("cache-control","no-cache");
        xhr.send(data);
    }
    render(){
        const {classes} = this.props;
        return(
            <div>
                <Header />

                 <div className="flex-container">
                 <GridList cellHeight={800} cols={4} className={classes.gridListMain}>
                            {this.state.restaurants.map(movie => (
                                <GridListTile key={"grid" + movie.id}>
                                <Card className = "cardtyle1">
                                    <CardMedia>
                                    <img src={movie.photo_URL} className="card-poster" alt={movie.restaurant_name} />
                                    </CardMedia>

                                    <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {movie.restaurant_name}
                                     </Typography>

                                     <Typography className = {classes.title}>
                                        {movie.categories}
                                     </Typography>
                                   
                                   
                                   <Typography variant="subheading" gutterBottom>
                                   <span className = "yellow">{movie.customer_rating}({movie.number_customers_rated})</span>
                                   <span className="rightAlign">{movie.average_price} for two</span>
                                     </Typography>
                                   
                                
                                 </CardContent>
                                </Card>
                                    
                                   
                                </GridListTile>
                            ))}
                        </GridList>
                        
                    </div>
                   
            </div>

        )
    }
}

export default withStyles(styles)(Home);
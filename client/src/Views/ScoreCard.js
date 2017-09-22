import React from 'react'
import '../App.css';
import axios from 'axios';

class ScoreCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      player: true
    };
  }

  componentDidMount() {
    var upperClass = this;
    console.log(upperClass)
    axios.get('/players/' + upperClass.props.name)
      .then(function (response) {
        console.log(response.data);
        upperClass.state.player = response.data;
        upperClass.forceUpdate();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <h5>Number of votes:</h5>{this.state.player.numRatings}
        <h5>Score:</h5>{this.state.player.score}
      </div>
    );
  }
}

export default ScoreCard;
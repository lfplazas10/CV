import React from 'react'
import '../App.css';
import '../CSS/Table.css';
import '../CSS/stars.css';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';

class ScoreCard extends React.Component {
  state = {player: true};
  componentDidMount(){
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
  render (){
    return (
      <div>
        <h5>Number of votes:</h5>{this.state.player.numRatings}
        <h5>Score:</h5>{this.state.player.score}
      </div>
    );
  }
}

class PlayerStatsView extends React.Component {
  state = {users: [], voted:false, statistics : {}, confirmAlert:null, errorAlert:null}

  componentDidMount() {
    fetch('/players/' + this.props.params.name.split(' ')[1] + ' ' + this.props.params.name.split(' ')[0].charAt(0) + '.' + '/Results')
      .then(res => res.json())
      .then(users => this.setState({users}));
    var upperClass = this;
    axios.get('/players/' + this.props.params.name.split(' ')[1] + ' ' + this.props.params.name.split(' ')[0].charAt(0) + '.' + '/statistics')
      .then(function (response) {
        console.log(response.data)
        upperClass.state.statistics = response.data;
        upperClass.forceUpdate();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleSelectOption(e){
    console.log("JOJO")
    if (this.state.voted === true){
      this.setState({
        errorAlert: null
      });
      this.forceUpdate();
      console.log('Sorry, you already voted');
    }
    else{
      var rate = {
        score: e.target.value,
        name:this.props.params.name
      }
      var upperClass = this;
      axios.post('/rate', rate)
        .then(function (response) {
          upperClass.state.confirmAlert = true;
          upperClass.forceUpdate();
        })
        .catch(function (error) {
          console.log(error);
        });
      this.state.voted = true;
    }
  }

  hideAlertSend() {
    console.log('Hiding alert...');
    this.setState({
      confirmAlert: null
    });
    this.forceUpdate();
  }

  render() {
    return (

      <div className="App">
         { this.state.confirmAlert ? <SweetAlert title="Vote recorded!" onConfirm={() => this.hideAlertSend()} /> : null }
        <section id="playerCardSection">
          <div className="container py-3">
            <div className="card">
              <div className="row ">
                <div className="col-md-4">
                  <img style={{maxWidth: 300}}
                       src={this.props.location.query.url}
                       className="w-100"></img>
                </div>
                <div className="col-md-8 px-3">
                  <div className="card-block px-3">
                    <h2 className="card-title">{this.props.routeParams.name}</h2>
                    <p className="card-text">
                      <h5>Average sets won per match:</h5>{this.state.statistics.averageWonSets}
                      <h5>Average Bet365 quote:</h5>{this.state.statistics.averageBet}
                      <h5>Total wins in the season:</h5>{this.state.statistics.wonCount}
                    </p>
                    <p className="card-text"></p>
                  </div>
                  <br/>
                  <div className="row">
                      <div className="col-md-3 px-1">
                      { this.state.voted == false ? 
                      <h5 style={{marginTop : 12+'px'}}>Rate this player:</h5>
                      : null } 
                      </div>
                    { this.state.voted == false ? 
                      <div className="col-md-5 px-1">
                       <fieldset className="rating" onChange={this.handleSelectOption.bind(this)}>
                        <input type="radio" id="star5" name="rating" value="5" /><label className = "full" htmlFor="star5" title="Awesome - 5 stars"></label>
                        <input type="radio" id="star4half" name="rating" value="4.5" /><label className="half" htmlFor="star4half" title="Pretty good - 4.5 stars"></label>
                        <input type="radio" id="star4" name="rating" value="4" /><label className = "full" htmlFor="star4" title="Pretty good - 4 stars"></label>
                        <input type="radio" id="star3half" name="rating" value="3.5" /><label className="half" htmlFor="star3half" title="Meh - 3.5 stars"></label>
                        <input type="radio" id="star3" name="rating" value="3" /><label className = "full" htmlFor="star3" title="Meh - 3 stars"></label>
                        <input type="radio" id="star2half" name="rating" value="2.5" /><label className="half" htmlFor="star2half" title="Kinda bad - 2.5 stars"></label>
                        <input type="radio" id="star2" name="rating" value="2" /><label className = "full" htmlFor="star2" title="Kinda bad - 2 stars"></label>
                        <input type="radio" id="star1half" name="rating" value="1.5" /><label className="half" htmlFor="star1half" title="Meh - 1.5 stars"></label>
                        <input type="radio" id="star1" name="rating" value="1" /><label className = "full" htmlFor="star1" title="Sucks big time - 1 star"></label>
                        <input type="radio" id="starhalf" name="rating" value="0.5" /><label className="half" htmlFor="starhalf" title="Sucks big time - 0.5 stars"></label>
                        </fieldset>
                      </div>  
                      : null }  
                      { this.state.voted == true ? <ScoreCard name={this.props.params.name}/> : null }            
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/*TABLE*/}
        <table className="table-fill">
          <thead>
          <tr>
            <th className="text-left">Tournament</th>
            <th className="text-left">Series</th>
            <th className="text-left">Round</th>
            <th className="text-left">Surface</th>
            <th className="text-left">VS</th>
            <th className="text-left">Score</th>
          </tr>
          </thead>
          <tbody className="table-hover">
          {this.state.users.map((user, i) =>
            <tr>
              <td className="text-left">{user.Tournament}</td>
              <td className="text-left">{user.Series}</td>
              <td className="text-left">{user.Round}</td>
              <td className="text-left">{user.Surface}</td>
              {(() => {
                if (user.Winner === this.props.params.name.split(' ')[1]+' '+this.props.params.name.split(' ')[0].charAt(0)+'.')
                  return <td className="text-left">{user.Loser}</td>
                else
                  return <td className="text-left">{user.Winner}</td>
              })()}
              {(() => {
                var score ='';
                // if (user.Winner === this.props.params.name.split(' ')[1] + ' ' + this.props.params.name.split(' ')[0].charAt(0) + '.') {
                  //Player Lost
                  if (user.W1)
                    score += user.W1 + '-' + user.L1 + ' ';
                  if (user.W2)
                    score += user.W2 + '-' + user.L2 + ' ';
                  if (user.W3)
                    score += user.W3 + '-' + user.L3 + ' ';
                  if (user.W4)
                    score += user.W4 + '-' + user.L4 + ' ';
                  if (user.W5)
                    score += user.W5 + '-' + user.L5;
                // }
                return <td className="text-left">{score}</td>
              })()}
            </tr>
          )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PlayerStatsView;
import React from 'react'
import '../App.css';
import '../PlayerStats.css';
import SearchPlayer from './SearchPlayer.js'
import AddPlayers from './AddPlayers.js'

class PlayersView extends React.Component {

  constructor (props){
    super(props);
    this.state = {
      users:[]
    }
  }

  componentDidMount() {
    fetch('/players')
      .then(res => res.json())
      .then(users => this.setState({users}));
  }

  render() {
    console.log(this.state.users)
    return (
      <div>
        <div className="App">
          <header className="jumbotron my-4" style={{marginBottom: 5 + 'px', paddingBottom: 5 + 'px'}}>
            <h1 className="display-3">TenniStats</h1>
            <p className="lead">Find the statistics of your favorite tennis players. Just search any player
              and get its latest
              games statistics. You will get the information of all the tennis tournaments in 2016!</p>
          </header>

          <SearchPlayer></SearchPlayer>
          <br/>
          <h3>All players: </h3>
          <div className="row text-center">
            {this.state.users.map((user, i) =>
              <AddPlayers key={i} name={user.name} url={user.url} points={user.points} age={user.age}/>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default PlayersView

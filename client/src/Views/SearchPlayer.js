import React from 'react'
import '../App.css';
import '../PlayerStats.css';
import ReactDOM from 'react-dom'
import axios from 'axios';
import AddPlayers from './AddPlayers.js'

class SearchPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.players = [];
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setPlayers(players) {
    this.players = players
    this.render();
    this.forceUpdate();
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    var upperClass = this;
    if (event.target.value === '') {
    } else {
      axios.get('/search/' + event.target.value)
        .then(function (response) {
          upperClass.setPlayers(response.data)
        })
        .catch(function (error) {
          console.log(error);
        });
      event.preventDefault();
    }

  }

  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.value);
    var upperClass = this;
    axios.get('/search/' + this.state.value)
      .then(function (response) {
        upperClass.setPlayers(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
    event.preventDefault();
  }

  render() {
    if (this.state.value === '') {
      return (
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-md-10">
                <input type="text" className="form-control" value={this.state.value}
                       onChange={this.handleChange} placeholder="Type players name"/>
              </div>
              <div className="col-md-1">
                <input type="submit" className="btn btn-primary" value="Search player"/>
              </div>
            </div>
          </form>

        </div>
      );
    } else {
      return (
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-md-10">
                <input type="text" className="form-control" value={this.state.value}
                       onChange={this.handleChange} placeholder="Type players name"/>
              </div>
              <div className="col-md-1">
                <input type="submit" className="btn btn-primary" value="Search player"/>
              </div>
            </div>
          </form>
          <br/>
          <div className="row text-center">
            {this.players.map((user, i) =>
              <AddPlayers key={i} name={user.name} url={user.url} points={user.points} age={user.age}/>
            )}
          </div>
        </div>
      );
    }
  }
}

ReactDOM.render(
  <SearchPlayer/>,
  document.getElementById('root')
);

export default SearchPlayer;
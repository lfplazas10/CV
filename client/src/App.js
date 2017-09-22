import React, {Component} from 'react';
import './App.css';
import './PlayerStats.css';
import {Router, Route, hashHistory} from 'react-router'
import PlayersView from './Views/PlayersView.js'
import PlayerStatsView from './Views/PlayerStatsView.js'

class App extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={PlayersView}/>
        <Route path='/:name/stats' component={PlayerStatsView}/>
        <Route path='*' component={NotFound}/>
      </Router>
    )
  }
}

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

export default App;
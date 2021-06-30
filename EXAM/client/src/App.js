import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header'; //Include Heder
import Footer from './Footer'; //Include Footer
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
class App extends React.Component {
  
  render() {
    return (
      <React.Fragment>
      <Router>
        <NavigationBar />
      </Router>
    </React.Fragment>
   )
  };
}
export default App;
import React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Home from './components/home/Home'
import ProductDetail from './components/product/ProductDetail';
import CategoryList from './components/category/CategoryList';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/products/:id' component={ProductDetail} />
          <Route exact path='/categories' component={CategoryList} />
          {/*<Route exact path='/register' component={Register} />
          <Route exact path='/ShoppingCart' component={ShoppingCart} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/orders" component={Order} />
  <Route exact path='/login' component={Login} />*/}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

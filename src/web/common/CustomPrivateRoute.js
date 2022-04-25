import React from 'react';
import {  Route } from 'react-router-dom';
import Login from 'web/page/Login'

const CustomPrivateRoute = ({ component: Component, path, isLogin}) => {

    return (
        <Route exact path={path} element={isLogin ? <Component /> : <Login />} />
    );

}

export default CustomPrivateRoute;
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import React from 'react';

import AdminLayout from "./layouts/Admin.js";
import ChildLayout from "./layouts/Child.js"
import Welcome from "./components/Welcome/Welcome.js";
import Login from "./components/Login/login.js";
import { useEffect, useState, useMemo } from 'react';

function Main() {

    const [userName, setUserName] = useState('');
    const [pass, setPass] = useState('');
    const [accessToken , setAccessToken] = useState('');
    

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/admin" render={() => <AdminLayout  />} />
                <Route path="/child" render={() => <ChildLayout userName={userName}
                                                                pass={pass}
                                                                accessToken ={accessToken}/>}
                                                                 />

                <Route path="/welcome" render={() => <Welcome />} />
                
                <Route path="/childLogin" render={() => <Login setUserName={setUserName} 
                                                                setPass={setPass}
                                                                userName={userName}
                                                                pass={pass}
                                                                accessToken={accessToken}
                                                                setAccessToken={setAccessToken} />} />
                <Redirect from="/" to="/welcome" />
            </Switch>
        </BrowserRouter>
    );
}

export default Main;



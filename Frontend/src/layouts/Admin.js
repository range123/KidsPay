
import React, { Component,useState } from "react";
import { useLocation, Route, Switch } from "react-router-dom";

import AdminNavbar from "../components/Navbars/AdminNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin.js";

import routes from "../routes.js";

import sidebarImage from "../assets/img/sidebar-3.jpg";

async function getChildrens(accessToken) {
    
  var axios = require('axios');
  

  var config = {
    method: 'get',
    url: 'http://localhost:8000/parent/children',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
  };

  const response = await axios(config);
  console.log(response);

  return response.data;
  
}


function Admin(props) {
  const [parentName, setParentName] = useState('');
  const [accessToken , setAccessToken] = useState('');
  const [children , setChildren] = useState([]);

  if(props.accessToken==='')
  {
    console.log("acesstoken empty")
  }
  

  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={() => <prop.component parentName={parentName} setParentName={setParentName} 
                                          accessToken={accessToken} setAccessToken={setAccessToken}
                                          children={children} setChildren={setChildren}
                                          getChildrens={getChildrens}/>}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);
  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel" ref={mainPanel}>

          <AdminNavbar pName ={parentName}/>
          
          <div className="content">
            <Switch>{getRoutes(routes)}</Switch>
          </div>
        
        </div>
      </div>
      <FixedPlugin
        hasImage={hasImage}
        setHasImage={() => setHasImage(!hasImage)}
        color={color}
        setColor={(color) => setColor(color)}
        image={image}
        setImage={(image) => setImage(image)}
      />
    </>
  );
}

export default Admin;

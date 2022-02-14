
import React, { Component,useState } from "react";
import { useLocation, Route, Switch } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin.js";

import routes from "../childRoutes.js";

import sidebarImage from "../assets/img/sidebar-3.jpg";
import ChildNavbar from "../components/Navbars/ChildNavbar.js"



function Child(props) {

  
  
  console.log(props)

  console.log(props.userName);
  console.log(props.pass);

  const [me , setMe] = useState('');

  


  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("azure");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/child") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={() => <prop.component userName={props.userName} pass={props.pass} accessToken={props.accessToken} me={me} setMe={setMe} />}
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
        <ChildNavbar userName = {props.userName}/>
          
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

export default Child;

import React,{useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ChildIcon from '../childIcon.png';
import ParentIcon from '../parentIcon.png';
import {Row,Col} from 'react-bootstrap';
import "../Welcome/Welcome.css"
import {Paper} from "@material-ui/core";

import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';





function Welcome() {

  const [modal,setModal] = useState(false)

  const toggle = () => {
    setModal(!modal)
  }
  
  const handleParent = paypal.use(['login'], function (login) {
    console.log(process.env.REACT_APP_APP_ID)
    login.render({
      "appid":process.env.REACT_APP_APP_ID,
      "authend": "sandbox",
      "scopes": "openid profile email https://uri.paypal.com/services/paypalattributes",
      "containerid": "lippButton",
      "responseType": "code",
      "locale": "en-in",
      "buttonType": "LWP",
      "buttonShape": "pill",
      "buttonSize": "lg",
      "fullPage": "true",
      "returnurl": "http://192.168.29.223:3000/admin/addChild"
    });
  });

  return (
    <div>
    <div align="center" class="content">
      {
        handleParent
      }



      
    <Container fluid style={{padding:"0%",margin:"0%"}}>
      <Row>
       
        <Col md="6">
        <Paper elevation={100}>
          <Card  >
          <a href="/childLogin">
            <Card.Img variant="top" src={ChildIcon} />
            </a>
            <Card.Body>
              <Card.Title>Child</Card.Title>
              
             
            </Card.Body>
          </Card>
          </Paper>
          
        </Col>

        <Col md="6">
        <Paper elevation={100}>
          <Card style={{cursor: "pointer" }} >
          
            <Card.Img variant="top" src={ParentIcon} onClick={toggle} />
          
            <Card.Body>
              <Card.Title>Parent</Card.Title>
              
            </Card.Body>
          </Card>
        </Paper>
        </Col>

      </Row>
    </Container>
    </div>


    <div>
      <MDBModal isOpen={modal} toggle={toggle}>
        <MDBModalHeader toggle={toggle}><h2  style={{textAlign:"center"}}>Welcome Parent</h2></MDBModalHeader>
        <MDBModalBody style={{textAlign:"center"}}>
          <h4>Log in to KidzPay with your PayPal account in a single click !</h4>
        </MDBModalBody>
        <MDBModalFooter className="justify-content-center">
          <span id='lippButton'></span>
        </MDBModalFooter>
      </MDBModal>
      </div>

      </div>

    


  );
}

export default Welcome;
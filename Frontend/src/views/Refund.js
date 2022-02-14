import React, { useEffect, useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput } from 'mdbreact';
import Alert from 'react-bootstrap/Alert';



function Refund(props) {

  const [id, setID] = useState('');
  const [refund, setRefund] = useState('');

  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [message, setMessage] = useState('')
  const [errHeader, setErrHeader] = useState('')
  
  function clearFields(){
    setID("")
    setRefund("")
    
  }

  async function handleRefund(accessToken, id, refund) {
    console.log(id);
    console.log(refund);
    console.log(accessToken);
    var axios = require('axios');
    var data = JSON.stringify({
      "child_id": parseInt(id),
      "amount": parseFloat(refund)
    });

    var config = {
      method: 'post',
      url: 'http://localhost:8000/parent/withdraw',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      data: data
    };

    try {
      console.log(config)
      const response = await axios(config)
      console.log(response)
      props.getChildrens(props.accessToken)
        .then((childrens) => {
          props.setChildren(childrens)
          console.log(childrens)
        })
        clearFields()
        setShow1(true)
      return response;
    }

    catch (err) {
      clearFields()
      console.log(err.response)
      setShow(true)
      console.log(err.response)
      setErrHeader(err.response.status + " " + err.response.statusText)
      Array.isArray(err.response.data.detail) ? setMessage(err.response.data.detail[0].msg) : setMessage(err.response.data.detail)
    }
  }

  

  return (
    < MDBContainer >
      <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{errHeader}</Alert.Heading>
        <p>
          {message}
        </p>

      </Alert>
      <Alert show ={show1} variant="success" onClose={() => setShow1(false)} dismissible>
              <Alert.Heading>Refund Successfull!!!</Alert.Heading>
            </Alert>
      <MDBRow>
        <MDBCol md="12">
          <form stke>

            <p className="h5 text-center mb-4">Refund Money</p>
            <div className="grey-text">
              <MDBInput value={refund} label="Enter Amount to be Refunded" icon="dollar-sign" group type="text" validate
                onChange={(e) => setRefund(e.target.value)} />
            </div>

            <div>
              <select value={id} className="browser-default custom-select" onChange={(e) => setID(e.target.value)} >
                <option>Select child Account</option>
                {
                  props.children.map((child, key) => {
                    return <option value={child.id}>{child.name}</option>
                  })
                }
              </select>
            </div>

            <br />

            <div className="text-center">
              <br />
              <div className="text-center">
                <MDBBtn color="primary" onClick={() => handleRefund(props.accessToken, id, refund)}>Refund</MDBBtn>
              </div>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer >
  );
}

export default Refund;

import React, { useEffect, useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput } from 'mdbreact';
import Alert from 'react-bootstrap/Alert';




function Restrictions(props) {
  function clearFields()
{
    setID("")
    setAllowedIds("")
    setMaxAmt("")
}

  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [message, setMessage] = useState('')
  const [errHeader, setErrHeader] = useState('')

  async function handleRestriction(accessToken, id, maxAmount, allowed_ids) {
    console.log(id);
    console.log(maxAmount);
    console.log(accessToken);
    const allowedIds = allowed_ids.split(",");

    var axios = require('axios');
    var data = JSON.stringify({
      "child_id": parseInt(id),
      "max_single_transaction_limit": parseFloat(maxAmount),
      "allowed_ids":allowedIds
    });

    var config = {
      method: 'post',
      url: 'http://localhost:8000/parent/set_restrictions',
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
        setShow1(true)
        clearFields()
      return response;
    }

    catch (err) {
      clearFields()
      setShow(true)
      console.log(err.response)
      setErrHeader(err.response.status + " " + err.response.statusText)
      Array.isArray(err.response.data.detail) ? setMessage(err.response.data.detail[0].msg) : setMessage(err.response.data.detail)
    }
  }

  const [id, setID] = useState('');
  const [maxAmt, setMaxAmt] = useState('');
  const [allowed_ids , setAllowedIds] = useState('')

  return (
    < MDBContainer >
      <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{errHeader}</Alert.Heading>
        <p>
          {message}
        </p>

      </Alert>

      <Alert show ={show1} variant="success" onClose={() => setShow1(false)} dismissible>
              <Alert.Heading>Restrictions Updated!!!</Alert.Heading>
            </Alert>
      <MDBRow>
        <MDBCol md="12">
          <form stke>

            <p className="h5 text-center mb-4">Update Restrictions</p>


            <div>
              <select value={id} className="browser-default custom-select" onChange={(e) => setID(e.target.value)}>
                <option>Select child Account</option>
                {
                  props.children.map((child, key) => {
                    return <option value={child.id}>{child.name}</option>
                  })
                }
              </select>
            </div>

            <div className="grey-text">
              <MDBInput value={maxAmt} label="Maximum Transaction Limit" icon="dollar-sign" group type="text" validate
                onChange={(e) => setMaxAmt(e.target.value)} />
            </div>
            <div className="grey-text">
              <MDBInput value={allowed_ids} label="Restricted Id's" icon="user" group type="text" validate
              onChange={(e) => setAllowedIds(e.target.value)} />
            </div>

            <div className="text-center">
              <MDBBtn color="primary" onClick={() => handleRestriction(props.accessToken, id, maxAmt, allowed_ids)}>Update</MDBBtn>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer >
  );
}

export default Restrictions;

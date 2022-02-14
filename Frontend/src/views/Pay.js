import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput } from 'mdbreact';
import Radio from '@material-ui/core/Radio';
import Alert from 'react-bootstrap/Alert';


function Pay(props) {

  const [merchantId, setMerchantId] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [message, setMessage] = useState('')
  const [errHeader, setErrHeader] = useState('')
  
  function clearFields()
  {
    setMerchantId('');
    setAmount('');
    setCategory('');
  }


  const [selectedValue, setSelectedValue] = React.useState('merchant');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  console.log(selectedValue)

  var products = [
    {
      product: 'books',
      category: 'education',
    },
    {
      product: 'Mobile',
      category: 'Electronics',
    },
    {
      product: 'Movie Ticket',
      category: 'Entertainment',
    },
  ]

  async function fetchChildInfo() {
    var axios = require('axios');


    var config = {
      method: 'get',
      url: 'http://localhost:8000/child/me',

      headers: {
        'Authorization': 'Bearer ' + props.accessToken,
        'Content-Type': 'application/json'
      },
    };

    console.log(config);




  }

  async function handlePayment(merchantId, amount, category, selectedValue) {

    var axios = require('axios');
    var data = JSON.stringify({
      "category": selectedValue === 'merchant' ? category : "friends",
      "amount": parseFloat(amount),
      "receiver_id": merchantId
    });

    var config = {
      method: 'post',
      url: selectedValue === 'merchant' ? 'http://localhost:8000/child/merchant_transfer' : 'http://localhost:8000/child/child_transfer',
      headers: {
        'Authorization': 'Bearer ' + props.accessToken,
        'Content-Type': 'application/json'
      },
      data: data
    };

    console.log(config)
    try {
      const response = await axios(config)
      fetchChildInfo()
        .then((child) => props.setMe(child))
      setShow1(true);
      clearFields();
      return response;
    }

    catch (err) {
      clearFields();
      console.log(err.response)
      setShow(true)
      Array.isArray(err.response.data.detail) ?  setMessage(err.response.data.detail[0].msg) :  setMessage(err.response.data.detail)
     
      setErrHeader(err.response.status + " " + err.response.statusText)
    }

  }
  return (
    <div>

      <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{errHeader}</Alert.Heading>
        <p>
          {message}
        </p>

      </Alert>

      <Alert show ={show1} variant="success" onClose={() => setShow1(false)} dismissible>
              <Alert.Heading>Payment Success!!!</Alert.Heading>
            </Alert>
      <MDBRow></MDBRow>
      <h2 align="center">Payments Page</h2>
      <div>
        {
          selectedValue === 'merchant' ?
            (<select value={category} className="browser-default custom-select" onChange={(e) => setCategory(e.target.value)} >
              <option>Select Product</option>
              {
                products.map((prod) => {
                  return <option value={prod.category}>{prod.product}</option>
                })
              }
            </select>)
            : null
        }
      </div>
      <MDBContainer >
        <MDBRow>
          <MDBCol md="12">
            <form stke>

              <div>

                <Radio
                  checked={selectedValue === 'merchant'}
                  onChange={handleChange}
                  value="merchant"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Mechant' }}
                />Merchant

                <Radio
                  checked={selectedValue === 'child'}
                  onChange={handleChange}
                  value="child"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Child' }}
                />Child
              </div>

              <div className="grey-text">

                <MDBInput value={merchantId} label={(selectedValue === 'merchant' ? "Merchant Email" : "Child") + " ID"} icon="at" group type="text" validate error="wrong"
                  success="right" onChange={(e) => setMerchantId(e.target.value)} />

                <MDBInput value={amount} label="Amount" icon="dollar-sign" group type="text" validate
                  onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="text-center">
                <MDBBtn color="primary" onClick={() => handlePayment(merchantId, amount, category, selectedValue)}>Pay</MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer >
    </div>
  );
}

export default Pay;
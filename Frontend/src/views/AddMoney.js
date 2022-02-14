import React, { useEffect ,useState} from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput } from 'mdbreact';
import ReactPayPal from "../components/reactPaypal/checkout";
import Alert from 'react-bootstrap/Alert';

function AddMoney(props) {
  console.log(props.children);
  const [amount, setAmount] = useState('');
  const [id,setID] = useState('');
  const [checkout , setCheckout] = useState(false);

  const [show,setShow] = useState(false)
  const [message, setMessage] = useState('')
  const [errHeader,setErrHeader] = useState('')
  const [paySuccess, setPaySuccess] = useState(false)



  return (
    < MDBContainer >
    <Alert show ={show} variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{errHeader}</Alert.Heading>
        <p>
          {message}
        </p>
       
      </Alert>
      <Alert show ={paySuccess} variant="success" onClose={() => setPaySuccess(false)} dismissible>
        <Alert.Heading>Payment Was Successfull</Alert.Heading>
      </Alert>
      <MDBRow>
        <MDBCol md="12">
          <form stke>
            <p className="h5 text-center mb-4">Add Money</p>
            <div className="grey-text">
              <MDBInput value={amount} label="Enter Amount to be Added" icon="dollar-sign" group type="text" validate
                onChange={(e) => setAmount(e.target.value)} />
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

            <br/>

            <div className="text-center">
              <br />
              <div className="payment-div">
                {(checkout === true)
                  ? <div className="payment-div">
                    <ReactPayPal
                      total={amount}
                      id={id}
                      accessToken = {props.accessToken}
                      getChildrens = {props.getChildrens}
                      setChildren = {props.setChildren}

                      setAmount = {setAmount}
                      setID = {setID}
                      setShow = {setShow}
                      setErrHeader = {setErrHeader}
                      setMessage = {setMessage}
                      setCheckout = {setCheckout}
                      setPaySuccess = {setPaySuccess}
                    />
                  </div>

                  : <div>
      
                    <button onClick={() => { setCheckout(true) }} className="checkout-button">Checkout</button>
                  </div>
                }
              </div>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer >
  );
}

export default AddMoney;

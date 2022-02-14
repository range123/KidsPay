import React, { useEffect,useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput } from 'mdbreact';
import Alert from 'react-bootstrap/Alert';
import ScaleLoader from "react-spinners/ScaleLoader";
import "./styles.css"

const AddChild = (props) => {

  const [name,setName] = useState('');
  const [childName ,setChildName] = useState('')
  const [childPassword ,  setChildPassword] = useState('')
  const [maxTranLimit , setMaxTranLimit] = useState('')

  const [show1,setShow1] = useState(false)
  const [show2,setShow2] = useState(false)
  const [message, setMessage] = useState('')
  const [errHeader,setErrHeader] = useState('')

  const [loading,setLoading] = useState('')

  


  async function refreshTokenExtraction(encodedValue, code) {

    setLoading(true)
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      'grant_type': 'authorization_code',
      'code': code
    });
    var config = {
      method: 'post',
      url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      headers: {
        'Authorization': encodedValue
      },
      data: data
    };

    try{
    const response = await axios(config);
    console.log(response.data.refresh_token);
    return response.data.refresh_token
    }

    catch(err)
    {
      console.log("navein")
      setLoading(false)
    }



  }

  async function accessTokenExtraction(encodedValue, refreshToken) {
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken
    });
    var config = {
      method: 'post',
      url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      headers: {
        'Authorization': encodedValue
      },
      data: data
    };

    const response = await axios(config);

    return response.data.access_token
  }

  async function fetchUserInfo(accessToken) {

    var axios = require('axios');

    var config = {
      method: 'get',
      url: 'https://api-m.sandbox.paypal.com/v1/identity/oauth2/userinfo?schema=paypalv1.1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    };

    const response = await axios(config);

    return response


  }

  async function getAccessToken(userName, password) {
   
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      'username': userName,
      'password': password
    });
    var config = {
      method: 'post',
      url: 'http://localhost:8000/parent/login/access-token',
      headers: {
        'is-paypal-login': true
      },
      data: data
    };

    const response = await axios(config);
    console.log(response);
    return response.data.access_token

  }
  useEffect(

    async function authenticate() {

      
      //auth code generation
      const encodedValue = "Basic " + process.env.REACT_APP_PYPL_SECRET;
      const code = new URLSearchParams(window.location.search).get('code')
      console.log(code)
      
      refreshTokenExtraction(encodedValue, code)
        .then((refresh_token) => {
          console.log(refresh_token);
          accessTokenExtraction(encodedValue, refresh_token)
            .then((accessToken) => {
              console.log(accessToken);
              fetchUserInfo(accessToken)
                .then((userInfo) => {
                  props.setParentName(userInfo.data.name)
                  console.log(userInfo)
                  console.log(userInfo.data.emails[0].value)
                  getAccessToken(userInfo.data.emails[0].value,userInfo.data.name)
                  .then((accessToken) => {
                    console.log("End Point AcessToken"+accessToken)
                    console.log(props)
                    props.setAccessToken(accessToken)
                    props.getChildrens(accessToken)
                    .then((childrens) => {props.setChildren(childrens)
                                          setLoading(false)})
                  })
                })
            }
            

            )
        });

    },[]
  )

  function clearFields()
  {
      setName("")
      setChildName("")
      setChildPassword("")
      setMaxTranLimit("")
  }

  async function addChildFunction() {
    console.log(props.accessToken);

    try{
    var axios = require('axios');
    if(name==="" || childName==="" || childPassword==="" || maxTranLimit==="")
    {
      
      throw {
        response:{ data : {detail : "All Values are Required"},
        status:101,
        statusText:"Fields Cannot Be Empty"
      }
      }
    }

    var data = JSON.stringify({
      "name": name,
      "username": childName,
      "password": childPassword,
      "max_single_transaction_limit":parseFloat(maxTranLimit)
    });

    var config = {
      method: 'post',
      url: 'http://localhost:8000/parent/add_child',
      headers: {
        'Authorization': 'Bearer '+props.accessToken,
        'Content-Type': 'application/json'
      },
      data: data
    };

  
    const response = await axios(config);
    console.log(response);
    props.getChildrens(props.accessToken)
    .then((childrens)=>{props.setChildren(childrens)
      setShow2(true)
      clearFields()})
    }

    catch(err)
    {
        console.log("i am here");
        clearFields()
        setShow1(true)
        console.log(show2)
        console.log(err.response)
        setErrHeader(err.response.status + " " + err.response.statusText)
        Array.isArray(err.response.data.detail) ?  setMessage(err.response.data.detail[0].msg) :  setMessage(err.response.data.detail)
    }
    
  }

  return (
    <div>
      {
        loading ? (
              <div align="center" class="reactSpinner">
                <ScaleLoader color={'#046cebA0'} loading={loading} height={70} radius={40} width={10} margin={3} />
              </div>)
        :
        (< MDBContainer >
    
          <Alert show ={show1} variant="danger" onClose={() => setShow1(false)} dismissible>
              <Alert.Heading>{errHeader}</Alert.Heading>
              <p>
                {message}
              </p>
             
            </Alert>

            <Alert show ={show2} variant="success" onClose={() => setShow2(false)} dismissible>
              <Alert.Heading>Child Was Added!!!</Alert.Heading>
            </Alert>

            <MDBRow>
              <MDBCol md="12">
                <form stke>
                  <p className="h5 text-center mb-4">Add Child</p>
                  <div className="grey-text">
                    <MDBInput value={name} label="Name" icon="user" group type="text" validate error="wrong"
                      success="right" onChange={(e)=>setName(e.target.value)}/>
      
                    <MDBInput value={childName} label="Username" icon="at" group type="text" validate error="wrong"
                      success="right" onChange={(e)=>setChildName(e.target.value)}/>
      
                    <MDBInput value={childPassword} label="Password" icon="key" group type="password" validate
                      error="wrong" success="right" onChange={(e)=>setChildPassword(e.target.value)}/>
      
                    <MDBInput value={maxTranLimit} label="Maximum Transaction Limit" icon="dollar-sign" group type="text" validate 
                    onChange={(e)=>setMaxTranLimit(e.target.value)}/>
                  </div>
                  <div className="text-center">
                    <MDBBtn color="primary" onClick={()=>addChildFunction()}>Register</MDBBtn>
                  </div>
                </form>
              </MDBCol>
            </MDBRow>
          </MDBContainer >)

      }

    
    
    </div>
  );
};

export default AddChild;
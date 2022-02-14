import React from "react";



export default function ReactPayPal(props) {

  function clearFields()
  {
      props.setAmount("")
      props.setID("")
  }

  async function updateChildBalance(total, id, accessToken) {
    console.log(id);
    console.log(total);
    console.log(accessToken);
    var axios = require('axios');
    var data = JSON.stringify({
      "child_id": parseInt(id),
      "amount": parseFloat(total)
    });
  
    var config = {
      method: 'post',
      url: 'http://localhost:8000/parent/add_balance',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      data: data
    };
  
    try{
    console.log(config)
    const response = await axios(config)
    console.log(response)
    props.setPaySuccess(true)
    return response;
    }
  
    catch(err)
    {
      
      props.setShow(true)
      console.log(err.response)
      props.setErrHeader(err.response.status + " " + err.response.statusText)
      Array.isArray(err.response.data.detail) ?  props.setMessage(err.response.data.detail[0].msg) :  props.etMessage(err.response.data.detail)
    }
  
  }

  const [paid, setPaid] = React.useState(false);
  const [error, setError] = React.useState(null);
  const paypalRef = React.useRef();

  // To show PayPal buttons once the component loads
  React.useEffect(() => {
    
    console.log("amount " + props.total);
    console.log("id " + props.id)
    window.paypal_sdk
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Your description",
                amount: {
                  value: props.total,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          updateChildBalance(props.total, props.id, props.accessToken).then(
            (response) =>{
              props.getChildrens(props.accessToken)
              .then((childrens)=>{props.setChildren(childrens)
                console.log(childrens)
                clearFields()
                props.setCheckout(false)
              })
            }
          )
          setPaid(true);
          console.log(order);
          
        },
        onError: (err) => {
          //   setError(err),
          console.error(err);
        },
      })
      .render(paypalRef.current);
  }, []);

  // If the payment has been made
  if (paid) {
    
    return <div>Payment successful.!</div>;
  }

  // If any error occurs
  if (error) {
    return <div>Error Occurred in processing payment.! Please try again.</div>;
  }

  // Default Render
  return (
    <div>
      <h4 onChange={(e) => console.log("changing")}>Total Amount in USD : {props.total}  /-</h4>
      <div ref={paypalRef} />
    </div>
  );
}
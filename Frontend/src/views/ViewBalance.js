import React ,{useEffect,useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Alert from 'react-bootstrap/Alert';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';

import "./styles.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));



function ViewBalance(props) {

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

    
    const response = await axios(config)
    .then((reponse)=>setBalance(reponse.data.balance))
    
  }

  const [rows,setRows] = useState([])
  const [balance,setBalance] = useState('')

  
  const [show,setShow] = useState(false)
  const [message, setMessage] = useState('')
  const [errHeader,setErrHeader] = useState('')

  useEffect(
    
    async function fetchTransaction() {
    
      var axios = require('axios');
      
  
      var config = {
        method: 'get',
        url: 'http://localhost:8000/child/transactions',
        
        headers: {
          'Authorization': 'Bearer ' + props.accessToken,
          'Content-Type': 'application/json'
        },
      };
  
      console.log(config);
      
      try{
      const response = await axios(config)
      setRows(response.data)
      fetchChildInfo()
      }

      catch(err)
      {
        setShow(true)
        console.log(err.response)
        setErrHeader(err.response.status + " " + err.response.statusText)
        Array.isArray(err.response.data.detail) ?  setMessage(err.response.data.detail[0].msg) :  setMessage(err.response.data.detail)
      }


  
    },[]
  )
  const classes = useStyles();
  console.log(props.userName);
  return (
    <div>
      <Alert show ={show} variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{errHeader}</Alert.Heading>
        <p>
          {message}
        </p>
       
      </Alert>
      <div>
        <h2 align="center">Your Balance</h2>
        <h3 style={{color:"#00FF00"}} align="center">{balance} USD</h3>

      </div>

      <hr class="gradientHR" />

      <div>
      
        
        <h2 align="center">Transactions</h2>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Receiver ID</TableCell>
              <TableCell align="center">Date/Time</TableCell>
              <TableCell align="center">Merchant Transfer</TableCell>

              

            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} style={row.receiver_id===props.userName ? {backgroundColor:"#00FF0050"} : {backgroundColor:""} }>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">{row.category}</TableCell>
                <TableCell align="center">{row.amount}</TableCell>
                <TableCell align="center">{row.receiver_id}</TableCell>
                <TableCell align="center">{row.created_at}</TableCell>
                <TableCell align="center">{
                  row.is_merchant_transfer ? "Merchant" : "Child Transfer"
                }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    </div>
  );
}

export default ViewBalance;
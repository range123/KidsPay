import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Alert from 'react-bootstrap/Alert';
import { Filter } from '@material-ui/icons';

import "../views/styles.css"



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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}




export default function Transactions(props) {


 
  const classes = useStyles();
  const [userName, setUserName] = useState('');
  const [rows, setRows] = useState([]);

  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')
  const [errHeader, setErrHeader] = useState('')




  async function fetchTransaction(id) {
    var axios = require('axios');


    var config = {
      method: 'get',
      url: 'http://localhost:8000/parent/child_transactions/' + id,

      headers: {
        'Authorization': 'Bearer ' + props.accessToken,
        'Content-Type': 'application/json'
      },
    };

    console.log(config.url);

      const response = await axios(config)
      console.log(response)
      return response.data;
  
  }


  const handleChange = (event) => {
    if(props.accessToken==='')
    {
      const err = {
        response:{ data : {detail : "Could not validate credentials, Attempt a relogin"},
        status:403,
        statusText:"Forbidden" }
            }
      console.log(err.response)
      setShow(true)
      console.log(err.response)
      setErrHeader(err.response.status + " " + err.response.statusText)
      Array.isArray(err.response.data.detail) ? setMessage(err.response.data.detail[0].msg) : setMessage(err.response.data.detail)
    }
    else{
    setTimeout(() => {
      
      fetchTransaction(event.target.value)
        .then((rows) => setRows(rows))
        console.log(rows)
    }, 200)

    for (let index = 0; index < props.children.length; index++) {
      console.log("here")
      if(props.children[index].id === event.target.value)
      {
        setUserName(props.children[index].username)
        break
      }
      
    }

    
  }



  };

  return (

    <div>
      <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{errHeader}</Alert.Heading>
        <p>
          {message}
        </p>

      </Alert>
      <h1 align="center">View Transactions</h1>
      <FormControl className={classes.formControl} align="center">
        <InputLabel id="demo-simple-select-label">Select Child ID</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          //onClickCapture={handleChange}
        >
          {
            props.children.map((child, key) => {
              return <MenuItem value={child.id}>{child.name}</MenuItem>
            })
          }

        </Select>
      </FormControl>
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
              
              <TableRow key={row.id} style={row.receiver_id===userName ? {backgroundColor:"#00FF0050"} : {backgroundColor:""} }>
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

  );
}

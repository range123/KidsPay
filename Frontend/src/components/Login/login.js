import React ,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'


async function getAccessToken(userName, password ) {
  var axios = require('axios');
  var qs = require('qs');
  var data = qs.stringify({
    'username': userName,
    'password': password
  });
  var config = {
    method: 'post',
    url: 'http://localhost:8000/child/login/access-token',

    data: data
  };


  
    console.log(config)
    const resp = await axios(config);
    console.log(resp);
    return resp.data.access_token;
  

}



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function handleSubmit(e) {
  e.preventDefault();
  console.log("clicked!!!!");

}

export default function SignIn(props) {

  console.log(props);
  const classes = useStyles();
  const history = useHistory();
  const [show,setShow] = useState(false)
  const [message, setMessage] = useState('')
  const [errHeader , setErrHeader] = useState('')


  return (
    <div>

      <Container component="main" maxWidth="xs">

        <CssBaseline />

        <Alert show={show} variant="danger">
          <Alert.Heading>{errHeader}</Alert.Heading>
          <p>
            {message}
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => setShow(false)} variant="outline-success">
              Close
            </Button>
          </div>
        </Alert>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="userName"
              label="User Name"
              name="userName"
              autoComplete="userName"
              autoFocus
              onChange={(e) => props.setUserName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => props.setPass(e.target.value)}

            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />


            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => {
                getAccessToken(props.userName, props.pass)
                  .then((accessToken) => {
                      console.log(accessToken)
                      props.setAccessToken(accessToken)
                      history.push({
                        pathname: '/child/viewBalance'
                      })
                    
                    
                  })
                  .catch((err) => {
                    console.log(err.response)
                    setShow(true)
                    setErrHeader(err.response.status + "" +err.response.statusText)
                    Array.isArray(err.response.data.detail) ?  setMessage(err.response.data.detail[0].msg) :  setMessage(err.response.data.detail)
                  })
              }
              }
            >
              Sign In
            </Button>


            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>

        

      </Container>

    
    </div>
  );
}
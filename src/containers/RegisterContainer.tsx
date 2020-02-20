import React from 'react';
import { Link } from 'react-router-dom';

import { createStyles, makeStyles, Theme, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Loader from './../components/Loader';
import { AuthApi } from './../apis';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        container: {
            width: '100vw',
            height: '100vh',
            backgroundColor: '#eee'
        },
        formContainer: {
            padding: '10px',
            width: '50vw'
        },
        divider: {
            margin: '20px 0'
        },
        fontNormal: {
            fontWeight: 'normal' as 'normal'
        },
        textField: {
            width: '100%'
        },
        paddingv20px: {
            paddingTop: '20px',
            paddingBottom: '20px'
        },
        marginv10px: {
            marginTop: '10px',
            marginBottom: '10px'
        },
        card: {
            padding: '3rem',
        },
        formControl: {
            marginTop : '10px',
            marginBottom : '10px'
        }
    })
);

let RegisterContainer = (props: any) => {
    const classes = useStyles();
    const [ username, setUsername ] = React.useState('');
    const [ name, setName ] = React.useState('');
    const [ email, setEmail ] = React.useState('');
    const [ password, setPassword ] = React.useState('');
    const [ confirmPw, setConfirmPw ] = React.useState('');
    const [ agree, setAgree ] = React.useState(false);
    const [ isLoading, setLoading ] = React.useState(false);
    const [ errors, setErrors ] = React.useState<any>({
        username : '',
        name: '',
        email : '',
        password : '',
        password_confirmation : ''
    });
    const api = new AuthApi();

    const handleSubmit = (e: any) => {
        e.preventDefault();

        setLoading(true);
        api.register({
            username,
            name,
            email,
            password : btoa(password),
            password_confirmation : btoa(password)
        })
        .then(() => {
            Swal.fire(
                'Regitration Success!',
                'Now you can logged in ! Keep learning !',
                'success'
            );
            props.history.push('/auth/login');
        })
        .catch((err: any) => {
            if(typeof err.response.data.messages !== 'undefined'){
                const temp = err.response.data.messages;
                setErrors( { ...errors , ...temp } );
                return;
            }

            Swal.fire(
                'Oops ..',
                err.response.data.message || '',
                'error'
            );
        })
        .finally(() => {
            setLoading(false)
        });

        return false;
    }

    return (
        <>
            <Grid container justify="center" alignItems="center" className={classes.container}>
                <Grid item md={3} sm={5} xs={6}>
                    <Paper elevation={3} >
                        <Card className={classes.card}>
                            <form onSubmit={handleSubmit}>
                            <Typography variant="h6" className={classes.fontNormal}>Sign in to continue</Typography>
                            <FormControl fullWidth>
                                <TextField 
                                error={ errors.username.trim() !== '' }
                                helperText={ errors.username }
                                label="Username" margin="normal" value={username} onChange={(e: any) => setUsername(e.target.value)} className={classes.textField} />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField 
                                error={ errors.name.trim() !== '' }
                                helperText={ errors.name }
                                label="Name" margin="normal" value={name} onChange={(e: any) => setName(e.target.value)} className={classes.textField} />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField 
                                    error={ errors.email.trim() !== '' }
                                    helperText={ errors.email }
                                    label="Email" margin="normal" value={email} onChange={(e: any) => setEmail(e.target.value)} className={classes.textField} />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField 
                                    error={ errors.password.trim() !== '' }
                                    helperText={ errors.password }
                                    type="password" label="Password" margin="normal" value={password} onChange={(e: any) => setPassword(e.target.value)} className={classes.textField} />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField 
                                    error={ errors.password_confirmation.trim() !== '' }
                                    helperText={ errors.password_confirmation }
                                    type="password" label="Confirm Password" margin="normal" value={confirmPw} onChange={(e: any) => setConfirmPw(e.target.value)} className={classes.textField} />
                            </FormControl>
                            { 
                            (
                            !isLoading 
                            && 
                                <FormControl fullWidth style={ { marginTop: '32px' } }>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Register
                                    </Button>
                                    <Typography variant="subtitle2" className={classes.marginv10px} align={"center"} >
                                        Already have an account? 
                                        <br />
                                        <Link to="/auth/login"> Login </Link>
                                    </Typography>
                                </FormControl>
                            )
                            ||
                            (
                                isLoading
                                &&
                                <div style={{ marginTop: '24px' }}>
                                    <Loader size='56px'></Loader>
                                </div>
                            )
                            }
                            </form>
                        </Card>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default RegisterContainer;
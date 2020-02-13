import React from 'react';
import { Link } from 'react-router-dom';

import { createStyles, makeStyles, Theme, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

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
            margin: '10px 0'
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
        }
    })
);

let LoginContainer = () => {
    const classes = useStyles();
    const [ email, setEmail ] = React.useState('');
    const [ password, setPassword ] = React.useState('');

    return (
        <>
            <Grid container justify="center" alignItems="center" className={classes.container}>
                <Card className={classes.formContainer}>
                    <Grid container justify="center" alignItems="center">
                        <Typography variant="h6" className={classes.fontNormal}>Login</Typography>
                    </Grid>

                    <Divider className={classes.divider} />
                    
                    <div>
                        <TextField label="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} className={classes.textField} />
                    </div>

                    <div>
                        <TextField label="Password" value={password} onChange={(e: any) => setPassword(e.target.value)} className={classes.textField} />
                    </div>

                    <Grid container justify="center" alignItems="center" direction="column" className={classes.paddingv20px}>
                        <Chip label="Login"
                            variant="outlined"
                            color="primary"
                            clickable={true}
                        />
                        <Typography variant="subtitle1" className={classes.marginv10px}>Haven't join us? <Link to="/auth/register"> Register Now</Link></Typography>
                    </Grid>

                </Card>
            </Grid>
        </>
    );
}

export default LoginContainer;
import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Route, BrowserRouter as Router, Link, Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 0,
        },
        paper: {
            borderBottomLeftRadius : 0,
            borderBottomRightRadius : 0,
            padding: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        content: {
            height: '100vh',
            borderRadius: 0
        },
        link: {
            textDecoration: 'none'
        }
    }),
);

let EmptyPath = () => {
    return (
        <Redirect to="/material" />
    );
}

export default function ManagePage() {
    const classes = useStyles();

    return (
        <div>
            <Router>
                <Grid container spacing={0}>
                    <Grid item xs={1}>
                        <Link to="/material" className={classes.link}>
                            <Paper className={classes.paper}>Material</Paper>
                        </Link>
                    </Grid>
                </Grid>

                <Route exact path="/material" />
                <Route exact path="/" component={EmptyPath} />
            </Router>
        </div>
    );
}
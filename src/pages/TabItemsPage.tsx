import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import GuiContainer from "../containers/GuiContainer";

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
        }
    }),
);

export default function TabItemsPage() {
    const classes = useStyles();

    return (
        <div>
            <Grid container spacing={0}>
                <Grid item xs={1}>
                    <Paper className={classes.paper}>GUI</Paper>
                </Grid>
                <Grid item xs={1}>
                    <Paper className={classes.paper}>Modules</Paper>
                </Grid>
            </Grid>
            <Router>
                <Route exact path="/gui" component={GuiContainer} />
            </Router>
        </div>
    );
}
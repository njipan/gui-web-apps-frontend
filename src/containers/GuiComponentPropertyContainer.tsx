import React from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import BuildIcon from '@material-ui/icons/Build';
import SaveIcon from '@material-ui/icons/Save';

const styles = {
    container: {
        margin: 'auto'
    },
    list: {
        height: '100%',
        overflow: 'auto'
    },
    divider: {
        margin: '10px 0'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
});

class GuiComponentPropertyContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            properties: [],
            propertyId: [],
            selectedId: []
        }
    }

    componentDidMount = () => {
        let componentId = this.props.match.params.id;
        instance.get('/gui-property').then(({data}) => {
            let properties = data;
            instance.get(`/gui-property/get-by-component/${componentId}`).then(({data}) => {
                let selectedId = data.map((v: any) => v.id);

                let propertyId = properties.map((v: any) => {
                    if(selectedId.indexOf(v.id) === -1) return v.id;
                });

                this.setState({
                    properties: properties,
                    propertyId: propertyId,
                    selectedId: selectedId
                });
            })
        });
    }

    switchProp = (id: any) => {
        const {propertyId, selectedId} = this.state;
        if(propertyId.indexOf(id) !== -1) {
            propertyId.splice(propertyId.indexOf(id), 1);
            selectedId.push(id);
        }
        else if(selectedId.indexOf(id) !== -1){
            selectedId.splice(selectedId.indexOf(id), 1);
            propertyId.push(id);
        }

        this.setState({
            propertyId: propertyId,
            selectedId: selectedId
        });
    }

    propertyList = (title: string, items: any[]) => {
        return (
            <Card>
                <CardHeader avatar={<BuildIcon />} title={title} />

                <Divider />

                <List dense component="div" role="list" className={this.props.classes.list}>
                    {
                        items.map((v, i) => {
                            let prop = this.state.properties.find((p: any) => {
                                return p.id === v;
                            });

                            return typeof(prop) !== 'undefined' && prop !== null ? (
                                <ListItem key={i} role="listitem" button onClick={() => this.switchProp(v)}>
                                    <ListItemText primary={prop.name} />
                                </ListItem>
                            ) : (
                                <div key={i}></div>
                            );
                        })
                    }
                </List>
            </Card>
        );
    }

    saveMap = () => {

    }

    render = () => {
        const { selectedId, propertyId } = this.state;
        return (
            <>
                <Typography variant="h6">Property Mapping</Typography>

                <Divider className={this.props.classes.divider} />

                <Grid container spacing={2} justify="center" alignItems="center" className={this.props.classes.container}>
                    <Grid item>{this.propertyList('Available Properties', propertyId)}</Grid>
                    <Grid item></Grid>
                    <Grid item>{this.propertyList('Selected Properties', selectedId)}</Grid>
                </Grid>

                <Divider className={this.props.classes.divider} />

                <div className={this.props.classes.buttonContainer}>
                    <Button variant="contained" color="primary" onClick={() => this.saveMap()}>
                        <SaveIcon />
                        Save
                    </Button>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(GuiComponentPropertyContainer);
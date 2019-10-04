import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = {
    divider: {
        margin: '10px 0'
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
})

class ProgrammingComponentContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            languages: []
        }
    }

    componentDidMount = () => {
        instance.get('/programming-language').then(({data}) => {
            this.setState({
                languages: data
            });
        }).catch((err) => {
            Swal.fire({
                title: 'Error Occurred',
                text: 'Something wrong with service',
                type: 'error'
            });
        });
    }

    render = () => {
        return (
            <>
                <Typography variant="h6">Component's Mapping</Typography>

                <Divider className={this.props.classes.divider} />
            </>
        );
    }
}

export default withStyles(styles)(ProgrammingComponentContainer);
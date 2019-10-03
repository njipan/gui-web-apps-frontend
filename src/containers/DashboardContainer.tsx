import React from 'react';

import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = {
    spaceAbove: {
        marginTop: '10px'
    }
};

class DashboardContainer extends React.Component<any, any> {
    render = () => {
        return (
            <>
                <Typography variant="h6">Dashboard</Typography>
                <Divider className={this.props.classes.spaceAbove} />
            </>
        );
    }
}

export default withStyles(styles)(DashboardContainer);
import {React, useEffect, useState} from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Step, Stepper, StepLabel, Typography, Button, Grow, Backdrop, Paper } from '@material-ui/core'

//icons
import { Settings, Shuffle, Autorenew } from '@material-ui/icons';

import { socket } from "../../services/Socket";


const useStyles = makeStyles((theme) => ({
    root: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
        zIndex: 100,
    },

    main: {
        width: "300px",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    content: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        alignItems: "center",
    },

    retryButton: {
        alignSelf: "center",
        width: "80%",
    },

    buttons: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
    }

}));


function ConnectionFailed(props) {

    const classes = useStyles();
    const theme = useTheme();

    return (
        <Backdrop open className={classes.root}>
            <Grow in>
                <div className={classes.main}>
                    <div className={classes.content}>
                        <Typography variant="h4">Connection failed</Typography>
                        <Typography variant="body1" style={{textAlign: "center", marginTop: "10px",}}>Couldn't connect to your computer. Is the VSM client companion running?</Typography>

                        <div className={classes.buttons}> 
                            <Button variant="outlined" color="primary" onClick={props.retry} className={classes.retryButton}>
                                Retry
                            </Button>
                        </div>
                    </div>
                    
                </div>
            </Grow>
        </Backdrop>
    )
}

export default ConnectionFailed
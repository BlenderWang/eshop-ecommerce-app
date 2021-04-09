import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
        boxShadow: "none",
    },
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <footer>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        Copyright &copy; eShop
                    </Paper>
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;

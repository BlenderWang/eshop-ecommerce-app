import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Stepper, Step, StepLabel /* Typography */ } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        display: "flex",
        marginTop: theme.spacing(12),
        marginLeft: "-24px",

        "& .MuiTypography-body1": {
            color: "#c3c3c3",
        },
    },
    links: {
        color: "#3c3c3c",
        textTransform: "capitalize",
    },
}));

function getSteps() {
    return ["login", "shipping", "payment", "order"];
}

const HorizontalLinearStepper = ({ activeStep }) => {
    const classes = useStyles();

    const steps = getSteps();

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>
                                <Link to={label} className={classes.links}>
                                    {label}
                                </Link>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
};

export default HorizontalLinearStepper;

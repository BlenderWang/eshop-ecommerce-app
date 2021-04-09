import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Stepper, Step, StepLabel } from "@material-ui/core";

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
    labelBg: {
        "& .MuiStepIcon-root.MuiStepIcon-completed, & .MuiStepIcon-root.MuiStepIcon-active": {
            color: "#2c89a0",
        },
    },
}));

const CheckoutSteps = ({ stepNum }) => {
    const classes = useStyles();

    const getSteps = () => {
        return ["login", "shipping", "payment", "place order"];
    };
    const steps = getSteps();

    return (
        <div className={classes.root}>
            <Stepper activeStep={stepNum}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel
                                className={classes.labelBg}
                                {...labelProps}
                            >
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

export default CheckoutSteps;

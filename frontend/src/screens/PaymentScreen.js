import React, { useState } from "react";
import {
    Button,
    Divider,
    Typography,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    FormLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

const useStyle = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
    },
    title: {
        fontSize: "2rem",
        color: "#3c3c3c",
    },
    form: {
        marginTop: theme.spacing(3),
        display: "grid",
        gridTemplateColumns: "1fr",

        "& .MuiTextField-root": {
            marginTop: theme.spacing(1),
            marginLeft: 0,
        },

        "& .MuiFormLabel-root.Mui-focused": {
            color: "rgba(0, 0, 0, 0.54)",
        },
        "& .MuiRadio-colorSecondary.Mui-checked": {
            color: "#de8787",
        },
    },
    actionBtn: {
        margin: theme.spacing(1),
        marginLeft: 0,
        color: "#3c3c3c",
        border: "1px solid #856046",
        maxWidth: "10vw",

        "&:hover": {
            background: "#3c3c3c",
            color: "#f1f1f1",
            border: "1px solid rgba(0, 0, 0, 0.23)",
        },
    },
}));

const PaymentScreen = ({ history }) => {
    const classes = useStyle();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    if (!shippingAddress) {
        history.push("/shipping");
    }

    const [paymentMethod, setPaymentMethod] = useState("paypal");

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push("/placeorder");
    };

    return (
        <FormContainer className={classes.root}>
            <CheckoutSteps stepNum={2} />

            <Typography component="h1" className={classes.title}>
                Payment Method
            </Typography>

            <Divider variant="fullWidth" />

            <form className={classes.form} onSubmit={submitHandler}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Select Method</FormLabel>

                    <RadioGroup
                        aria-label="paymentMethod"
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <FormControlLabel
                            value="paypal"
                            control={<Radio />}
                            label="PayPal/Credit Card"
                        />
                        <FormControlLabel
                            value="stripe"
                            control={<Radio />}
                            label="Stripe"
                        />
                    </RadioGroup>
                </FormControl>

                <Button
                    type="submit"
                    variant="outlined"
                    className={classes.actionBtn}
                >
                    Continue
                </Button>
            </form>
        </FormContainer>
    );
};

export default PaymentScreen;

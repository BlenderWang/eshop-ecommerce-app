import React, { useState } from "react";
import { Button, Divider, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

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

        "& .MuiTextField-root": {
            marginTop: theme.spacing(1),
            marginLeft: 0,
        },
    },
    actionBtn: {
        margin: theme.spacing(1),
        marginLeft: 0,
        color: "#3c3c3c",
        border: "1px solid #856046",

        "&:hover": {
            background: "#3c3c3c",
            color: "#f1f1f1",
            border: "1px solid rgba(0, 0, 0, 0.23)",
        },
    },
}));

const ShippingScreen = ({ history }) => {
    const classes = useStyle();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        history.push("/payment");
    };

    return (
        <FormContainer className={classes.root}>
            <CheckoutSteps stepNum={1} />

            <Typography component="h1" className={classes.title}>
                Shipping
            </Typography>

            <Divider variant="fullWidth" />

            <form
                className={classes.form}
                autoComplete="off"
                onSubmit={submitHandler}
            >
                <TextField
                    required
                    className={classes.textField}
                    id="outlined-address-input"
                    label="Address"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setAddress(e.target.value)}
                />

                <TextField
                    required
                    className={classes.textField}
                    id="outlined-city-input"
                    label="City"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setCity(e.target.value)}
                />

                <TextField
                    required
                    className={classes.textField}
                    id="outlined-postalCode-input"
                    label="Postal Code"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setPostalCode(e.target.value)}
                />

                <TextField
                    required
                    className={classes.textField}
                    id="outlined-country-input"
                    label="Country"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setCountry(e.target.value)}
                />

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

export default ShippingScreen;

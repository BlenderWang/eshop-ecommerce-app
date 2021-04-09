import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Divider,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { DescriptionAlerts } from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    gridContainer: {
        width: "80vw",
        margin: "auto",
        color: "#3c3c3c",
    },
    paper: {
        margin: "auto",
        boxShadow: "none",
    },
    cartContainer: {
        margin: "1rem 0",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",

        "& a": {
            color: "#3c3c3c",
        },
    },
    img: {
        display: "block",
        maxWidth: "8vw",
        height: "auto",
    },
    itemDetails: {
        fontSize: ".87rem",
        justifySelf: "center",
    },
    listTitle: {
        "& .MuiTypography-body1": {
            fontWeight: 900,
        },
    },
    actionButton: {
        color: "#3c3c3c",
        border: "1px solid #856046",
        marginTop: theme.spacing(2),
    },
}));

const PlaceOrderScreen = ({ history }) => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    /* calculate prices */
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
    cart.totalPrice = (
        Number(cart.itemsPrice) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);

    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate;

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`);
        }
        // eslint-disable-next-line
    }, [history, success]);

    const placeOrderHandler = () => {
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            })
        );
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                    <CheckoutSteps stepNum={3} />
                </Grid>

                <Grid item xs={8}>
                    <Typography component="h6">
                        <strong>Address: </strong>
                        {cart.shippingAddress.address},{" "}
                        {cart.shippingAddress.city}{" "}
                        {cart.shippingAddress.postalCode},{" "}
                        {cart.shippingAddress.country}
                    </Typography>

                    <Typography component="h6">
                        <strong>Method of Payment: </strong>
                        {cart.paymentMethod}
                    </Typography>

                    <Typography component="h6">
                        <strong>Order Items: </strong>
                        {cart.cartItems.length === 0 ? (
                            <DescriptionAlerts
                                title={"Empty Cart"}
                                content={" Your cart is empty — "}
                                alert={"please go back to product page!"}
                            />
                        ) : (
                            <Paper className={classes.paper}>
                                {cart.cartItems.map((item, index) => (
                                    <Grid
                                        key={index}
                                        container
                                        className={classes.cartContainer}
                                    >
                                        <img
                                            className={classes.img}
                                            alt={item.name}
                                            src={item.image}
                                        />

                                        <Typography
                                            gutterBottom
                                            variant="body1"
                                        >
                                            <Link
                                                to={`/product/${item.product}`}
                                                className={classes.itemDetails}
                                            >
                                                {item.name}
                                            </Link>
                                        </Typography>

                                        <Typography
                                            gutterBottom
                                            variant="body1"
                                            className={classes.itemDetails}
                                        >
                                            {item.qty} x {item.price} = $
                                            {item.qty * item.price}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Paper>
                        )}
                    </Typography>
                </Grid>

                <Grid item xs={1}>
                    <Divider orientation="vertical" />
                </Grid>

                <Grid item xs={3}>
                    <List
                        component="div"
                        aria-label="secondary summary folders"
                    >
                        <ListItem>
                            <ListItemText
                                primary="Order Summary:"
                                className={classes.listTitle}
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemText secondary="Items" />
                            <Typography gutterBottom variant="body1">
                                ${cart.itemsPrice}
                            </Typography>
                        </ListItem>

                        <ListItem>
                            <ListItemText secondary="Shipping" />
                            <Typography gutterBottom variant="body1">
                                ${cart.shippingPrice}
                            </Typography>
                        </ListItem>

                        <ListItem>
                            <ListItemText secondary="Tax" />
                            <Typography gutterBottom variant="body1">
                                ${cart.taxPrice}
                            </Typography>
                        </ListItem>

                        <ListItem>
                            <ListItemText secondary="Total" />
                            <Typography gutterBottom variant="body1">
                                ${cart.totalPrice}
                            </Typography>
                        </ListItem>

                        <ListItem>
                            {error && (
                                <DescriptionAlerts
                                    title={"Error"}
                                    content={error}
                                    alert={" "}
                                />
                            )}
                        </ListItem>

                        <Button
                            type="button"
                            variant="outlined"
                            className={classes.actionButton}
                            disabled={cart.cartItems === 0}
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </Button>
                    </List>
                </Grid>
            </Grid>
        </div>
    );
};

export default PlaceOrderScreen;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
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
import { LinearBuffer } from "../components/Loader";
import Alert from "@material-ui/lab/Alert";
import {
    getOrderDetails,
    payOrder,
    deliverOrder,
} from "../actions/orderActions";
import {
    ORDER_PAY_RESET,
    ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        paddingTop: "15vh",
        paddingLeft: "5.5em",
        fontWeight: 700,
        fontSize: "1.25em",
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
    grid_order: {
        "& h6": {
            margin: "1.5rem 0",
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

        "&:hover": {
            background: "#856046",
            color: "#fff",
        },
    },
}));

const OrderScreen = ({ match, history }) => {
    const classes = useStyles();

    const orderId = match.params.id;

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    if (!loading) {
        /* calculate prices */
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        };

        order.itemsPrice = addDecimals(
            order.orderItems.reduce(
                (acc, item) => acc + item.price * item.qty,
                0
            )
        );
    }

    useEffect(() => {
        if (!userInfo) {
            history.push("/login");
        }

        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get("/api/config/paypal");
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };

            document.body.appendChild(script);
        };

        if (!order || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [
        dispatch,
        orderId,
        successPay,
        order,
        successDeliver,
        userInfo,
        history,
    ]);

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult);
        dispatch(payOrder(orderId, paymentResult));
    };

    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    };

    return loading ? (
        <LinearBuffer />
    ) : error ? (
        <DescriptionAlerts
            title="Error"
            content=""
            alert="Please double check to make sure!"
        />
    ) : (
        <>
            <Typography component="h1" className={classes.title}>
                Order: {order._id}
            </Typography>

            <div className={classes.root}>
                <Grid container spacing={2} className={classes.gridContainer}>
                    <Grid item xs={8} className={classes.grid_order}>
                        <Typography component="h6">
                            <strong>Name: </strong>
                            {order.user.name}
                        </Typography>

                        <Typography component="h6">
                            <strong>Email: </strong>
                            <Link
                                to={`mailto:${order.user.email}`}
                                style={{ color: "#3c3c3c" }}
                            >
                                {order.user.email}
                            </Link>
                        </Typography>

                        <Typography component="h6">
                            <>
                                <strong>Address: </strong>
                                {order.shippingAddress.address},{" "}
                                {order.shippingAddress.city}{" "}
                                {order.shippingAddress.postalCode},{" "}
                                {order.shippingAddress.country}
                            </>

                            {order.isDelivered ? (
                                <Alert severity="success" variant="outlined">
                                    Delivered on {order.deliveredAt}
                                </Alert>
                            ) : (
                                <Alert severity="error" variant="outlined">
                                    Not Delivered
                                </Alert>
                            )}
                        </Typography>

                        <Typography component="h6">
                            <>
                                <strong>Method of Payment: </strong>
                                {order.paymentMethod}
                            </>

                            {order.isPaid ? (
                                <Alert severity="success" variant="outlined">
                                    Paid on {order.paidAt}
                                </Alert>
                            ) : (
                                <Alert severity="error" variant="outlined">
                                    Not Paid
                                </Alert>
                            )}
                        </Typography>

                        <Typography component="h6">
                            <strong>Order Items: </strong>
                            {order.orderItems.length === 0 ? (
                                <DescriptionAlerts
                                    title={"Empty Oder"}
                                    content={" Your order is empty — "}
                                    alert={"please go back to product page!"}
                                />
                            ) : (
                                <Paper className={classes.paper}>
                                    {order.orderItems.map((item, index) => (
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
                                                    className={
                                                        classes.itemDetails
                                                    }
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
                                    ${order.itemsPrice}
                                </Typography>
                            </ListItem>

                            <ListItem>
                                <ListItemText secondary="Shipping" />
                                <Typography gutterBottom variant="body1">
                                    ${order.shippingPrice}
                                </Typography>
                            </ListItem>

                            <ListItem>
                                <ListItemText secondary="Tax" />
                                <Typography gutterBottom variant="body1">
                                    ${order.taxPrice}
                                </Typography>
                            </ListItem>

                            <ListItem>
                                <ListItemText secondary="Total" />
                                <Typography gutterBottom variant="body1">
                                    ${order.totalPrice}
                                </Typography>
                            </ListItem>

                            {!order.isPaid && (
                                <ListItem>
                                    {loadingPay && <LinearBuffer />}
                                    {!sdkReady ? (
                                        <LinearBuffer />
                                    ) : (
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={successPaymentHandler}
                                        />
                                    )}
                                </ListItem>
                            )}

                            {loadingDeliver && <LinearBuffer />}

                            {userInfo &&
                                userInfo.isAdmin &&
                                order.isPaid &&
                                !order.isDelivered && (
                                    <ListItem>
                                        <Button
                                            type="submit"
                                            variant="outlined"
                                            className={classes.actionButton}
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListItem>
                                )}
                        </List>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default OrderScreen;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    ButtonBase,
    Grid,
    Paper,
    Typography,
    Breadcrumbs,
    TextField,
    MenuItem,
    Divider,
} from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { DescriptionAlerts } from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: "15vh",
        flexGrow: 1,
    },
    breadcrumbs: {
        [theme.breakpoints.down("md")]: {
            paddingLeft: "7.5vw",
        },
    },
    pageTitle: {
        textAlign: "center",
    },
    gridContainer: {
        margin: "1rem -8px",
        justifyContent: "space-between",
        alignItems: "center",
    },
    paper: {
        padding: theme.spacing(2),
        margin: "auto",
        maxWidth: "80vw",
        boxShadow: "none",
    },
    image: {
        width: 100,
        height: 100,
    },
    img: {
        margin: "auto",
        display: "block",
        maxWidth: "100%",
        maxHeight: "100%",
    },
    linkButton: {
        color: "#3c3c3c",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    backButton: {
        transform: "translateY(100%)",
        color: "rgba(0, 0, 0, 0.67)",
    },
    trashButton: {
        border: "none",
        color: "#3c3c3c",
    },
    actionButton: {
        color: "#3c3c3c",
        border: "1px solid #2c2c2c",
    },
}));

const CartScreen = ({ match, location, history }) => {
    const classes = useStyles();

    const productId = match.params.id;

    /* query string ex: ?qty=1
    split() the query string by equal sign 
    split() returns array of 2 and get the index of 1 which is the qty number
    */
    const qty = location.search ? Number(location.search.split("=")[1]) : 1;

    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty));
        }
    }, [dispatch, productId, qty]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        history.push("/login?redirect=shipping");
    };

    return (
        <div className={classes.root}>
            <Breadcrumbs
                aria-label="go back to previous pages"
                className={classes.breadcrumbs}
            >
                <Link to="/">
                    <Button className={classes.linkButton}>Home</Button>
                </Link>
                <Typography color="textPrimary">Cart</Typography>
            </Breadcrumbs>

            <Typography
                gutterBottom
                variant="h5"
                component="h4"
                className={classes.pageTitle}
            >
                Shopping Cart
            </Typography>

            {cartItems.length === 0 ? (
                <>
                    <DescriptionAlerts
                        title={"Empty Cart"}
                        content={" Your cart is empty — "}
                        alert={"please go back to product page!"}
                    />
                    <Grid item>
                        <Link to={`/`}>
                            <Button
                                variant="outlined"
                                className={classes.backButton}
                            >
                                Go back
                            </Button>
                        </Link>
                    </Grid>
                </>
            ) : (
                <Paper className={classes.paper}>
                    <Divider variant="fullWidth" />

                    {cartItems.map((item) => (
                        <Grid
                            container
                            className={classes.gridContainer}
                            key={item.product}
                        >
                            <ButtonBase className={classes.image}>
                                <img
                                    className={classes.img}
                                    alt={item.name}
                                    src={item.image}
                                />
                            </ButtonBase>

                            <Typography gutterBottom variant="body2">
                                <Link
                                    to={`/product/${item.product}`}
                                    className={classes.linkButton}
                                >
                                    {item.name}
                                </Link>
                            </Typography>

                            <Typography gutterBottom variant="body1">
                                {item.price}
                            </Typography>

                            <TextField
                                id="outlined-select-qty"
                                select
                                label="Qty"
                                className={classes.qty}
                                value={item.qty}
                                onChange={(e) =>
                                    dispatch(
                                        addToCart(
                                            item.product,
                                            Number(e.target.value)
                                        )
                                    )
                                }
                                variant="outlined"
                            >
                                {[...Array(item.countInStock).keys()].map(
                                    (option) => (
                                        <MenuItem
                                            key={option + 1}
                                            value={option + 1}
                                        >
                                            {option + 1}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>

                            <Button
                                variant="outlined"
                                className={classes.trashButton}
                                onClick={() =>
                                    removeFromCartHandler(item.product)
                                }
                            >
                                <DeleteOutlineOutlinedIcon />
                            </Button>
                        </Grid>
                    ))}

                    <Divider variant="fullWidth" />

                    <Grid container className={classes.gridContainer}>
                        <Typography gutterBottom variant="body2">
                            Subtotal:{" "}
                            <strong>
                                {cartItems.reduce(
                                    (accu, item) => accu + item.qty,
                                    0
                                )}
                            </strong>{" "}
                            items
                        </Typography>

                        <Typography gutterBottom variant="body1">
                            $
                            {cartItems
                                .reduce(
                                    (accu, item) =>
                                        accu + item.qty * item.price,
                                    0
                                )
                                .toFixed(2)}
                        </Typography>

                        <Button
                            variant="outlined"
                            className={classes.actionButton}
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </Button>
                    </Grid>
                </Paper>
            )}
        </div>
    );
};

export default CartScreen;

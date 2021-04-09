import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    ButtonBase,
    Grid,
    Paper,
    Typography,
    Breadcrumbs,
    TextField,
    TextareaAutosize,
    MenuItem,
    Fab,
    Zoom,
    useScrollTrigger,
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "../components/Rating";
import { LinearBuffer } from "../components/Loader";
import { DescriptionAlerts } from "../components/Message";
import Meta from "../components/Meta";
import {
    listProductDetails,
    createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

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
    linkButton: {
        color: "#3c3c3c",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    paper: {
        padding: theme.spacing(2),
        margin: "auto",
        maxWidth: "80vw",
        boxShadow: "none",
    },
    image: {
        width: 300,
        height: 300,
    },
    img: {
        margin: "auto",
        display: "block",
        maxWidth: "100%",
        maxHeight: "100%",
    },
    qty: {
        marginTop: theme.spacing(2),
        display: "block",
        "& label": {
            color: "#3c3c3c",
            fontWeight: 900,
        },
    },
    rating: {
        marginBottom: ".65em",
        marginTop: "1em",
    },
    actionButton: {
        color: "#3c3c3c",
        border: "1px solid #2c2c2c",
        marginTop: ".75em",
    },
    backButton: {
        transform: "translateY(100%)",
        color: "rgba(0, 0, 0, 0.67)",
    },
    backToTopBtn: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        backgroundColor: "#de8787 !important",

        "&:hover": {
            backgroundColor: "#f50057 !important",
        },
    },
}));

const ProductScreen = ({ history, match }) => {
    const classes = useStyles();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const dispatch = useDispatch();
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productReviewCreate = useSelector(
        (state) => state.productReviewCreate
    );
    const {
        success: successProductReview,
        error: errorProductReview,
    } = productReviewCreate;

    useEffect(() => {
        if (successProductReview) {
            alert("Review Submittted!");
            setRating(1);
            setComment("");
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
        dispatch(listProductDetails(match.params.id));
    }, [dispatch, match, successProductReview]);

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            createProductReview(match.params.id, {
                rating,
                comment,
            })
        );
    };

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleBackToTopBtnClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            "#back-to-top-anchor"
        );

        if (anchor) {
            anchor.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <div className={classes.root} id="back-to-top-anchor">
            <Breadcrumbs
                aria-label="go back to previous pages"
                className={classes.breadcrumbs}
            >
                <Link to="/">
                    <Button className={classes.linkButton}>Home</Button>
                </Link>
                <Typography color="textPrimary">Products</Typography>
            </Breadcrumbs>

            {loading ? (
                <LinearBuffer />
            ) : error ? (
                <DescriptionAlerts
                    title={"Error Error"}
                    content={" This is an error alert — "}
                    alert={"check it out!"}
                />
            ) : (
                <>
                    <Meta title={product.name} />

                    <Paper className={classes.paper}>
                        <Grid container spacing={4}>
                            <Grid item>
                                <ButtonBase className={classes.image}>
                                    <img
                                        className={classes.img}
                                        alt={product.name}
                                        src={product.image}
                                    />
                                </ButtonBase>
                            </Grid>

                            <Grid item xs={12} sm container>
                                <Grid
                                    item
                                    xs
                                    container
                                    direction="column"
                                    spacing={2}
                                >
                                    <Grid item xs>
                                        <Typography gutterBottom variant="h5">
                                            {product.name}
                                        </Typography>

                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {product.brand}
                                        </Typography>

                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                        >
                                            {product.description}
                                        </Typography>

                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {product.category}
                                        </Typography>

                                        <Grid item>
                                            <Typography
                                                variant="subtitle1"
                                                style={{ cursor: "pointer" }}
                                            >
                                                <Rating
                                                    value={product.rating}
                                                    text={`${product.numReviews} reviews`}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Typography variant="h6" gutterBottom>
                                            ${product.price}
                                        </Typography>

                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            Status:{" "}
                                            <strong>
                                                {product.countInStock > 0
                                                    ? "In Stock"
                                                    : "Out Of Stock"}
                                            </strong>
                                        </Typography>

                                        {product.countInStock > 0 && (
                                            <TextField
                                                id="outlined-select-qty"
                                                select
                                                label="Qty"
                                                className={classes.qty}
                                                value={qty}
                                                onChange={(e) =>
                                                    setQty(e.target.value)
                                                }
                                                variant="outlined"
                                            >
                                                {[
                                                    ...Array(
                                                        product.countInStock
                                                    ).keys(),
                                                ].map((option) => (
                                                    <MenuItem
                                                        key={option + 1}
                                                        value={option + 1}
                                                    >
                                                        {option + 1}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}

                                        <Button
                                            variant="outlined"
                                            className={classes.actionButton}
                                            disabled={
                                                product.countInStock === 0
                                            }
                                            onClick={addToCartHandler}
                                        >
                                            Add to Cart
                                        </Button>
                                    </Grid>

                                    <Grid item style={{ margin: "1.5em 0" }}>
                                        <Typography
                                            gutterBottom
                                            component="h2"
                                            variant="h5"
                                        >
                                            Reviews
                                        </Typography>

                                        {product.reviews.length === 0 && (
                                            <DescriptionAlerts
                                                title={"No Review"}
                                                content={
                                                    "There is no review yet"
                                                }
                                            />
                                        )}

                                        <Grid item>
                                            {product.reviews.map((review) => (
                                                <Grid item key={review._id}>
                                                    <strong
                                                        style={{
                                                            marginBottom:
                                                                ".35em",
                                                            color: "#3c3c3c",
                                                        }}
                                                    >
                                                        {review.name}
                                                    </strong>
                                                    <Rating
                                                        gutterBottom
                                                        value={review.rating}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        gutterBottom
                                                        color="textSecondary"
                                                    >
                                                        {review.createdAt.substring(
                                                            0,
                                                            10
                                                        )}
                                                    </Typography>
                                                    <Typography
                                                        gutterBottom
                                                        variant="body1"
                                                        style={{
                                                            color: "#3c3c3c",
                                                        }}
                                                    >
                                                        {review.comment}
                                                    </Typography>
                                                </Grid>
                                            ))}

                                            <Grid
                                                item
                                                style={{ margin: "1em 0" }}
                                            >
                                                <Typography
                                                    gutterBottom
                                                    component="h2"
                                                    variant="subtitle2"
                                                >
                                                    Leave a Custom Reviews
                                                </Typography>

                                                {errorProductReview && (
                                                    <DescriptionAlerts
                                                        title={"Error"}
                                                        content={
                                                            errorProductReview
                                                        }
                                                    />
                                                )}

                                                {userInfo ? (
                                                    <Grid
                                                        item
                                                        xs={6}
                                                        container
                                                        direction="column"
                                                        alignItems="flex-start"
                                                    >
                                                        <TextField
                                                            id="outlined-select-rating"
                                                            className={
                                                                classes.rating
                                                            }
                                                            select
                                                            label="Rating"
                                                            value={rating}
                                                            variant="outlined"
                                                            onChange={(e) =>
                                                                setRating(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            {[
                                                                1,
                                                                2,
                                                                3,
                                                                4,
                                                                5,
                                                            ].map((option) => (
                                                                <MenuItem
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>

                                                        <TextareaAutosize
                                                            aria-label="minimum height"
                                                            rowsMin={3}
                                                            placeholder="Comment"
                                                            value={comment}
                                                            onChange={(e) =>
                                                                setComment(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                        <Button
                                                            variant="outlined"
                                                            className={
                                                                classes.actionButton
                                                            }
                                                            onClick={
                                                                submitHandler
                                                            }
                                                        >
                                                            Submit
                                                        </Button>
                                                    </Grid>
                                                ) : (
                                                    <Typography
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            color: "#de8787",
                                                        }}
                                                    >
                                                        Please{" "}
                                                        <Link to="/login">
                                                            <Button
                                                                className={
                                                                    classes.linkButton
                                                                }
                                                            >
                                                                Login
                                                            </Button>
                                                        </Link>{" "}
                                                        to write a review{" "}
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Link to="/">
                                <Button
                                    variant="outlined"
                                    className={classes.backButton}
                                >
                                    Go back
                                </Button>
                            </Link>
                        </Grid>
                    </Paper>

                    <Zoom in={trigger}>
                        <Fab
                            color="secondary"
                            size="small"
                            aria-label="scroll back to top"
                            className={classes.backToTopBtn}
                            onClick={handleBackToTopBtnClick}
                        >
                            <KeyboardArrowUpIcon />
                        </Fab>
                    </Zoom>
                </>
            )}
        </div>
    );
};

export default ProductScreen;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, CardContent, Typography } from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import { LinearBuffer } from "./Loader";
import { DescriptionAlerts } from "./Message";
import { listTopProducts } from "../actions/productActions";
import { PRODUCT_TOP_RESET } from "../constants/productConstants";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        paddingTop: "10vh",
        width: "65%",
        height: "auto",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    paper: {
        boxShadow: "none",
    },
}));

const ProductCarousel = () => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const productTopRated = useSelector((state) => state.productTopRated);
    const { loading, error, products } = productTopRated;

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            dispatch(listTopProducts());
        }
        dispatch({ type: PRODUCT_TOP_RESET });
        return () => (mounted = false);
    }, [dispatch]);

    return loading ? (
        <LinearBuffer />
    ) : error ? (
        <DescriptionAlerts content={error} />
    ) : (
        <Carousel
            className={classes.root}
            autoPlay={false}
            stopAutoPlayOnHover
            navButtonsAlwaysVisible
            swipe
        >
            {products.map((product) => (
                <Paper key={product._id} className={classes.paper}>
                    <Link to={`/product/${product._id}`}>
                        <img src={product.image} alt={product.title} />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                                style={{ color: "#3c3c3c" }}
                            >
                                {product.name}
                            </Typography>
                            <Typography
                                variant="h6"
                                color="textSecondary"
                                component="h5"
                            >
                                ${product.price}
                            </Typography>
                        </CardContent>
                    </Link>
                </Paper>
            ))}
        </Carousel>
    );
};

export default ProductCarousel;

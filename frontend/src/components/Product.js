import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { makeStyles } from "@material-ui/core/styles";
import {
    Card,
    CardActionArea,
    // CardActions,
    CardContent,
    CardMedia,
    // IconButton,
    Typography,
} from "@material-ui/core";
// import FavoriteIcon from "@material-ui/icons/Favorite";
// import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "22vw",
        [theme.breakpoints.down("sm")]: {
            maxWidth: "initial",
        },
    },
    media: {
        height: 275,
    },
    cardActions: {
        justifyContent: "space-between",
    },
    color: {
        color: "#de8192",
    },
}));

const Product = ({ product }) => {
    const classes = useStyles();

    return (
        <div style={{ width: "100%", display: "grid", gap: "10px" }}>
            <Card className={classes.root}>
                <CardActionArea>
                    <Link to={`/product/${product._id}`}>
                        <CardMedia
                            className={classes.media}
                            image={product.image}
                            title={product.name}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="body1"
                                component="h6"
                                color="textSecondary"
                            >
                                {product.name}
                            </Typography>

                            <Typography
                                gutterBottom
                                variant="body2"
                                color="textSecondary"
                                component="div"
                            >
                                <Rating
                                    value={product.rating}
                                    text={`${product.numReviews} reviews`}
                                />
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
                </CardActionArea>
                {/* <CardActions className={classes.cardActions}>
                    <IconButton
                        aria-label="add to favorites"
                        size="small"
                        className={classes.color}
                    >
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton
                        aria-label="show more"
                        size="small"
                        color="default"
                    >
                        <MoreHorizIcon />
                    </IconButton>
                </CardActions> */}
            </Card>
        </div>
    );
};

export default Product;

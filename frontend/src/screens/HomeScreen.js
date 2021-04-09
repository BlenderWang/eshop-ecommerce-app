import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    GridListTile,
    ListSubheader,
    Button,
    Breadcrumbs,
    Fab,
    Zoom,
    useScrollTrigger,
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Product from "../components/Product";
import ProductCarousel from "../components/ProductCarousel";
import Paginate from "../components/Paginate";
import { LinearBuffer } from "../components/Loader";
import { DescriptionAlerts } from "../components/Message";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        paddingTop: "7vh",
    },
    breadcrumbs: {
        marginTop: "14.5vh",
        paddingLeft: "3.5vw",

        [theme.breakpoints.down("md")]: {
            paddingLeft: "7.5vw",
            marginTop: "12vh",
            marginBottom: "-8vh",
        },
    },
    linkButton: {
        color: "#3c3c3c",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    listSubheader: {
        fontSize: "1.1rem",
    },
    gridListTile: {
        listStyle: "none",
        height: "auto",
        textAlign: "center",
    },
    gridProductItems: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        justifyItems: "center",
        gap: "10px",
        [theme.breakpoints.down("md")]: {
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2em",
            padding: "0 5rem",
        },
        [theme.breakpoints.down("sm")]: {
            gridTemplateColumns: "1fr",
            padding: "initial",
        },
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

const HomeScreen = ({ match }) => {
    const classes = useStyles();

    const keyword = match.params.keyword;

    const pageNumber = match.params.pageNumber || 1;

    const dispatch = useDispatch();

    /* to grab the particular state wanted using useSelector */
    const productList = useSelector((state) => state.productList);
    /* destruct components from productList */
    const { loading, error, products, page, pages } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, keyword, pageNumber]);

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
        <>
            <Meta />

            <div id="back-to-top-anchor" />

            {!keyword ? (
                <ProductCarousel />
            ) : (
                <Breadcrumbs
                    aria-label="go back to previous pages"
                    className={classes.breadcrumbs}
                >
                    <Link to="/">
                        <Button className={classes.linkButton}>
                            Back To Home
                        </Button>
                    </Link>
                </Breadcrumbs>
            )}

            <div className={classes.root} spacing={2}>
                <GridListTile
                    key="Subheader"
                    cols={4}
                    className={classes.gridListTile}
                >
                    <ListSubheader
                        component="h3"
                        className={classes.listSubheader}
                    >
                        Latest Products
                    </ListSubheader>
                </GridListTile>

                {loading ? (
                    <LinearBuffer />
                ) : error ? (
                    <DescriptionAlerts />
                ) : (
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Grid
                                container
                                className={classes.gridProductItems}
                            >
                                {products.map((product) => (
                                    <Grid item key={product._id}>
                                        <Product product={product} />
                                    </Grid>
                                ))}
                            </Grid>
                            <Paginate
                                pages={pages}
                                page={page}
                                keyword={keyword ? keyword : ""}
                            />
                        </Grid>
                    </Grid>
                )}
            </div>

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
    );
};

export default HomeScreen;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { LinearBuffer } from "../components/Loader";
import Paginate from "../components/Paginate";
import {
    listProducts,
    deleteProduct,
    createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: "7rem",
        textTransform: "uppercase",
    },
    table: {
        minWidth: 650,
    },
    link: {
        color: "#3c3c3c",
    },
    createIcon: {
        color: "#2c89a0",
        marginTop: "6rem",
        textTransform: "uppercase",

        "& .MuiSvgIcon-root": {
            marginRight: "12px",
        },
    },
}));

const ProductListScreen = ({ history, match }) => {
    const classes = useStyles();

    const pageNumber = match.params.pageNumber || 1;

    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;

    const productDelete = useSelector((state) => state.productDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = productDelete;

    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct,
    } = productCreate;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET });

        if (!userInfo && userInfo.isAdmin) {
            history.push("/login");
        }

        if (successCreate) {
            history.push(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(listProducts("", pageNumber));
        }
    }, [
        dispatch,
        userInfo,
        history,
        successDelete,
        successCreate,
        createdProduct,
        pageNumber,
    ]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure?")) {
            dispatch(deleteProduct(id));
        }
    };

    const createProductHandler = () => {
        dispatch(createProduct());
    };

    return (
        <div style={{ marginTop: "5vh", padding: "1em" }}>
            <Grid
                container
                justify="space-between"
                style={{ marginBottom: "2em" }}
            >
                <Typography
                    component="h1"
                    variant="h4"
                    className={classes.title}
                >
                    Products
                </Typography>

                <IconButton
                    aria-label="create"
                    className={classes.createIcon}
                    onClick={createProductHandler}
                >
                    <AddCircleOutlineOutlinedIcon />
                    <Typography variant="body1">create product</Typography>
                </IconButton>
            </Grid>

            {loadingDelete && <LinearBuffer />}
            {errorDelete && (
                <Alert severity="error" variant="outlined">
                    {errorDelete}
                </Alert>
            )}

            {loadingCreate && <LinearBuffer />}
            {errorCreate && (
                <Alert severity="error" variant="outlined">
                    {errorCreate}
                </Alert>
            )}

            {loading ? (
                <LinearBuffer />
            ) : error ? (
                <Alert severity="error" variant="outlined">
                    {error}
                </Alert>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table
                            className={classes.table}
                            size="small"
                            aria-label="a dense table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">ID</TableCell>
                                    <TableCell align="right">NAME</TableCell>
                                    <TableCell align="right">PRICE</TableCell>
                                    <TableCell align="right">
                                        CATEGORY
                                    </TableCell>
                                    <TableCell align="right">BRAND</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell component="th" scope="row">
                                            {product._id}
                                        </TableCell>
                                        <TableCell align="right">
                                            {product.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            ${product.price}
                                        </TableCell>
                                        <TableCell align="right">
                                            {product.category}
                                        </TableCell>
                                        <TableCell align="right">
                                            {product.brand}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                            >
                                                <IconButton aria-label="edit">
                                                    <EditIcon />
                                                </IconButton>
                                            </Link>
                                            <IconButton
                                                aria-label="trash"
                                                color="secondary"
                                                onClick={() =>
                                                    deleteHandler(product._id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Paginate
                        page={page}
                        pages={pages}
                        isAdmin={true}
                        className={classes.paginate}
                    />
                </>
            )}
        </div>
    );
};

export default ProductListScreen;

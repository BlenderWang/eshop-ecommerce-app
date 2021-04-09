import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Breadcrumbs,
    Button,
    Divider,
    Typography,
    TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";
import { DescriptionAlerts } from "../components/Message";
import { LinearBuffer } from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

const useStyle = makeStyles((theme) => ({
    root: {
        paddingTop: "15vh",
        flexGrow: 1,
    },
    link: {
        color: "#3c3c3c",
    },
    title: {
        marginTop: "1em",
        marginBottom: theme.spacing(2),
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
    textField: {
        "& .MuiFormLabel-root.Mui-focused": {
            color: "#856046",
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#856046",
            },
        },
    },
    actionBtn: {
        margin: theme.spacing(1),
        marginLeft: 0,
        background: "#856046",
        color: "#fff",
        border: "1px solid #856046",

        "&:hover": {
            background: "#3c3c3c",
            color: "#f1f1f1",
            border: "1px solid rgba(0, 0, 0, 0.23)",
        },
    },
    checkboxControl: {
        width: "100%",

        "& .MuiCheckbox-colorPrimary.Mui-checked": {
            color: "#2c89a0",
        },
    },
    uploadBtn: {
        backgroundColor: "#2c89a0",
        color: "#fff",
        margin: "1em 0",

        "&:hover": {
            backgroundColor: "#3c3c3c",
        },
    },
}));

const ProductEditScreen = ({ match, history }) => {
    const classes = useStyle();

    /* getting id from the url which is part of the params */
    const productId = match.params.id;

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();

    /* get info from the state */
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const productUpdate = useSelector((state) => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            history.push("/admin/productlist");
        } else {
            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId));
            } else {
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
            }
        }
    }, [dispatch, history, productId, product, successUpdate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        setUploading(true);

        try {
            const config = {
                Headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data } = await axios.post("/api/upload", formData, config);

            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(
            updateProduct({
                _id: productId,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
            })
        );
    };

    return (
        <div className={classes.root}>
            <Breadcrumbs
                aria-label="go back to user list"
                className={classes.breadcrumbs}
            >
                <Link to="/">
                    <Button className={classes.link}>Home</Button>
                </Link>
                <Link to="/admin/productlist" className={classes.link}>
                    Product List
                </Link>
                <Typography color="textPrimary">{name}</Typography>
            </Breadcrumbs>

            <Divider variant="fullWidth" />

            <FormContainer>
                <Typography component="h1" className={classes.title}>
                    Edit Product
                </Typography>

                {loadingUpdate && <LinearBuffer />}
                {errorUpdate && (
                    <DescriptionAlerts
                        title={"Error"}
                        content={errorUpdate}
                        alert={"Please fix it!"}
                    />
                )}

                {loading ? (
                    <LinearBuffer />
                ) : error ? (
                    <DescriptionAlerts
                        title={"Oops!"}
                        content={"There is an error — "}
                        alert={"please check it out!"}
                    />
                ) : (
                    <form
                        className={classes.form}
                        noValidate
                        autoComplete="off"
                        onSubmit={submitHandler}
                    >
                        <TextField
                            required
                            className={classes.textField}
                            id="outlined-name-input"
                            type="name"
                            value={name}
                            fullWidth
                            label="Name"
                            variant="outlined"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <TextField
                            required
                            className={classes.textField}
                            id="outlined-price-input"
                            type="number"
                            value={price}
                            fullWidth
                            label="Price"
                            variant="outlined"
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <>
                            <TextField
                                required
                                className={classes.textField}
                                id="outlined-image-input"
                                placeholder="Enter image url"
                                type="text"
                                value={image}
                                fullWidth
                                label="Image URL"
                                variant="outlined"
                                onChange={(e) => setImage(e.target.value)}
                            />
                            <label htmlFor="upload-photo">
                                <input
                                    style={{ display: "none" }}
                                    id="upload-photo"
                                    name="upload-photo"
                                    type="file"
                                    onChange={uploadFileHandler}
                                />

                                <Button
                                    className={classes.uploadBtn}
                                    variant="contained"
                                    component="span"
                                >
                                    Choose image
                                </Button>
                            </label>
                            {uploading && <LinearBuffer />}
                        </>

                        <TextField
                            required
                            className={classes.textField}
                            id="outlined-brand-input"
                            type="text"
                            value={brand}
                            fullWidth
                            label="Brand"
                            variant="outlined"
                            onChange={(e) => setBrand(e.target.value)}
                        />

                        <TextField
                            required
                            className={classes.textField}
                            id="outlined-category-input"
                            type="text"
                            value={category}
                            fullWidth
                            label="Category"
                            variant="outlined"
                            onChange={(e) => setCategory(e.target.value)}
                        />

                        <TextField
                            required
                            className={classes.textField}
                            id="outlined-countInStock-input"
                            type="number"
                            value={countInStock}
                            fullWidth
                            label="Count In Stock"
                            variant="outlined"
                            onChange={(e) => setCountInStock(e.target.value)}
                        />

                        <TextField
                            required
                            className={classes.textField}
                            id="outlined-description-input"
                            type="text"
                            value={description}
                            fullWidth
                            label="Description"
                            variant="outlined"
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <Button
                            type="submit"
                            variant="outlined"
                            className={classes.actionBtn}
                        >
                            Update
                        </Button>
                    </form>
                )}
            </FormContainer>
        </div>
    );
};

export default ProductEditScreen;

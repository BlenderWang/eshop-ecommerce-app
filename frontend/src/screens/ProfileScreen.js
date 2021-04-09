import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Divider,
    Grid,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";
import { DescriptionAlerts } from "../components/Message";
import { LinearBuffer } from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";

const useStyle = makeStyles((theme) => ({
    title: {
        marginTop: "25vh",
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
    registerText: {
        color: "#3c3c3c",
        margin: theme.spacing(1),
        marginLeft: 0,
    },
    registerLink: {
        color: "#856046",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    divider: {
        display: "grid",
        justifyItems: "center",
    },
    root: {
        "& .MuiAlert-standardSuccess": {
            color: "#4caf50",
        },
    },
}));

const ProfileScreen = ({ location, history }) => {
    const classes = useStyle();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success } = userUpdateProfile;

    const orderListMy = useSelector((state) => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

    useEffect(() => {
        if (!userInfo) {
            history.push(`/login`);
        } else {
            if (!user.name) {
                dispatch(getUserDetails("profile"));
                dispatch(listMyOrders());
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, history, user, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) setMessage("Passwords do not match!");
        else {
            /* dispatch update profile */
            dispatch(
                updateUserProfile({ id: user._id, name, email, password })
            );
        }
    };

    return (
        <Grid container spacing={3} className={classes.root}>
            <Grid item xs={3}>
                <Typography
                    component="h1"
                    variant="h3"
                    className={classes.title}
                >
                    User Profile
                </Typography>

                {message && (
                    <DescriptionAlerts
                        title={"Oops!"}
                        content={"Your passwords do not match — "}
                        alert={"please make sure they are the same!"}
                    />
                )}

                {error && (
                    <DescriptionAlerts
                        title={"Oops!"}
                        content={"Empty name, email or password fields — "}
                        alert={
                            "please make sure all required fields are filled!"
                        }
                    />
                )}

                {success && <Alert severity="success">Profile updated!</Alert>}

                {loading && <LinearBuffer />}

                <Divider variant="fullWidth" />

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
                        label="Name"
                        type="name"
                        placeholder="Your name"
                        value={name}
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        required
                        className={classes.textField}
                        id="outlined-email-input"
                        label="Email"
                        type="email"
                        placeholder="john@email.com"
                        value={email}
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        required
                        className={classes.textField}
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        placeholder="password"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField
                        required
                        className={classes.textField}
                        id="outlined-confirm-password-input"
                        label="Confirm Password"
                        type="password"
                        placeholder="confirm password"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="outlined"
                        className={classes.actionBtn}
                    >
                        Update
                    </Button>
                </form>

                <Grid item style={{ paddingTop: "1.5rem" }}>
                    <Link to="/">
                        <Button
                            variant="outlined"
                            className={classes.backButton}
                        >
                            Go back
                        </Button>
                    </Link>
                </Grid>
            </Grid>

            <Grid item xs={1} className={classes.divider}>
                <Divider orientation="vertical" flexItem />
            </Grid>

            <Grid item xs={8}>
                <Typography
                    component="h1"
                    variant="h3"
                    className={classes.title}
                >
                    My Orders
                </Typography>

                {loadingOrders ? (
                    <LinearBuffer />
                ) : errorOrders ? (
                    <Alert severity="error">{errorOrders}</Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table
                            className={classes.table}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">ID</TableCell>
                                    <TableCell align="right">DATE</TableCell>
                                    <TableCell align="right">TOTAL</TableCell>
                                    <TableCell align="right">PAID</TableCell>
                                    <TableCell align="right">
                                        DELIVERED
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell component="th" scope="row">
                                            {order._id}
                                        </TableCell>
                                        <TableCell align="right">
                                            {order.createdAt.substring(0, 10)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {order.totalPrice}
                                        </TableCell>
                                        <TableCell align="right">
                                            {order.isPaid ? (
                                                order.paidAt.substring(0, 10)
                                            ) : (
                                                <i
                                                    className="fas fa-times"
                                                    style={{ color: "red" }}
                                                ></i>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {order.isDelivered ? (
                                                order.deliveredAt.substring(
                                                    0,
                                                    10
                                                )
                                            ) : (
                                                <HighlightOffOutlinedIcon />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Link to={`/order/${order._id}`}>
                                                <Button
                                                    variant="outlined"
                                                    className={
                                                        classes.actionBtn
                                                    }
                                                >
                                                    Details
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Grid>
        </Grid>
    );
};

export default ProfileScreen;

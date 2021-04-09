import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
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
import DetailsRoundedIcon from "@material-ui/icons/DetailsRounded";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { LinearBuffer } from "../components/Loader";
import { listOrders } from "../actions/orderActions";

const useStyles = makeStyles({
    title: {
        marginTop: "7rem",
    },
    table: {
        minWidth: 650,
    },
    link: {
        color: "#3c3c3c",
    },
    admin: {
        color: "#4caf50",
    },
    user: {
        color: "#f50057",
    },
});

const OrderListScreen = ({ history }) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders());
        } else {
            history.push("/login");
        }
    }, [dispatch, userInfo, history]);

    return (
        <div>
            <Typography component="h1" variant="h4" className={classes.title}>
                Orders
            </Typography>

            {loading ? (
                <LinearBuffer />
            ) : error ? (
                <Alert severity="error" variant="outlined">
                    {error}
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">ID</TableCell>
                                <TableCell align="right">USER</TableCell>
                                <TableCell align="right">DATE</TableCell>
                                <TableCell align="right">TOTAL</TableCell>
                                <TableCell align="right">PAID</TableCell>
                                <TableCell align="right">DELIVERED</TableCell>
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
                                        {order.user.name && order.user.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {order.createdAt.substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="right">
                                        ${order.totalPrice}
                                    </TableCell>
                                    <TableCell align="right">
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <CancelIcon
                                                className={classes.user}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <CancelIcon
                                                className={classes.user}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link to={`/order/${order._id}`}>
                                            <IconButton aria-label="details">
                                                <DetailsRoundedIcon />
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default OrderListScreen;

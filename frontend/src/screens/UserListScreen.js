import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    // Button,
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
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { LinearBuffer } from "../components/Loader";
import { listUsers, deleteUser } from "../actions/userActions";

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

const UserListScreen = ({ history }) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const userList = useSelector((state) => state.userList);
    const { loading, error, users } = userList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector((state) => state.userDelete);
    const { success: successDelete } = userDelete;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers());
        } else {
            history.push("/login");
        }
    }, [dispatch, userInfo, history, successDelete]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure?")) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <div>
            <Typography component="h1" variant="h4" className={classes.title}>
                Users
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
                                <TableCell align="right">NAME</TableCell>
                                <TableCell align="right">EMAIL</TableCell>
                                <TableCell align="right">ADMIN</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell component="th" scope="row">
                                        {user._id}
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <a
                                            href={`mailto:${user.email}`}
                                            className={classes.link}
                                        >
                                            {user.email}
                                        </a>
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.isAdmin ? (
                                            <CheckCircleOutlineRoundedIcon
                                                className={classes.admin}
                                            />
                                        ) : (
                                            <CancelIcon
                                                className={classes.user}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link
                                            to={`/admin/user/${user._id}/edit`}
                                        >
                                            <IconButton aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                        </Link>
                                        <IconButton
                                            aria-label="trash"
                                            color="secondary"
                                            onClick={() =>
                                                deleteHandler(user._id)
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
            )}
        </div>
    );
};

export default UserListScreen;

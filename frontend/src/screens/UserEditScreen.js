import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Breadcrumbs,
    Button,
    Checkbox,
    FormControlLabel,
    Divider,
    Typography,
    TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";
import { DescriptionAlerts } from "../components/Message";
import { LinearBuffer } from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

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
    checkboxControl: {
        width: "100%",

        "& .MuiCheckbox-colorPrimary.Mui-checked": {
            color: "#2c89a0",
        },
    },
}));

const UserEditScreen = ({ match, history }) => {
    const classes = useStyle();

    const userId = match.params.id;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmind] = useState(false);

    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdate = useSelector((state) => state.userUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = userUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET });
            history.push("/admin/userlist");
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId));
            } else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmind(user.isAdmin);
            }
        }
    }, [dispatch, user, userId, successUpdate, history]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(updateUser({ _id: userId, name, email, isAdmin }));
    };

    return (
        <>
            <Breadcrumbs
                aria-label="go back to user list"
                className={classes.breadcrumbs}
            >
                <Link to="/admin/userlist" className={classes.link}>
                    Back
                </Link>
            </Breadcrumbs>

            <Divider variant="fullWidth" />

            <FormContainer>
                <Typography component="h1" className={classes.title}>
                    Edit User
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
                            variant="outlined"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <TextField
                            required
                            className={classes.textField}
                            id="outlined-email-input"
                            type="email"
                            value={email}
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isAdmin}
                                        onChange={(e) =>
                                            setIsAdmind(e.target.checked)
                                        }
                                        name="is_admin"
                                        color="primary"
                                    />
                                }
                                label="Is Admin"
                                className={classes.checkboxControl}
                            />
                        </>

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
        </>
    );
};

export default UserEditScreen;

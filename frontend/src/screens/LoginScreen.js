import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";
import { DescriptionAlerts } from "../components/Message";
import { LinearBuffer } from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";

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
}));

const LoginScreen = ({ location, history }) => {
    const classes = useStyle();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error, userInfo } = userLogin;

    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {
        if (userInfo) {
            history.push(redirect);
        }
    }, [history, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <FormContainer>
            <Typography component="h1" className={classes.title}>
                Login
            </Typography>

            {error && (
                <DescriptionAlerts
                    title={"Oops!"}
                    content={"Invalid email or password — "}
                    alert={"please make sure your login info is correct!"}
                />
            )}

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
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    placeholder="john@email.com"
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

                <Button
                    type="submit"
                    variant="outlined"
                    className={classes.actionBtn}
                >
                    Log In
                </Button>

                <Typography variant="body1" className={classes.registerText}>
                    New customer?{" "}
                    <Link
                        className={classes.registerLink}
                        to={
                            redirect
                                ? `/register?redirect=${redirect}`
                                : "/register"
                        }
                    >
                        Register an account
                    </Link>
                </Typography>
            </form>
        </FormContainer>
    );
};

export default LoginScreen;

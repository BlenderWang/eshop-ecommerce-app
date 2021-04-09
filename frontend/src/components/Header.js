import React from "react";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../ecommerce.svg";
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Button,
    Menu,
    MenuItem,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "#3c3c3c",
        position: "fixed",
    },
    title: {
        flexGrow: 1,
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block",
        },
    },
    link: {
        display: "flex",
        alignItems: "center",
    },
    toggleBtn: {
        color: "#fff",
    },
}));

const Header = () => {
    const classes = useStyles();

    const refEl = React.useRef();
    const [open, setOpen] = React.useState(false);

    const [anchorElAdmin, setAnchorElAdmin] = React.useState(null);

    const handleClick = (event) => {
        setOpen(Boolean(refEl.current));
    };

    const handleClickAdmin = (e) => {
        setAnchorElAdmin(e.currentTarget);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAdmin = () => {
        setAnchorElAdmin(null);
    };

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <AppBar className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Link to="/">
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                    >
                        <img src={logo} className="app-logo" alt="logo" />
                    </IconButton>
                </Link>
                <Typography variant="h6" className={classes.title}>
                    eShop
                </Typography>

                <Route
                    render={({ history }) => <SearchBox history={history} />}
                />

                <Link to="/cart" className={classes.link}>
                    <ShoppingCartIcon />
                    <Button color="inherit">Cart</Button>
                </Link>

                {userInfo ? (
                    <div ref={refEl}>
                        <Button
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            className={classes.toggleBtn}
                            onClick={handleClick}
                        >
                            {userInfo.name}
                        </Button>

                        <Menu
                            id="simple-menu"
                            anchorEl={refEl.current}
                            keepMounted
                            open={open}
                            onClose={handleClose}
                            style={{ top: "45px" }}
                        >
                            <MenuItem onClick={handleClose}>
                                <Link
                                    to="/profile"
                                    style={{
                                        color: "#3c3c3c",
                                    }}
                                >
                                    Profile
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Link to="/login" className={classes.link}>
                        <AccountCircle />
                        <Button color="inherit">Login</Button>
                    </Link>
                )}
                {userInfo && userInfo.isAdmin && (
                    <>
                        <Button
                            aria-controls="simple-menu-2"
                            aria-haspopup="true"
                            className={classes.toggleBtn}
                            onClick={handleClickAdmin}
                        >
                            admin
                        </Button>

                        <Menu
                            id="simple-menu-2"
                            anchorEl={anchorElAdmin}
                            keepMounted
                            open={Boolean(anchorElAdmin)}
                            onClose={handleCloseAdmin}
                            style={{ top: "45px" }}
                        >
                            <MenuItem onClick={handleCloseAdmin}>
                                <Link
                                    to="/admin/userlist"
                                    style={{
                                        color: "#3c3c3c",
                                    }}
                                >
                                    Users
                                </Link>
                            </MenuItem>

                            <MenuItem onClick={handleCloseAdmin}>
                                <Link
                                    to="/admin/productlist"
                                    style={{
                                        color: "#3c3c3c",
                                    }}
                                >
                                    Products
                                </Link>
                            </MenuItem>

                            <MenuItem onClick={handleCloseAdmin}>
                                <Link
                                    to="/admin/orderlist"
                                    style={{
                                        color: "#3c3c3c",
                                    }}
                                >
                                    Orders
                                </Link>
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;

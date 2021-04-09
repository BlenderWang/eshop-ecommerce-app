import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination, PaginationItem } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(2),
            paddingTop: theme.spacing(1),
        },
    },
}));

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
    const classes = useStyles();

    return (
        pages > 1 && (
            <div className={classes.root}>
                <Pagination
                    page={page}
                    count={pages}
                    defaultPage={1}
                    variant="outlined"
                    renderItem={(item) => (
                        <PaginationItem
                            component={Link}
                            to={
                                !isAdmin
                                    ? keyword
                                        ? `/search/${keyword}/page/${item.page}`
                                        : `/page/${item.page}`
                                    : `/admin/productlist/${item.page}`
                            }
                            {...item}
                        />
                    )}
                ></Pagination>
            </div>
        )
    );
};

export default Paginate;

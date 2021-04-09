import React from "react";
// import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import StarIcon from "@material-ui/icons/Star";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import StarOutlineIcon from "@material-ui/icons/StarOutline";

const useStyles = makeStyles({
    rating: {
        display: "flex",
        alignItems: "center",
    },
    stars: {
        color: "#e6d370",
    },
    font: {
        paddingLeft: 20,
        fontSize: "12px",
        fontWeight: 300,
        lineHeight: 0.75,
    },
});

const Rating = ({ value, text }) => {
    const classes = useStyles();

    return (
        <div className={classes.rating}>
            <div className="stars">
                <span className={classes.stars}>
                    {value >= 1 ? (
                        <StarIcon />
                    ) : value >= 0.5 ? (
                        <StarHalfIcon />
                    ) : (
                        <StarOutlineIcon />
                    )}
                </span>

                <span className={classes.stars}>
                    {value >= 2 ? (
                        <StarIcon />
                    ) : value >= 1.5 ? (
                        <StarHalfIcon />
                    ) : (
                        <StarOutlineIcon />
                    )}
                </span>

                <span className={classes.stars}>
                    {value >= 3 ? (
                        <StarIcon />
                    ) : value >= 2.5 ? (
                        <StarHalfIcon />
                    ) : (
                        <StarOutlineIcon />
                    )}
                </span>

                <span className={classes.stars}>
                    {value >= 4 ? (
                        <StarIcon />
                    ) : value >= 3.5 ? (
                        <StarHalfIcon />
                    ) : (
                        <StarOutlineIcon />
                    )}
                </span>

                <span className={classes.stars}>
                    {value >= 5 ? (
                        <StarIcon />
                    ) : value >= 4.5 ? (
                        <StarHalfIcon />
                    ) : (
                        <StarOutlineIcon />
                    )}
                </span>
            </div>

            <span className={classes.font}>{text && text}</span>
        </div>
    );
};

/* Rating.propTypes = {
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
}; */

export default Rating;

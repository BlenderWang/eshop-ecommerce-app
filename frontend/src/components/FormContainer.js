import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const FormContainer = ({ children }) => {
    return (
        <Container maxWidth="sm">
            <Typography component="div">{children}</Typography>
        </Container>
    );
};

export default FormContainer;

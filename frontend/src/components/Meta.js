import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keyword" content={keywords} />
        </Helmet>
    );
};

Meta.defaultProps = {
    title: "Welcome To eShop",
    description: "Quality products for cheap price!",
    keywords: "electronics, miscellaneous, cheap price",
};

export default Meta;

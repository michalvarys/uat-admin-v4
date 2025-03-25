import React from "react";
import { Box } from "@strapi/design-system";

export function WrapperComponent({ selected, children }) {
    return (
        <Box
            my={4}
            padding={4}
            background={selected ? "primary100" : "neutral100"}
            borderColor={selected ? "primary600" : "neutral300"}
            borderRadius="4px"
            borderStyle="dashed"
            borderWidth="1px"
        >
            {children}
        </Box>
    )
}
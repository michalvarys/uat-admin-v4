import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { GalleryAttributes } from "@ssupat/components";
import { StandaloneGallery } from "./GalleryComponent";

/**
 * Example of how to use the StandaloneGallery component on the frontend
 * 
 * This component can be used outside of the Tiptap editor context,
 * for example in a frontend application where you want to display
 * a gallery without editing capabilities.
 */
export const FrontendGalleryExample: React.FC = () => {
    // Example gallery data - in a real application, this would come from your API or CMS
    const galleryData: GalleryAttributes = {
        images: [
            {
                src: "https://example.com/image1.jpg",
                alt: "Example image 1",
                title: "Example image 1",
            },
            {
                src: "https://example.com/image2.jpg",
                alt: "Example image 2",
                title: "Example image 2",
            },
            {
                src: "https://example.com/image3.jpg",
                alt: "Example image 3",
                title: "Example image 3",
            },
        ],
        columns: 3,
        spacing: 4,
        aspectRatio: "1",
    };

    return (
        <Box className="frontend-gallery-container">
            <Heading as="h2" size="lg" mb={4}>Gallery Example</Heading>
            <StandaloneGallery attrs={galleryData} />
        </Box>
    );
};

/**
 * Example of how to use the StandaloneGallery component with data from Tiptap HTML
 * 
 * This example shows how to extract gallery data from the HTML generated by Tiptap
 * and use it with the StandaloneGallery component.
 */
export const FrontendGalleryFromHTML: React.FC<{ html: string }> = ({ html }) => {
    // Parse the HTML to extract gallery data
    const parseGalleryData = (html: string): GalleryAttributes[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const galleryElements = doc.querySelectorAll('div[data-type="gallery"]');

        return Array.from(galleryElements).map((element) => {
            try {
                const dataGallery = element.getAttribute("data-gallery");
                if (!dataGallery) {
                    return {
                        images: [],
                        columns: 3,
                        spacing: 4,
                        aspectRatio: "1",
                    };
                }

                return JSON.parse(dataGallery);
            } catch (e) {
                console.error("Error parsing gallery data", e);
                return {
                    images: [],
                    columns: 3,
                    spacing: 4,
                    aspectRatio: "1",
                };
            }
        });
    };

    const galleries = parseGalleryData(html);

    return (
        <Box className="frontend-galleries-container">
            <Heading as="h2" size="lg" mb={4}>Galleries from HTML</Heading>
            {galleries.map((gallery, index) => (
                <Box key={index} className="gallery-wrapper" mb={8}>
                    <StandaloneGallery attrs={gallery} />
                </Box>
            ))}
        </Box>
    );
};

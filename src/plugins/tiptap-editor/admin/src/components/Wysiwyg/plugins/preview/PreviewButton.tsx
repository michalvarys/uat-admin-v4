import React, { useState, useEffect } from "react";
import "./preview.css";
import { Editor, JSONContent } from "@tiptap/react";
import { IconButton } from "@strapi/design-system";
import { Eye } from "@strapi/icons";
import { createPortal } from "react-dom";
import { renderJSON } from "@ssupat/components";
import ErrorBoundary from "./ErrorBoundary";
import { IframeProvider } from "./IframeProvider";

type DeviceType = "sm" | "md" | "lg" | "xl" | "2xl";
type OrientationType = "portrait" | "landscape";

type PreviewButtonProps = {
    editor: Editor;
};

function PreviewButton({ editor }: PreviewButtonProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState<JSONContent>();
    const [copySuccess, setCopySuccess] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<DeviceType>("xl");
    const [orientation, setOrientation] = useState<OrientationType>("portrait");

    // Update preview content when preview is opened
    const openPreview = () => {
        setPreviewContent(editor.getJSON());
        setIsPreviewOpen(true);
        // Prevent body scrolling when preview is open
        document.body.style.overflow = "hidden";
    };

    const closePreview = () => {
        setIsPreviewOpen(false);
        setCopySuccess(false);
        // Restore body scrolling
        document.body.style.overflow = "";
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(previewContent))
            .then(() => {
                setCopySuccess(true);
                // Reset the success message after 2 seconds
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    const changeDevice = (device: DeviceType) => {
        setSelectedDevice(device);
    };

    // Handle escape key to close preview
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isPreviewOpen) {
                closePreview();
            }
        };

        window.addEventListener("keydown", handleEscKey);
        return () => {
            window.removeEventListener("keydown", handleEscKey);
        };
    }, [isPreviewOpen]);

    // Update preview content when editor content changes while preview is open
    useEffect(() => {
        if (isPreviewOpen) {
            const updatePreview = () => {
                setPreviewContent(editor.getJSON());
            };

            // Add event listener for editor updates
            editor.on('update', updatePreview);

            // Clean up event listener
            return () => {
                editor.off('update', updatePreview);
            };
        }
    }, [editor, isPreviewOpen]);

    // Get device-specific class
    const getDeviceClass = () => {
        const orientationClass = orientation === "landscape" ? "-landscape" : "";
        return `preview-device-${selectedDevice}${orientationClass}`;
    };

    // Toggle orientation between portrait and landscape
    const toggleOrientation = () => {
        setOrientation(prev => prev === "portrait" ? "landscape" : "portrait");
    };

    // Render content with IframeProvider
    const renderPreviewContent = () => {
        if (!previewContent?.content) {
            return <div>Žádný obsah k zobrazení</div>;
        }

        return (
            <ErrorBoundary>
                {renderJSON(previewContent.content)}
            </ErrorBoundary>
        );
    };

    return (
        <>
            <IconButton
                icon={<Eye />}
                label="Zobrazit náhled"
                className="large-icon"
                onClick={openPreview}
            />

            {isPreviewOpen && createPortal(
                <div className="preview-overlay">
                    <div className="preview-toolbar">
                        <div className="preview-controls">
                            <div className="preview-device-selector">
                                <button
                                    className={`preview-device-button ${selectedDevice === "sm" ? "active" : ""}`}
                                    onClick={() => changeDevice("sm")}
                                    title="sm (480px)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                        <line x1="12" y1="18" x2="12" y2="18" />
                                    </svg>
                                </button>
                                {/* <button
                                    className={`preview-device-button ${selectedDevice === "md" ? "active" : ""}`}
                                    onClick={() => changeDevice("md")}
                                    title="md (768px)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                                        <line x1="12" y1="18" x2="12" y2="18" />
                                    </svg>
                                </button> */}
                                <button
                                    className={`preview-device-button ${selectedDevice === "lg" ? "active" : ""}`}
                                    onClick={() => changeDevice("lg")}
                                    title="lg (992px)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </button>
                                <button
                                    className={`preview-device-button ${selectedDevice === "xl" ? "active" : ""}`}
                                    onClick={() => changeDevice("xl")}
                                    title="xl (1280px)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </button>
                                <button
                                    className={`preview-device-button ${selectedDevice === "2xl" ? "active" : ""}`}
                                    onClick={() => changeDevice("2xl")}
                                    title="2xl (1536px)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </button>
                            </div>

                            {(selectedDevice === "sm" || selectedDevice === "md") && (
                                <div className="preview-orientation-selector">
                                    <button
                                        className={`preview-orientation-button ${orientation === "portrait" ? "active" : ""}`}
                                        onClick={() => setOrientation("portrait")}
                                        title="Portrétová orientace"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                        </svg>
                                    </button>
                                    <button
                                        className={`preview-orientation-button ${orientation === "landscape" ? "active" : ""}`}
                                        onClick={() => setOrientation("landscape")}
                                        title="Krajinná orientace"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="preview-actions">
                            <button
                                className="preview-button copy-button"
                                onClick={copyToClipboard}
                            >
                                {copySuccess ? "Zkopírováno!" : "Kopírovat JSON"}
                            </button>
                            <button
                                className="preview-button close-button"
                                onClick={closePreview}
                            >
                                Zavřít
                            </button>
                        </div>
                    </div>
                    <div className="preview-container">
                        <div className={`preview-content ${getDeviceClass()}`}>
                            <IframeProvider>
                                {renderPreviewContent()}
                            </IframeProvider>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default PreviewButton;

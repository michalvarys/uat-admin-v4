// path: ./src/plugins/wysiwyg/admin/src/components/MediaLib/index.js

import React from "react";
import { prefixFileUrlWithBackendUrl, useLibrary } from "@strapi/helper-plugin";
import PropTypes from "prop-types";

const MediaLib = ({ isOpen, onChange, onToggle }: any) => {
  const { components } = useLibrary();

  const handleSelectAssets = (files: any[]) => {
    const formattedFiles = files.map((f) => ({
      alt: f.alternativeText || f.name,
      url: prefixFileUrlWithBackendUrl(f.url),
      mime: f.mime,
    }));

    onChange(formattedFiles);
  };

  const MediaLibraryDialog = components?.["media-library"];
  if (!isOpen || !MediaLibraryDialog) {
    return null;
  }

  return (
    <MediaLibraryDialog
      // @ts-ignore
      onClose={onToggle}
      onSelectAssets={handleSelectAssets}
    />
  );
};

MediaLib.defaultProps = {
  isOpen: false,
  onChange: () => {},
  onToggle: () => {},
};

MediaLib.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export default MediaLib;

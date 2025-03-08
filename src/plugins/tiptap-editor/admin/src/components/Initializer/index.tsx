/**
 *
 * Initializer
 *
 */

import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import pluginId from "../../pluginId";

const Initializer = ({ setPlugin }: { setPlugin: Function }) => {
  const ref = useRef<Function>();
  ref.current = setPlugin;

  useEffect(() => {
    ref.current?.(pluginId);
  }, []);

  return null;
};

Initializer.propTypes = {
  setPlugin: PropTypes.func.isRequired,
};

export default Initializer;

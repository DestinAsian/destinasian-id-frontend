import { setConfig } from '@faustwp/core';
import templates from './wp-templates';
import possibleTypes from './possibleTypes.json';

export default setConfig({
  wpUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://backend.destinasian.co.id/id/wp",
  frontendUrl: process.env.FRONTEND_URL || "https://destinasian.co.id",

  apiBasePath: "/api/faust",

  templates,
  experimentalPlugins: [],
  experimentalToolbar: true,
  possibleTypes,
});

import { Config } from '@remotion/bundler';

export default {
  port: 3333,
  webpackOverride: (config) => config,
} satisfies Config;

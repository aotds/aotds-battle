import dts from "rollup-plugin-dts";
import resolve from '@rollup/plugin-node-resolve';

const config = [
  // …
  {
    input: "./build/index.d.ts",
    output: [{ file: "dist/my-library.d.ts", format: "es" }],
    plugins: [resolve(),dts()],
  },
];

export default config;

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: 'src/src.js', // Your main JS file
  output: {
    filename: 'bundle.js', // The bundled JS file
    path: path.resolve(__dirname, 'dist'),
  },
  stats: {
    all: true,  // Show all information (errors, warnings, etc.)
    errors: true,  // Show errors
    errorDetails: true,  // Show detailed error info
    colors: true,  // Colorize the output (useful for clarity)
  },
  resolve: {
    alias: {
      // This may help Webpack to resolve dependencies that don't have proper browser fields
      cheerio$: 'cheerio-browser/index.js',  // Point to the correct Cheerio file
      axios$: 'axios/dist/axios.min.js',  // Use the minified version of Axios
    },
    extensions: ['.js','.coffee','.ts','.cjs','.json'],
    fallback: {
      // Provide fallbacks for missing Node.js modules when building for the browser
      path: require.resolve('path-browserify'),
      fs: false,  // Disable Node.js fs module
      https: false,
      http: false,
      os: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'adsterra.html',
    }),
  ],
  mode: 'development',
  devtool: 'source-map', // Optional, for easier debugging
};


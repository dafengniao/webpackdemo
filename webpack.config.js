var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./app/app.js",
    output: {
        filename: "./src/js/bundle.js",
        //sourceMapFilename: "./bundle.map"
    },
    devtool: '#source-map',
    module: {
        loaders: [
            {
                loader: 'babel',
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['react', 'es2015', 'stage-2']
                }
            }
        ]
    },
    resolve:{ 
        extensions:['','.js','.json'] 
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify("production")
        }
      })
    ]
     /*
    plugins: [ 
        new webpack.NoErrorsPlugin() 
    ] 
    */
}
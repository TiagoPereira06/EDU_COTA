const HtmlWebpackPlugin = require('html-webpack-plugin');
const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin")

module.exports = {

    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin({
            title: 'COTA'
        }),
        new GoogleFontsPlugin({
            fonts: [
                {family: "Lato", variants: ["400", "700italic"]}
            ]
        })

    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|gif|jpe?g)$/i,
                use: ['file-loader']
            }
        ]
    }
}

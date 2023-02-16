const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => {
    return {
        mode: 'development',
        entry: "./src/app.tsx",
        devtool: "inline-source-map",
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        output: {
            publicPath: "/",
            path: path.resolve(__dirname, "../static"),
            filename: "app.js"
        },
        devServer: {
            static: '../static',
            port: 8000,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "index.html"
            }),
        ]
    }
};
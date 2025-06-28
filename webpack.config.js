const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    let envFile = `.env.${env.APP_ENV}`;

    // 读取环境变量
    const envConfig = dotenv.config({ path: envFile }).parsed;

    return {
        // 入口文件
        entry: './src/index.js',

        // 输出配置
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            clean: true, // 清理旧的构建文件
            publicPath: '/',
        },

        // 开发工具
        devtool: isProduction ? false : 'source-map',

        // 开发服务器配置
        devServer: {
            static: [
                {
                    directory: path.join(__dirname, 'public'),
                }
            ],
            host: '0.0.0.0',
            port: 3001,
            hot: true,
            open: false,
            historyApiFallback: true,
            proxy: {
                context: '/auth/',
                target: 'http://localhost/',
                changeOrigin: true,
                disableHostCheck: true,
                noInfo: true,
            },
        },

        // 模块规则
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: !isProduction
                            }
                        }
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: !isProduction
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !isProduction,
                                sassOptions: {
                                    includePaths: [path.resolve(__dirname, 'src')],
                                    outputStyle: 'expanded'
                                }
                            }
                        }
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[hash][ext]'
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name].[hash][ext]'
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[hash:8].[ext]',
                    },
                }
            ],
        },

        // 插件配置
        plugins: [
            new webpack.DefinePlugin({
                'globalInitConfig': JSON.stringify(envConfig, null, 2)
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "public",
                        to: ".",
                        globOptions: {
                            ignore: [
                                "**/index.html",
                                "**/favicon.ico"
                            ]
                        },
                    },
                ],
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                favicon: './public/favicon.ico'
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
            }),
            new MonacoWebpackPlugin()
        ],

        // 优化配置
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: false,
            },
            runtimeChunk: {
                name: 'runtime',
            },
            minimizer: [
                new TerserPlugin({
                    extractComments: false, // 去除注释
                    terserOptions: {
                        compress: {
                            drop_console: isProduction // 生产环境移除console
                        }
                    }
                }),
            ],
        },

        // 解析配置
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@components': path.resolve(__dirname, 'src/components'),
                '@pages': path.resolve(__dirname, 'src/pages'),
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@utils': path.resolve(__dirname, 'src/utils'),
                '@services': path.resolve(__dirname, 'src/services'),
            },
        },
    };
};

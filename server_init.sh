mkdir -p server
cd server
 
npm init -y
# add to package.json in scripts
    # "build": "webpack build",
    # "watch": "webpack watch --mode=development ",
    # "start": "webpack serve --mode=development ",


npm install react react-dom
npm install @emotion/react @emotion/styled @emotion/css

npm install --save-dev typescript @types/react @types/react-dom
npx tsc --init
    # set
        # "declaration": false,
        # "declarationMap": false,
        # "exactOptionalPropertyTypes": false
        # "jsx": "preserve",
    # uncomment // Style Options
    # add "include": ["src/**/*"] after <"compilerOptions":{...},>

npm install --save-dev webpack webpack-cli webpack-dev-server 
npm install --save-dev babel-loader ts-loader 
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
npm install --save-dev html-webpack-plugin copy-webpack-plugin

mkdir -p src
mkdir -p src/assets
mkdir -p src/components
mkdir -p src/components/routing
mkdir -p src/components/ui
mkdir -p src/components/ui/theme
mkdir -p src/features
mkdir -p src/features/header
mkdir -p src/features/header/components
mkdir -p src/features/header/components/nav
mkdir -p src/features/header/components/nav/nav-link
mkdir -p src/pages
mkdir -p src/pages/home

touch src/index.css
touch src/components/routing/index.tsx
touch src/components/ui/theme/index.ts
touch src/features/header/index.tsx
touch src/features/header/components/nav/index.tsx
touch src/features/header/components/nav/nav-link/index.tsx
touch src/features/header/components/nav/nav-link/style.ts
touch src/pages/home/index.tsx



cat > src/index.html << EOF
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/index.css">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet">
</head>
<body>
    <div id="root"></div>
</body>
</html>
EOF

cat > src/app.tsx << EOF
import React from 'react'

const App = () => {

    return <h1>404 not found</h1>
}

export default App;
EOF


cat > src/index.tsx << EOF
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from "./app";

const element = <App/>

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('No root element found')
}

const root = ReactDOM.createRoot(rootElement)

root.render(element)
EOF


cat > webpack.config.js << EOF
const path = require("node:path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        clean: true,
    },
    devServer: {
        historyApiFallback: true,
        port: 3000,
    },
    resolve: {
        extensions: [".ts", ".js", '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/, exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', "@babel/preset-typescript"],
                        plugins: ["@emotion"]
                    }
                }
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/index.css", to: "index.css"},
                // {from: "./src/assets", to: "assets"}, //uncomment when png exists
            ]
        })
    ]
};
const webpack = require('webpack')
module.exports = {
    publicPath: './',
    devServer: {
        proxy: {
            '/api/bili': {
                target: 'https://show.bilibili.com/api', //API服务器的地址
                ws: true,  //代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/api/bili': ''
                },
                // headers: {//header设置
                //     referer: 'https://show.bilibili.com/',//referer
                //     origin: 'https://show.bilibili.com/'
                // }
            },
            '/api/map': {
                target: 'https://restapi.amap.com/v3', //API服务器的地址
                ws: true,  //代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                secure: false,
                pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/api/map': ''
                }
            },
            '/api/login': {
                target: 'http://passport.bilibili.com/qrcode', //API服务器的地址
                ws: true,  //代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                secure: false,
                pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/api/login': ''
                }
            },
            '/api/all': {
                target: 'http://api.bilibili.com/', //API服务器的地址
                ws: true,  //代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                secure: false,
                pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/api/all': ''
                }
            },

        }
    },
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-pro.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                vuex: 'Vuex',
                swiper:'Swiper',
                vant:'vant'
            })
        })

        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }

}
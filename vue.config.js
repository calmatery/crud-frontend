module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/crud-front-publish/'
        : '/'
}

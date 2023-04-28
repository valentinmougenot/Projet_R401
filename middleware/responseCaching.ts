import etag from 'etag';

const responseCaching = (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('ETag', etag(JSON.stringify(res.body ?? '')));

    if (req.headers['if-none-match'] === res.getHeader('ETag')) {
        res.status(304).send();
    } else {
        next();
    }
};

export default responseCaching;
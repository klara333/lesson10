
export default function (err, req, res, next) {
    console.error(err);
    const statusCode = err?.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || 'An unknown error occurred',
        status: statusCode,
        stack: process.env.ENV === 'development' ? err.stack : undefined
    });
}
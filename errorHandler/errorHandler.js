module.exports = (err, req, res, next) => {
    console.log('express error: ', err);
    if (err.apiCode && err.apiCode >= 400) {
        // ensure that err.apiMessage exists so we don't throw an exception
        // trying to return it.
        err.apiMessage = err.apiMessage ? err.apiMessage : '';
        res.status(err.apiCode).json({
            apiCode: err.apiCode, apiMessage: err.apiMessage, ...err
        });
    } else {
        next();
    }
}
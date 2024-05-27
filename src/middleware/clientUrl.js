export const clientUrl = (req, res, next) => {
    const clientUrl = encodeURIComponent(req.query.clientUrl)
    if (clientUrl){
        res.cookie('clientUrl', clientUrl, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60000})
    } 
    next()
}
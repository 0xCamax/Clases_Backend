

export const onlyAdmin = (req, res, next) => {
    try {
        const token = req.cookies.authToken
        if(token) {
            jwt.verify(token, SECRET_KEY, (err, user) => {
                if (err) {
                    console.log('Token inválido o expirado')
                    res.cookie('authToken', '', { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)})
                    return res.redirect('/login')
                } else {
                    if(user.role !== "admin"){
                        throw new Error('Not allowed')
                    }
                    req.user = user
                }
            })
            next()
        } else {
            next()
        }
    } catch (err) {
    res.status(403).json({ 
        error: err.message 
        })
    }
}

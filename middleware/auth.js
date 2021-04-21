const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        //split: so we get only the token without the keyword
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        //pass the token to be verify and the string that was use to be encoded
        const userId = decodedToken.userId;
        //to extract our user id from the encoded token
        if (req.body.userId && req.body.userId !== userId) {
            //check if the user id exist on our req and if it matches with the one from the token
            throw 'Invalid user Id'
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request')
        });
    }
};
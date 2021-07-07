import jwt from 'jsonwebtoken'

const secret = process.env.TOKEN_SECRET ?? ""

export function generateAccessToken(id: Number, email: String) {
    return jwt.sign(
        {id: id, email: email}, 
        secret, 
        {expiresIn: '1800s'}
    )
}

export function authJwt(req: any, res: any, next: any) {

    const authHeader = req.headers.authorization;

    if (authHeader) {

        const token = authHeader.split(' ')[1];

        jwt.verify(token, secret, (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });

    } else {
        res.sendStatus(401);
    }

}


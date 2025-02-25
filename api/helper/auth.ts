import { Request, Response, NextFunction } from 'npm:express';
import { hash, verify } from "jsr:@bronti/argon2";
import jwt from 'npm:jsonwebtoken';

const secretKey = Deno.env.get("SECRET_TOKEN")||"mypassword";
export const hashPassword = (password: string): string => {
    const hashedPassword = hash(password);
    return hashedPassword;
};


export const checkPassword =(password: string, hashedPassword: string):boolean => {
    const match = verify(password, hashedPassword);
    return match;
};


export const createToken = (payload: object): string => {
    const token = jwt.sign({ payload }, secretKey, { expiresIn: '1h' });
    return token;
};



export const authorization = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const data =jwt.verify(token, secretKey);
        console.log(data);
        req.userId = data.payload; 
        next();
    } catch (_error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

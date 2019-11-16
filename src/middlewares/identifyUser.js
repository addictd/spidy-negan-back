import { TOKEN } from '../../config';
import JwtService from "../services/jwt-service";
const jwtService = new JwtService();


const identifyUser = async (req, res, next) => {
    // console.log(req.headers);
    const token = req.headers[TOKEN];
    try{
        const user = await jwtService.verifyToken(token);
        // console.log('user::::', user);
        req.user = user;
        return next();
    }catch(err){
        return res.json({status : false, data : {}, msg : "Invalid token", err })
    }

}

export const identifyUserFunc = async (token) => {
    // console.log('token: ', token);
    try{
        const user = await jwtService.verifyToken(token);
        // console.log('user::::', user);
        return user;
    }catch(err){
        return {};
    }

}

export default identifyUser;
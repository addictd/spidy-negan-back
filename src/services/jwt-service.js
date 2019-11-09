var jwt = require('jsonwebtoken');
import config from '../../config';
import {promisify} from 'util';

const jwt_sign = promisify(jwt.sign);
const jwt_decode = promisify(jwt.decode);
const jwt_verify = promisify(jwt.verify);

class jwtService {
    generateToken(data) {
        return  jwt_sign( JSON.stringify(data) , config.JWT_SECRET_KEY );
    }

    verifyToken(token) {
        return jwt_verify(token, config.JWT_SECRET_KEY);
    }

    decodeToken(token) {  // dont use it unless the source is trusted
        return jwt_decode(token );
    }

}

export default jwtService;
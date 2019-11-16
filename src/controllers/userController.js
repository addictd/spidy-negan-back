import CryptService from "../services/crypt-service";
import JwtService from "../services/jwt-service";
import UserModelServices from '../services/userModelServices';
import * as errMsg from "../utils/errorMsg";
import { validateEmail } from "../utils/validators";

const cryptService = new CryptService();
const jwtService = new JwtService();


class UserController {

  async getUsers(req, res, next) {
    try{
      const response = await UserModelServices.get_all_users();
      // console.log('response', response);
      return res.json({ status: true, data: response, msg: "Successful." });
    }catch(err){
      return res.json({ status: false, data: {}, msg: err.toString() });
    }
  }

  async addUser(req, res, next) {
    // console.log('hit');
    const { email, password, name } = req.body;
    // console.log(req.body);
    const role = "student";
    if (!email  || !password  || !name  ){
      return res.json({ status: false, data: {}, msg: errMsg.INCOMPLETE_ARGUMENTS })
    }
    
    if(!validateEmail(email)){  return res.json({ status: false, data: {}, msg: "Invalid email." }) };

    try {
      const _password = await cryptService.cryptify(password);
      // console.log('password', password)
      const _user = {
        email,
        password: _password,
        name,
        role
      };
      // console.log('here------')
      const user = await UserModelServices.add_user(_user);
      // console.log('user=======', user);
      return res.json({ status: true, data: { user }, msg: "User added successfully." })

    } catch (err) {
      console.log("err in adding user: ", err);
      return res.json({ status: false, data: {}, err, msg: "Unable to signup." })
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password ){
      res.json({status : false, data : {}, msg : errMsg.INCOMPLETE_ARGUMENTS});
    }
    
    if(!validateEmail(email)){  return res.json({ status: false, data: {}, msg: "Invalid email." }) };

    try{
      let user = await UserModelServices.get_user_by_email(email);
      user = user[0];
      // console.log("password", password, user.password, user);
      const is_pass_valid = await cryptService.verify(password, user.password);
      
      console.log("is pass correct: ", is_pass_valid);

      if(!is_pass_valid){
        throw "Password is not valid";
      }

      const _user = {};
      _user.email = user.email;
      _user.role = user.role;
      _user.user_id = user._id;
      _user.name = user.name;

      const token = await jwtService.generateToken(_user);
      return res.json({ status: true, data: {user : _user, token} ,msg: "Successfully logged in." });
      
    }catch(err){

      res.json({ status: false, data: {}, err ,msg: err });
    }

  }

}
export default UserController;
import userActivityServices from '../services/userActivityServices';
import * as errMsg from "../utils/errorMsg";

class UserActivityController {

    async get(req, res, next) {
        
        const { email } = req.user;
        if (!email) return res.json({ status: false, data: {}, 
            err: errMsg.INCOMPLETE_ARGUMENTS , 
            msg: errMsg.INCOMPLETE_ARGUMENTS });

        try {
            const activities = await userActivityServices.get_user_activity({ email });
            console.log('activites: ', activities);
            return res.json({ status: true, data: activities, msg: "Get user activity success." });
        } catch (err) {
            return res.json({ status: false, data: {}, msg: err.toString() });
        }
    }

    // async set(req, res, next) {
    //     const { email } = req.user;
    //     const { tag } = req.body;

    //     if (!email || !tag) return res.json({ status: false, data: {}, 
    //         err: errMsg.INCOMPLETE_ARGUMENTS , 
    //         msg: errMsg.INCOMPLETE_ARGUMENTS });

    //     try {
    //         const new_activity = await userActivityServices.set_user_activity({ email, tag });
    //         console.log('activites: ', activities);
    //         return res.json({ status: true, data: new_activity, msg: "User activity updated." });
    //     } catch (err) {
    //         return res.json({ status: false, data: {}, msg: err.toString() });
    //     }
    // }


}
export default UserActivityController;
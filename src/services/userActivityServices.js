
import { promisify } from 'util';
import * as errMsg from "../utils/errorMsg";
import mysqlConnection from '../db';


const userActivityServices = {
    get_user_activity : promisify(getActivity),
    set_user_activity : promisify(setActivity)
}

async function getActivity({ email }, cb) {
    try {
        if(!email) throw errMsg.INCOMPLETE_ARGUMENTS;

        mysqlConnection.query(`
                SELECT DISTINCT(tag) FROM user_activity
                WHERE email='${email}' 
        `, (err, rows) => {
            if (err) return cb(errMsg._ERR(err));

            const tags = rows.map(item => item.tag);
            return cb(null, tags);
        });

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}


async function setActivity({ email, tag }, cb) {
    try {
        
        if(!email || !tag) throw errMsg.INCOMPLETE_ARGUMENTS;
        
        mysqlConnection.query(`
            INSERT INTO user_activity (email, tag ) 
            VALUES ('${email}', '${tag}' );
        `, (err, rows) => {
            if (err) return cb(errMsg._ERR(err));

            console.log('[user_activity_insert]------', rows);

            return cb(null, rows);
        });


    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}



export default userActivityServices;
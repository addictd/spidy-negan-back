import { promisify } from 'util';
import mysqlConnection from '../db';
import * as errMsg from "../utils/errorMsg";

const UserModelServices = {
    get_user_by_id: promisify(_get_by_id),
    get_user_by_email: promisify(_get_by_email),
    add_user: promisify(_add),
    update_user: promisify(_update),
    delete_user: promisify(_delete),
    get_all_users: promisify(_get_all_users)
}


async function _add({ email, password, role, name }, cb) {

    try {
        if (!email || !password || !role || !name) {
            throw errMsg.INCOMPLETE_ARGUMENTS;
        }
        email = email.toLowerCase();
        role = role.toLowerCase();
        name = name.toLowerCase();

        mysqlConnection.query(`
                INSERT INTO users (email, password, name, role) 
                VALUES ('${email}', '${password}', '${name}', '${role}' );
        `, (err, rows, fields) => {
            if (err) throw err;
            return cb(null, rows);
        });

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}



async function _get_by_email(email, cb) {
    try {

        if (!email) throw errMsg.INCOMPLETE_ARGUMENTS;

        mysqlConnection.query(`
                SELECT * from users 
                WHERE email='${email}'
        `, (err, rows, fields) => {
            if (err) throw err;
            // console.log('[rows]------', rows);
            return cb(null, rows);
        });
    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}

async function _get_by_id(id, cb) {

}

async function _update() {

}
async function _delete() {

}

async function _get_all_users(cb) {
    try {
        mysqlConnection.query(`
                SELECT * from users 
        `, (err, rows) => {
            if (err) throw err;
            // console.log('[rows]------', rows);
            return cb(null, rows);
        });
    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}


export default UserModelServices;
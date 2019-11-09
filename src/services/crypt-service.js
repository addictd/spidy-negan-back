const bcrypt = require('bcrypt');
const saltRounds = 10;

class cryptService {

    cryptify(pass) {
        return bcrypt.hash(pass, saltRounds);
    }

    async verify(uncrypted_data, cryptic_data) {
        return bcrypt.compare(uncrypted_data, cryptic_data);
    }
}

export default cryptService;
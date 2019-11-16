const assert = require('chai').assert;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var mysql = require('mysql');

const rootApp = require('../../src/bin//index');
const mysqlConnection = require('../../src/db');
import config from '../../config';

chai.use(chaiHttp);

const testConfig = config;


describe('Users', () => {
    describe('check auth', () => {

        // beforeEach(async function () {
        //     var conn = mysql.createConnection({
        //         host: testConfig.DB_HOST,
        //         user: testConfig.DB_USER,
        //         password: testConfig.DB_PASSWORD,
        //         port: testConfig.DB_PORT,
        //         database: testConfig.DB_NAME
        //     });
        //     await conn.connect(function (err) {
        //         console.log('[connection error pre]: ', err);
        //     });

        //     const count_promise = new Promise((resolve, reject) => {
        //         conn.query(`
        //             SELECT COUNT(*) FROM users;
        //         `, (err, rows, fields) => {
        //             if(err) { reject(err); }
        //             else{
        //                 resolve(rows);
        //             }
        //         });
        //     });
        //     try{
        //         var user_count = await count_promise;
        //         console.log('count: ', count);

        //     }catch(err){
        //         console.log('unable to connect to database.', err);
        //     }

        // })


        it('[SignUp Test]', (done) => {

            chai.request(rootApp)
                .post('/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    'email': `test${(new Date()).getTime()}@gmail.com`,
                    'password': 'deep',
                    'name': 'deep'
                })
                .end((err, res) => {
                    // console.log('response: ', res.body);
                    res.should.have.status(200);
                    res.body.status.should.be.true;;
                    res.body.data.should.be.a('object').have.a.property('user');
                    res.body.data.user.affectedRows.should.be.equal(1);

                    res.body.should.be.a('object');
                    done();
                });

        });

        it('[SignIn Test]', (done) => {

            chai.request(rootApp)
                .post('/signin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    'email': 'deep1@gmail.com',
                    'password': 'deep1'
                })
                .end((err, res) => {
                    // console.log('response: ', res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object').have.a.property('data');
                    res.body.data.should.be.a('object').have.a.property('user');
                    res.body.data.user.should.be.a('object').have.a.property('email');
                    res.body.data.user.should.be.a('object').have.a.property('role');
                    res.body.data.user.should.be.a('object').have.a.property('name');
                    res.body.should.be.a('object').have.a.property('status');
                    res.body.data.should.be.a('object').have.a.property('token');
                    res.body.data.token.should.be.a('string');
                    res.body.status.should.be.a('boolean').be.true;
                    done();
                });

        });


    });

});


import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import server from '../app';
import User from '../app/models/user';
import {getConfigurations} from '../config/config';

let token, refreshToken;

const should = chai.should();
const config = getConfigurations(process.env.ENVIRONMENT);
const SECRET = config.session.secret;
const SECRET_2 = config.session.secret_2;

const user = {
    name: "Jhon",
    password: "password"
};

chai.use(chaiHttp);

describe('Authentication', () => {
    before((done) => {

        const obj = new User(user);

        obj.save();
		
        done();
  	});

    it('it should authenticate user', (done) => {

        chai.request(server)
        .post('/api/authenticate')
        .send(user)

        .end((err, res) => {

            token = res.body.token;
            refreshToken = res.body.refreshToken;

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            res.body.should.have.property('refreshToken');
            done();
        });
    });

    it('it should fail authenticate invalid user', (done) => {

        chai.request(server)
        .post('/api/authenticate')
        .send({name: 'Jhon', password: 'Snow'})

        .end((err, res) => {
            res.should.have.status(404);
            done();
        });
    });

    it('it should fail authenticate empty body', (done) => {

        chai.request(server)
        .post('/api/authenticate')
        .send({})

        .end((err, res) => {
			res.should.have.status(404);
            done();
        });
    });

    it('it should fail without token', (done) => {
        chai.request(server)
        .get('/api/authenticate')

        .end((err, res) => {
            res.should.have.status(401);
            done();
        });
    });

    it('it should refresh expired token', (done) => {

      	let expire = () => {
			chai.request(server)
			.get('/api/authenticate')
			.set({ "authorization":"Bearer " + token })
			.set({ "x-refresh-token": refreshToken })

          	.end((err, res) => {
              	res.should.have.status(200);
              	res.body.should.be.a('object');
              	done();
          	});
        };
        setTimeout(expire, 2001);
    });

    it('it should fail without sending refresh token', (done) => {

      	let expire = () => {
			chai.request(server)
			.get('/api/authenticate')
			.set({ "authorization":"Bearer " + token })

          	.end((err, res) => {
              	res.should.have.status(401);
              	done();
          });
        };
        setTimeout(expire, 2001);
    });

    it('it should fail without sending token', (done) => {

      	let expire = () => {
          	chai.request(server)
          	.get('/api/authenticate')
          	.set({ "x-refresh-token": refreshToken })

          	.end((err, res) => {
              	res.should.have.status(401);
              	done();
          });
        };
        setTimeout(expire, 2001);
    });

    it('it should fail using different userId token', (done) => {

      	const firstUser = jwt.sign({_id: 1, name: 'Varys'}, SECRET, { expiresIn: '2s'});
     	const secondUser = jwt.sign({_id: 2, name: 'Jhon'}, SECRET_2+'2', { expiresIn: '1m'});

    	let expire = () => {
         	chai.request(server)
          	.get('/api/authenticate')
          	.set({ "authorization":"Bearer " + firstUser })
          	.set({ "x-refresh-token": secondUser })

          	.end((err, res) => {
              	res.should.have.status(401);
              	done();
          });
        };
        setTimeout(expire, 2001);
    });

    it('it should fail without userId in token', (done) => {

      	const firstUser = jwt.sign({ name: 'Varys'}, SECRET, { expiresIn: '2s'});
      	const secondUser = jwt.sign({ name: 'Jhon'}, SECRET_2, { expiresIn: '1m'});

    	let expire = () => {
          	chai.request(server)
			.get('/api/authenticate')
			.set({ "authorization":"Bearer " + firstUser })
			.set({ "x-refresh-token": secondUser })

          	.end((err, res) => {
              	res.should.have.status(401);
              	done();
          });
        };
        setTimeout(expire, 2001);
    });

    it('it should fail with invalid refresh token', (done) => {

      	const firstUser = jwt.sign({ name: 'Varys'}, SECRET, { expiresIn: '2s'});
      	const secondUser = jwt.sign({ name: 'Jhon'}, SECRET_2, { expiresIn: '1m'}).replace('a', 'b');

    	let expire = () => {
			chai.request(server)
			.get('/api/authenticate')
			.set({ "authorization":"Bearer " + firstUser })
			.set({ "x-refresh-token": secondUser })

          	.end((err, res) => {
              	res.should.have.status(401);
              	done();
          });
        };
        setTimeout(expire, 2001);
    });

    it('it should fail with invalid token', (done) => {

      	const firstUser = jwt.sign({ name: 'Varys'}, SECRET, { expiresIn: '2s'}).replace('a', 'b');
      	const secondUser = jwt.sign({ name: 'Jhon'}, SECRET_2, { expiresIn: '1m'});

    	let expire = () => {
			chai.request(server)
			.get('/api/authenticate')
			.set({ "authorization":"Bearer " + firstUser })
			.set({ "x-refresh-token": secondUser })

			.end((err, res) => {
              	res.should.have.status(401);
              	done();
          });
        };
        setTimeout(expire, 2001);
    });

    it('it should fail with invalid refresh token signature', (done) => {

      	const firstUser = jwt.sign({ _id: 1, name: 'Varys'}, SECRET, { expiresIn: '2s'});
      	const secondUser = jwt.sign({ _id: 2, name: 'Jhon'}, 'test', { expiresIn: '1m'});

    	let expire = () => {
			chai.request(server)
			.get('/api/authenticate')
			.set({ "authorization":"Bearer " + firstUser })
			.set({ "x-refresh-token": secondUser })

			.end((err, res) => {
              	res.should.have.status(401);
              	done();
          });
        };
        setTimeout(expire, 2001);
    });

    it('it should fail with invalid token signature', (done) => {

      	const firstUser = jwt.sign({ _id: 1, name: 'Varys'}, 'test', { expiresIn: '2s'});
      	const secondUser = jwt.sign({ _id: 2, name: 'Jhon'}, SECRET_2, { expiresIn: '1m'});

		let expire = () => {
			chai.request(server)
			.get('/api/authenticate')
			.set({ "authorization":"Bearer " + firstUser })
			.set({ "x-refresh-token": secondUser })

			.end((err, res) => {
              	res.should.have.status(401);
              	done();
          });
        };
        setTimeout(expire, 2001);
    });
});
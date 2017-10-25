//During the test the env variable is set to test
process.env.ENVIRONMENT = 'test';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import server from '../app';

let token, refreshToken;

const should = chai.should();
const SECRET = process.env.SECRET;
const SECRET_2 = process.env.SECRET_2;

chai.use(chaiHttp);

/*
* Test the /POST authenticate route
*/
describe('Authentication', () => {
    before((done) => { //Before test we get a new token

    let user = {
        id: "1",
        name: "Daniel"
    };

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

    /*
    * Test the /GET user route
    */
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
        setTimeout(expire, 5001);
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
        setTimeout(expire, 5001);
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
        setTimeout(expire, 5001);
    });

    it('it should fail using different userId token', (done) => {

      const firstUser = jwt.sign({ user: {id: 1, name: 'dani'}}, SECRET, { expiresIn: '2s'});
      const secondUser = jwt.sign({ user: {id: 2, name: 'daniel'}}, SECRET_2+'2', { expiresIn: '1m'});

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
        setTimeout(expire, 5001);
    });

    it('it should fail without userId in token', (done) => {

      const firstUser = jwt.sign({ user: { name: 'dani'}}, SECRET, { expiresIn: '2s'});
      const secondUser = jwt.sign({ user: { name: 'daniel'}}, SECRET_2, { expiresIn: '1m'});

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
        setTimeout(expire, 5001);
    });

    it('it should fail with invalid refresh token', (done) => {

      const firstUser = jwt.sign({ user: { name: 'dani'}}, SECRET, { expiresIn: '2s'});
      const secondUser = jwt.sign({ user: { name: 'daniel'}}, SECRET, { expiresIn: '1m'}).replace('a', 'b');

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
        setTimeout(expire, 5001);
    });

    it('it should fail with invalid token', (done) => {

      const firstUser = jwt.sign({ user: { name: 'dani'}}, SECRET, { expiresIn: '2s'}).replace('a', 'b');
      const secondUser = jwt.sign({ user: { name: 'daniel'}}, SECRET, { expiresIn: '1m'});

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
        setTimeout(expire, 5001);
    });

    it('it should fail with invalid refresh token signature', (done) => {

      const firstUser = jwt.sign({ user: { id: 1, name: 'dani'}}, SECRET, { expiresIn: '2s'});
      const secondUser = jwt.sign({ user: { id: 2, name: 'daniel'}}, 'test', { expiresIn: '1m'});

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
        setTimeout(expire, 5001);
    });

    it('it should fail with invalid token signature', (done) => {

      const firstUser = jwt.sign({ user: { id: 1, name: 'dani'}}, 'test', { expiresIn: '2s'});
      const secondUser = jwt.sign({ user: { id: 2, name: 'daniel'}}, SECRET_2, { expiresIn: '1m'});

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
        setTimeout(expire, 5001);
    });
});
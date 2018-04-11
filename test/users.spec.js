import chai from 'chai';
import chaiHttp from 'chai-http';
import User from '../app/models/user';
import * as userConfiguration from './userConfiguration';

let data;
let user;
let userId;
let varysId;
let responseToken;
let responseRefreshToken;
let tokenWithoutPermission;
let refreshTokenWithoutPermission;

chai.use(chaiHttp);
chai.should();

const server = `http://localhost:${process.env.PORT || 8083}`;

describe('Users', () => {
  before((done) => {
    const promise = userConfiguration.create();

    promise.then(() => {
      data = userConfiguration.getData();

      userId = data.newUser._id;
      varysId = data.varys._id;
      user = data.newUser;

      chai.request(server)
        .post('/api/authenticate')
        .send(user)

        .end((err, res) => {
          responseToken = res.body.token;
          responseRefreshToken = res.body.refreshToken;

          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('refreshToken');

          const jhon = {
            name: 'Jhon Permission',
            password: 'password',
            email: 'jp@snow.com',
          };

          const newJhonUser = new User(jhon);

          newJhonUser.save().then(() => {
            chai.request(server)
              .post('/api/authenticate')
              .send(newJhonUser)

              .end((error, response) => {
                tokenWithoutPermission = response.body.token;
                refreshTokenWithoutPermission = response.body.refreshToken;

                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('token');
                response.body.should.have.property('refreshToken');
                done();
              });
          });
        });
    });
  });

  it('it should create user', (done) => {
    const userDaenerys = {
      name: 'Daenerys',
      password: 'password',
      email: 'd@got.com',
    };

    chai.request(server)
      .post('/api/users')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })
      .send(userDaenerys)

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        done();
      });
  });

  it('it should fail creating new user', (done) => {
    chai.request(server)
      .post('/api/users')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })
      .send(user)

      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it('it should fail find all users without permission', (done) => {
    chai.request(server)
      .get('/api/users?page=1&limit=10')
      .set({ authorization: `Bearer ${tokenWithoutPermission}` })
      .set({ 'x-refresh-token': refreshTokenWithoutPermission })

      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });

  it('it should find all users with pagination', (done) => {
    chai.request(server)
      .get('/api/users?page=1&limit=10')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('docs');
        res.body.should.have.property('total');
        done();
      });
  });

  it('it should find all users without pagination', (done) => {
    chai.request(server)
      .get('/api/users')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.at.least(1);
        done();
      });
  });

  it('it should find users by query params', (done) => {
    chai.request(server)
      .get('/api/users')
      .query({ name: 'Tywin' })
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });

  it('it should find one user', (done) => {
    chai.request(server)
      .get(`/api/users/${userId}`)
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('name').equal('Tywin');
        done();
      });
  });

  it('it should update a user', (done) => {
    const userTyrion = { name: 'Tyrion' };

    chai.request(server)
      .put(`/api/users/${userId}`)
      .send(userTyrion)
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should delete a user', (done) => {
    chai.request(server)
      .delete(`/api/users/${varysId}`)
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should fail when deleting not found id', (done) => {
    chai.request(server)
      .delete('/api/users/test')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});

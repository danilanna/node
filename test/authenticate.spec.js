import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import User from '../app/models/user';
import getConfigurations from '../config/config';

let responseToken;
let responseRefreshToken;
let user;

const config = getConfigurations(process.env.ENVIRONMENT);
const SECRET = config.session.secret;
const SECRET_2 = config.session.refreshSecret;
const server = `http://localhost:${process.env.PORT || 8083}`;
mongoose.Promise = global.Promise;

chai.use(chaiHttp);
chai.should();

describe('Authentication', () => {
  before((done) => {
    setTimeout(() => {
      mongoose.connect(config.database, { useMongoClient: true }, () => {
        mongoose.connection.db.dropDatabase();

        const jhon = {
          name: 'Jhon',
          password: 'password',
          email: 'j@snow.com',
        };

        const newUser = new User(jhon);

        newUser.save().then((val) => {
          user = val;
          done();
        });
      });
    }, 3000);
  });

  it('it should authenticate user', (done) => {
    const authUser = { email: user.email, password: user.password };

    chai.request(server)
      .post('/api/authenticate')
      .send(authUser)

      .end((err, res) => {
        responseToken = res.body.token;
        responseRefreshToken = res.body.refreshToken;

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
      .send({
        name: 'Jhon',
        password: 'Snow',
      })

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
    const expire = () => {
      chai.request(server)
        .get('/api/authenticate')
        .set({
          authorization: `Bearer ${responseToken}`,
        })
        .set({
          'x-refresh-token': responseRefreshToken,
        })

        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    };
    setTimeout(expire, 2001);
  });

  it('it should fail without sending refresh token', (done) => {
    const expire = () => {
      chai.request(server)
        .get('/api/authenticate')
        .set({
          authorization: `Bearer ${responseToken}`,
        })

        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    };
    setTimeout(expire, 2001);
  });

  it('it should fail without sending token', (done) => {
    const expire = () => {
      chai.request(server)
        .get('/api/authenticate')
        .set({
          'x-refresh-token': responseRefreshToken,
        })

        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    };
    setTimeout(expire, 2001);
  });

  it('it should fail using different userId token', (done) => {
    const firstUser = jwt.sign({
      _id: 1,
      name: 'Varys',
    }, SECRET, {
      expiresIn: '2s',
    });
    const secondUser = jwt.sign({
      _id: 2,
      name: 'Jhon',
    }, `${SECRET_2}2`, {
      expiresIn: '1m',
    });

    const expire = () => {
      chai.request(server)
        .get('/api/authenticate')
        .set({
          authorization: `Bearer ${firstUser}`,
        })
        .set({
          'x-refresh-token': secondUser,
        })

        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    };
    setTimeout(expire, 2001);
  });

  it('it should fail without userId in token', (done) => {
    const firstUser = jwt.sign({
      name: 'Varys',
    }, SECRET, {
      expiresIn: '2s',
    });
    const secondUser = jwt.sign({
      name: 'Jhon',
    }, SECRET_2, {
      expiresIn: '1m',
    });

    const expire = () => {
      chai.request(server)
        .get('/api/authenticate')
        .set({
          authorization: `Bearer ${firstUser}`,
        })
        .set({
          'x-refresh-token': secondUser,
        })

        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    };
    setTimeout(expire, 2001);
  });

  it('it should fail with invalid refresh token', (done) => {
    const firstUser = jwt.sign({
      name: 'Varys',
    }, SECRET, {
      expiresIn: '2s',
    });
    const secondUser = jwt.sign({
      name: 'Jhon',
    }, SECRET_2, {
      expiresIn: '1m',
    }).replace('a', 'b');

    const expire = () => {
      chai.request(server)
        .get('/api/authenticate')
        .set({
          authorization: `Bearer ${firstUser}`,
        })
        .set({
          'x-refresh-token': secondUser,
        })

        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    };
    setTimeout(expire, 2001);
  });

  it('it should fail with invalid token', (done) => {
    const firstUser = jwt.sign({
      name: 'Varys',
    }, SECRET, {
      expiresIn: '2s',
    }).replace('a', 'b');
    const secondUser = jwt.sign({
      name: 'Jhon',
    }, SECRET_2, {
      expiresIn: '1m',
    });

    const expire = () => {
      chai.request(server)
        .get('/api/authenticate')
        .set({
          authorization: `Bearer ${firstUser}`,
        })
        .set({
          'x-refresh-token': secondUser,
        })

        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    };
    setTimeout(expire, 2001);
  });

  it('it should fail with invalid refresh token signature', (done) => {
    const firstUser = jwt.sign({
      _id: 1,
      name: 'Varys',
    }, SECRET, {
      expiresIn: '2s',
    });
    const secondUser = jwt.sign({
      _id: 2,
      name: 'Jhon',
    }, 'test', {
      expiresIn: '1m',
    });

    const expire = () => {
      chai.request(server)
        .get('/api/authenticate')
        .set({
          authorization: `Bearer ${firstUser}`,
        })
        .set({
          'x-refresh-token': secondUser,
        })

        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    };
    setTimeout(expire, 2001);
  });

  it('it should fail with invalid token signature', (done) => {
    const firstUser = jwt.sign({
      _id: 1,
      name: 'Varys',
    }, 'test', {
      expiresIn: '2s',
    });
    const secondUser = jwt.sign({
      _id: 2,
      name: 'Jhon',
    }, SECRET_2, {
      expiresIn: '1m',
    });

    const expire = () => {
      chai.request(server)
        .get('/api/authenticate')
        .set({
          authorization: `Bearer ${firstUser}`,
        })
        .set({
          'x-refresh-token': secondUser,
        })

        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    };
    setTimeout(expire, 2001);
  });
});

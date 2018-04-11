import chai from 'chai';
import chaiHttp from 'chai-http';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';
import * as serviceConfiguration from './serviceConfiguration';

let permission;
let user;
let responseToken;
let responseRefreshToken;
let serviceId;

chai.use(chaiHttp);
chai.should();

const server = `http://localhost:${process.env.PORT || 8083}`;

describe('Service', () => {
  before((done) => {
    const promise = serviceConfiguration.create();

    promise.then(() => {
      const { newUser, newPermission } = serviceConfiguration.getData();

      permission = newPermission;
      user = newUser;

      const serviceTestPOST = {
        api: '/api/test',
        method: 'POST',
        permissions: [permission],
      };

      const postService = new Service(serviceTestPOST);

      postService.save().then((val) => {
        serviceId = val._id;

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
            done();
          });
      });
    });
  });

  it('it should create a service', (done) => {
    const service = {
      api: '/api/test',
      method: 'GET',
      permissions: [permission],
    };

    chai.request(server)
      .post('/api/services')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })
      .send(service)

      .end(async (err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('service');
        const cache = await cacheController.getCacheValue('/api/test GET');
        cache.should.not.be.empty; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('it should find all services with pagination', (done) => {
    chai.request(server)
      .get('/api/services?page=1&limit=10')
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

  it('it should find all services without pagination', (done) => {
    chai.request(server)
      .get('/api/services')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        done();
      });
  });

  it('it should find services by query params', (done) => {
    chai.request(server)
      .get('/api/services')
      .query({ method: 'GET' })
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        done();
      });
  });

  it('it should find one service', (done) => {
    chai.request(server)
      .get(`/api/services/${serviceId}`)
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('method').equal('POST');
        done();
      });
  });

  it('it should update a service', (done) => {
    const service = { api: '/api/tests', method: 'POST', permissions: [permission] };

    chai.request(server)
      .put(`/api/services/${serviceId}`)
      .send(service)
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end(async (err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        const cache = await cacheController.getCacheValue('/api/tests POST');
        cache.should.not.be.empty; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('it should delete a service', (done) => {
    chai.request(server)
      .delete(`/api/services/${serviceId}`)
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end(async (err, res) => {
        res.should.have.status(200);
        const cache = await cacheController.getCacheValue('/api/tests POST');
        cache.should.be.empty; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('it should fail when deleting not found id', (done) => {
    chai.request(server)
      .delete('/api/services/test')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});

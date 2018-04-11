import chai from 'chai';
import chaiHttp from 'chai-http';
import * as permissionConfiguration from './permissionConfiguration';

let permission;
let permissionId;
let user;
let responseToken;
let responseRefreshToken;

const server = `http://localhost:${process.env.PORT || 8083}`;

chai.use(chaiHttp);
chai.should();

describe('Permission', () => {
  before((done) => {
    const promise = permissionConfiguration.create();

    promise.then(() => {
      const { newUser, newPermission } = permissionConfiguration.getData();

      permission = newPermission;
      permissionId = permission._id;
      user = newUser;

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

  it('it should create a permission', (done) => {
    const permissionCrud = {
      name: 'Permission to Test',
      description: 'Empty',
    };

    chai.request(server)
      .post('/api/permissions')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })
      .send(permissionCrud)

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('permission');
        done();
      });
  });

  it('it should find all permissions with pagination', (done) => {
    chai.request(server)
      .get('/api/permissions?page=1&limit=10')
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

  it('it should find all permissions without pagination', (done) => {
    chai.request(server)
      .get('/api/permissions')
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        done();
      });
  });

  it('it should find permissions by query params', (done) => {
    chai.request(server)
      .get('/api/permissions')
      .query({ name: 'All PERMISSION CRUD' })
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        done();
      });
  });

  it('it should find one permission', (done) => {
    chai.request(server)
      .get(`/api/permissions/${permissionId}`)
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('name').equal('All PERMISSION CRUD');
        done();
      });
  });

  it('it should update a permission', (done) => {
    chai.request(server)
      .put(`/api/permissions/${permissionId}`)
      .send(permission)
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should delete a permission', (done) => {
    chai.request(server)
      .delete(`/api/permissions/${permissionId}`)
      .set({ authorization: `Bearer ${responseToken}` })
      .set({ 'x-refresh-token': responseRefreshToken })

      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

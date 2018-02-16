import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import User from '../app/models/user';
import Permission from '../app/models/permission';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';

const should = chai.should();

chai.use(chaiHttp);

let token, refreshToken, userId, varysId;

let user = {
    name: "Tywin",
    password: "password",
    email: 't@got.com'
};

let userVarys = {
    name: "Varys",
    password: "password",
    email: 'v@got.com'
};

let permissionCrud = {
    name: "All CRUD",
    description: "All CRUD"
};

let serviceFindAll = {
    api: "/api/users",
    description: "GET"
};

let serviceRead = {
    api: "/api/users/:id",
    description: "GET"
};

let servicePOST = {
    api: "/api/users",
    description: "POST"
};

let servicePUT = {
    api: "/api/users/:id",
    description: "PUT"
};

let serviceDELETE = {
    api: "/api/users/:id",
    description: "DELETE"
};

let perm = new Permission(permissionCrud);
perm.save();

user.permissions = [perm._id];
userVarys.permissions = [perm._id];

let newUser = new User(user);

let varys = new User(userVarys);

newUser.save();
varys.save();

serviceFindAll.permissions = [perm._id];
serviceRead.permissions = [perm._id];
servicePOST.permissions = [perm._id];
servicePUT.permissions = [perm._id];
serviceDELETE.permissions = [perm._id];

let servGetFind = new Service(serviceFindAll);
let servGetRead = new Service(serviceRead);
let servPost = new Service(servicePOST);
let servPut = new Service(servicePUT);
let servDel = new Service(serviceDELETE);
servGetFind.save();
servGetRead.save();
servPost.save();
servPut.save();
servDel.save();

cacheController.setCacheValue('/api/users GET', [perm._id.toString()]);
cacheController.setCacheValue('/api/users/:id GET', [perm._id.toString()]);
cacheController.setCacheValue('/api/users/:id PUT', [perm._id.toString()]);
cacheController.setCacheValue('/api/users POST', [perm._id.toString()]);
cacheController.setCacheValue('/api/users/:id DELETE', [perm._id.toString()]);

userId = newUser._id;
varysId = varys._id;


describe('Users', () => {

    before((done) => {

        setTimeout(() => {
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
        }, 5000);
        
  	});

    beforeEach((done) => {
        setTimeout(done(), 5000);
    });

    it('it should create user', (done) => {

        const user = {
            name: "Daenerys",
            password: "password",
            email: 'd@got.com'
        };

        chai.request(server)
        .post('/api/users')
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })
        .send(user)

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
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })
        .send(user)

        .end((err, res) => {
            res.should.have.status(500);
            done();
        });
    });

    it('it should find all users', (done) => {

        chai.request(server)
        .get('/api/users')
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('docs');
            res.body.should.have.property('total');
          	done();
        });
    });

    it('it should find users by query params', (done) => {

        chai.request(server)
        .get('/api/users')
        .query({name: 'Tywin'})
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('total', 1);
            done();
        });
    });

    it('it should find one user', (done) => {

        chai.request(server)
        .get('/api/users/'+userId)
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name').equal("Tywin");
            done();
        });
    });

    it('it should update a user', (done) => {

        const user = {name: 'Tyrion'};

        chai.request(server)
        .put('/api/users/'+userId)
        .send(user) 
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
        });
    });

    it('it should fail updating a user', (done) => {

        const user = {name: 'Tyrion'};

        chai.request(server)
        .put('/api/users/'+varysId)
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })
        .send(user)

        .end((err, res) => {
            res.should.have.status(500);
            done();
        });
    });

    it('it should delete a user', (done) => {
        
        chai.request(server)
        .delete('/api/users/'+varysId)
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });

    it('it should fail when deleting not found id', (done) => {

        chai.request(server)
        .delete('/api/users/test')
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(500);
            done();
        });
    });


});
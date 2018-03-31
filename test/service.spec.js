import chai from 'chai';
import chaiHttp from 'chai-http';
import User from '../app/models/user';
import Permission from '../app/models/permission';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';
import * as serviceConfiguration from './serviceConfiguration';

let should = chai.should(),
data, 
permission,
user,
token, 
refreshToken,
serviceId;

chai.use(chaiHttp);

const server = 'http://localhost:' + (process.env.PORT || 8083);

describe('Service', () => {

	before((done) => {

	    const promise = serviceConfiguration.create();

	    promise.then(() => {

	      	data = serviceConfiguration.getData();

	      	permission = data.permission,
	        user = data.newUser;

	        let serviceTestPOST = {
			    api: "/api/test",
			    method: "POST",
			    permissions: [permission]
			};

			let postService = new Service(serviceTestPOST);

			postService.save().then((val) => {

				serviceId = val._id;

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
	        
	    });
        
  	});

    it('it should create a service', (done) => {

        const service = {
            api: "/api/test",
            method: "GET"
        };

        chai.request(server)
        .post('/api/services')
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })
        .send(service)

        .end(async (err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('service');
            cacheController.getCacheValue("/api/test GET").should.not.be.empty;
            done();
        });
    });

    it('it should create a service with permission', (done) => {

        const service = {
            api: "/api/test",
            method: "GET",
            permissions: [permission]
        };

        chai.request(server)
        .post('/api/services')
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })
        .send(service)

        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('service');
            cacheController.getCacheValue("/api/test GET").should.not.be.empty;
            done();
        });
    });

    it('it should find all services with pagination', (done) => {

        chai.request(server)
        .get('/api/services?page=1&limit=10')
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

    it('it should find all services without pagination', (done) => {

        chai.request(server)
        .get('/api/services')
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

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
        .query({method: 'GET'})
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.at.least(1);
            done();
        });
    });

    it('it should find one service', (done) => {

        chai.request(server)
        .get('/api/services/'+serviceId)
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('method').equal("POST");
            done();
        });
    });

    it('it should update a service', (done) => {

        const service = {api: '/api/tests', method: 'POST', permissions: [permission]};

        chai.request(server)
        .put('/api/services/'+serviceId)
        .send(service) 
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            cacheController.getCacheValue("/api/tests POST").should.not.be.empty;
            done();
        });
    });

    it('it should delete a service', (done) => {
        
        chai.request(server)
        .delete('/api/services/'+serviceId)
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end(async (err, res) => {
            res.should.have.status(200);
            const service = await cacheController.getCacheValue("/api/tests POST");
            service.should.be.empty;
            done();
        });
    });

    it('it should fail when deleting not found id', (done) => {

        chai.request(server)
        .delete('/api/services/test')
        .set({ "authorization":"Bearer " + token })
        .set({ "x-refresh-token": refreshToken })

        .end((err, res) => {
            res.should.have.status(500);
            done();
        });
    });


});
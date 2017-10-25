//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

const should = chai.should();

chai.use(chaiHttp);

let token, refreshToken;

/*
* Test the USERS route
*/
describe('Users', () => {

    before((done) => { //Before test we get a new token

    	process.env.ENVIRONMENT = 'dev';

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
    it('it should find users', (done) => {

        chai.request(server)
        .get('/api/users')
        .set({ "authorization":"Bearer " + token })

        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.not.be.eql(0);
          	done();
        });
    });

});
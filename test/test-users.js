import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import User from '../app/models/user';

const should = chai.should();

chai.use(chaiHttp);

let token, refreshToken, userId, varysId;

const user = {
    name: "Tywin",
    password: "password"
};

const userVarys = {
    name: "Varys",
    password: "password"
};

describe('Users', () => {

    before((done) => {

        const newUser = new User(user);

        const varys = new User(userVarys);

        newUser.save();
        varys.save();

        userId = newUser._id;
        varysId = varys._id;;
		
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

    it('it should create user', (done) => {

        const user = {
            name: "Daenerys",
            password: "password"
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
            res.body.should.be.a('array');
            res.body.length.should.not.be.eql(0);
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
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
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
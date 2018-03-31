import chai from 'chai';
import User from '../app/models/user';
import Permission from '../app/models/permission';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';
import * as permissionConfiguration from './permissionConfiguration';
import PermissionController from '../app/controllers/permissionController';
import ServiceController from '../app/controllers/serviceController';
import UserController from '../app/controllers/userController';

let should = chai.should(),
  data,
  permission,
  permissionId,
  user,
  userController = new UserController(),
  serviceController = new ServiceController(),
  permissionController = new PermissionController();

describe('Permission Controller', () => {

  before((done) => {

      const promise = permissionConfiguration.create();

      promise.then(() => {

          data = permissionConfiguration.getData();

          permission = data.permission,
          permissionId = permission._id,
          user = data.newUser;

          done();

      })
  });

  it('it should delete a permission', (done) => {

    let users, services, service, usersDeleted, servicesDeleted;

    userController.find({
      permissions: {
        $elemMatch: {
          $in: [permissionId]
        }
      }
    }).then((val) => {
      users = val;

      serviceController.find({
        permissions: {
          $elemMatch: {
            $in: [permissionId]
          }
        }
      }).then((val) => {
        services = val;

        users.should.be.a('array');
        users.length.should.be.at.least(1);

        services.should.be.a('array');
        services.length.should.be.at.least(1);

        service = services[0];

        cacheController.getCacheValue(service.api + ' ' + service.method).should.not.be.empty;

        const promise = permissionController.remove(permissionId);

        promise.then(async () => {

          const promiseUsersDeleted = userController.find({
            permissions: {
              $elemMatch: {
                $in: [permissionId]
              }
            }
          });

          promiseUsersDeleted.then((val) => {

            usersDeleted = val;

            serviceController.find({
              permissions: {
                $elemMatch: {
                  $in: [permissionId]
                }
              }
            }).then(async (val) => {
              servicesDeleted = val;

              const serviceCached = await cacheController.getCacheValue(service.api + ' ' + service.method);

              serviceCached.length.should.be.at.least(0);

              usersDeleted.should.be.a('array');
              usersDeleted.forEach(val => val.permissions.should.be.empty);

              servicesDeleted.should.be.a('array');
              servicesDeleted.forEach(val => val.permissions.should.be.empty);

              done();
            });

          })

        });

      });

    });

  });

});
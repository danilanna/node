import chai from 'chai';
import * as cacheController from '../app/controllers/cacheController';
import * as permissionConfiguration from './permissionConfiguration';
import PermissionController from '../app/controllers/permissionController';
import ServiceController from '../app/controllers/serviceController';
import UserController from '../app/controllers/userController';

let permission;
let permissionId;

const userController = new UserController();
const serviceController = new ServiceController();
const permissionController = new PermissionController();

chai.should();

describe('Permission Controller', () => {
  before((done) => {
    const promise = permissionConfiguration.create();

    promise.then(() => {
      const { newPermission } = permissionConfiguration.getData();

      permission = newPermission;
      permissionId = permission._id;

      done();
    });
  });

  it('it should delete a permission', (done) => {
    let users;
    let services;
    let service;
    let usersDeleted;
    let servicesDeleted;

    userController.find({
      permissions: {
        $elemMatch: {
          $in: [permissionId],
        },
      },
    }).then((userResponse) => {
      users = userResponse;

      serviceController.find({
        permissions: {
          $elemMatch: {
            $in: [permissionId],
          },
        },
      }).then(async (serviceResponse) => {
        services = serviceResponse;

        users.should.be.a('array');
        users.length.should.be.at.least(1);

        services.should.be.a('array');
        services.length.should.be.at.least(1);

        [service] = services;

        await cacheController.getCacheValue(`${service.api} ${service.method}`).should.not.be.empty;

        const promise = permissionController.remove(permissionId);

        promise.then(async () => {
          const promiseUsersDeleted = userController.find({
            permissions: {
              $elemMatch: {
                $in: [permissionId],
              },
            },
          });

          promiseUsersDeleted.then((deletedResponse) => {
            usersDeleted = deletedResponse;

            serviceController.find({
              permissions: {
                $elemMatch: {
                  $in: [permissionId],
                },
              },
            }).then(async (serviceDeletedResponse) => {
              servicesDeleted = serviceDeletedResponse;

              const serviceCached = await cacheController.getCacheValue(`${service.api} ${service.method}`);

              serviceCached.length.should.be.at.least(0);

              usersDeleted.should.be.a('array');
              usersDeleted.forEach(val => val.permissions.should.be.empty);

              servicesDeleted.should.be.a('array');
              servicesDeleted.forEach(val => val.permissions.should.be.empty);

              done();
            });
          });
        });
      });
    });
  });
});

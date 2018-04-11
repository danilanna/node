const config = {
  production: {
    session: {
      secret: 'Stark',
      refreshSecret: 'Lannister',
      tokenExpirationTime: '2s',
      refreshTokenExpirationTime: '7d',
    },
    database: 'mongodb://',
    redis_pw: '',
    redis_db: '',
    redis_port: '',
    port: 8083,
  },
  test: {
    session: {
      secret: 'Tyrel',
      refreshSecret: 'Tully',
      tokenExpirationTime: '2s',
      refreshTokenExpirationTime: '7d',
    },
    database: 'mongodb://',
    redis_pw: '',
    redis_db: '',
    redis_port: '',
    port: 8083,
  },
};

const getConfigurations = env => config[env];

export default getConfigurations;

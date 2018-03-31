const config = {
	production: {
		session: {
	      	secret: 'Stark',
	      	secret_2: 'Lannister',
	      	tokenExpirationTime: '2s',
	      	refreshTokenExpirationTime: '7d'
	    },
 		database: 'mongodb://',
 		redis_pw: '',
 		redis_db: '',
 		redis_port: '',
 		port: 8083
  	},
	test: {
		session: {
			secret: 'Tyrel',
			secret_2: 'Tully',
			tokenExpirationTime: '2s',
			refreshTokenExpirationTime: '7d'
		},
		database: 'mongodb://',
		redis_pw: '',
 		redis_db: '',
 		redis_port: '',
		port: 8083
	}
}

export const getConfigurations = (env) => {
  	return config[env];
}
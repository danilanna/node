const config = {
	production: {
		session: {
	      	secret: 'Stark',
	      	secret_2: 'Lannister',
	      	tokenExpirationTime: '1d',
	      	refreshTokenExpirationTime: '7d'
	    },
 		database: 'mongodb://'
  	},
	test: {
		session: {
			secret: 'Tyrel',
			secret_2: 'Tully',
			tokenExpirationTime: '2s',
			refreshTokenExpirationTime: '7d'
		},
		database: 'mongodb://'
	},
	default: {
		session: {
			secret: 'Bolton',
			secret_2: 'Frey',
			tokenExpirationTime: '1d',
			refreshTokenExpirationTime: '7d'
		},
		database: 'mongodb://'
	}
}

export const getConfigurations = (env) => {
  	return config[env] || config.default;
}
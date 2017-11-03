const config = {
	production: {
		session: {
	      	secret: '',
	      	secret_2: '',
	      	tokenExpirationTime: ''
	    },
 		database: ''
  	},
	test: {
		session: {
			secret: '',
			secret_2: '',
			tokenExpirationTime: ''
		},
		database: ''
	},
	default: {
		session: {
			secret: '',
			secret_2: '',
			tokenExpirationTime: ''
		},
		database: ''
	}
}

export const getConfigurations = (env) => {
  	return config[env] || config.default;
}
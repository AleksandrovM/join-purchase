module.exports = {
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/joint_purchase',
        credentials: {
            user: process.env.MONGODB_USER || '',
            password: process.env.MONGODB_PASSWORD || ''
        }
    },
    auth: {
        jwtSecret: 'cQfTjWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y/B?E(H+KbPeShVmYq3t6w9z$C&F)',
        jwtSession: {session: false},
        tokenAge: '1d', // auth expiry - 1 day
        shortTokenAge: '2m', // auth expiry - 2 minutes
    }
};
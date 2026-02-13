module.exports = {
    baseUrl: 'https://hotel-example-site.takeyaqa.dev/en-US',

    users: {
        clark: { email: 'clark@example.com', password: 'password', rank: 'premium', name: 'Clark Evans' },
        diana: { email: 'diana@example.com', password: 'pass1234', rank: 'normal', name: 'Diana Johansson' },
        ororo: { email: 'ororo@example.com', password: 'pa55w0rd!', rank: 'premium', name: 'Ororo Saldana' },
        miles: { email: 'miles@example.com', password: 'pass-pass', rank: 'normal', name: 'Miles Boseman' }
    },

    newUser: {
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        passwordConfirmation: 'SecurePass123!',
        username: 'John Doe',
        rank: 'premium',
        address: '123 Main Street, New York, NY 10001',
        tel: '05550123000',
        gender: '0',
        notification: false
    },

    invalidEmailUser: {
        email: 'invalid-email-format',
        password: 'Test123!',
        passwordConfirmation: 'Test123!',
        username: 'Test User'
    },

    deleteUser: {
        email: 'deleteme@example.com',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
        username: 'DeleteMe User',
        rank: 'normal'
    },

    iconUser: {
        email: 'iconuser@example.com',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
        username: 'Icon User',
        rank: 'premium'
    },

    guestPlanCount: 7,
    normalMemberPlanCount: 9,
    premiumMemberPlanCount: 10
};

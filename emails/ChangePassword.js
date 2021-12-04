module.exports = function(person) {
    console.log(person);

    return {
        from: '"Admin" <admin@erp.test>',
        to: person.email,
        subject: 'Password reset',
        text: `
            Change password request

            Hi ${person.name} ${person.surname}! Your password has been changed correctly !
        `,

        html: `
            <h3>Change password request</h3>
            <p>
                
            Change password request!

            Hi ${person.name} ${person.surname}! Your password has been changed correctly !
            </p>
        `
    };
};

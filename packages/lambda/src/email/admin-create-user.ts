export const getAdminCreateUserEmail = (username: string, tempPassword: string) => `
    You have been signed up here are your credentials
    <br />
    <br />
    Your username is 
    <br />
    <br />
    <strong>${username}</strong>
    <br />
    <br />
     Your temporary password is
    <br />
    <br />
    <strong>${tempPassword}</strong>
    <br />
    <br />
    You should change this once you login
`
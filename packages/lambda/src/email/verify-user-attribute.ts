export const getVerifyUserAttributeEmail = (code: string) => `
    Your verification code is
    <br />
    <br />
    <strong>${code}</strong>
`;

export const getVerifyUserAttributeSms = (code: string) =>
    `Your verification code is ${code}`;

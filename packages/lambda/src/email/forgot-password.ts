export const getForgotPasswordEmail = (code: string) => `
    You have requested for your password to be reset, below is your verification code
    <br />
    <br />
    <strong>${code}</strong>
`;

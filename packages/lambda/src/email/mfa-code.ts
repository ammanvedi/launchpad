export const getMfaCodeEmail = (code: string) => `
    Your MFA code is
    <br />
    <br />
    <strong>${code}</strong>
`;

export const getMfaCodeSms = (code: string) => `Your MFA code is ${code}`;

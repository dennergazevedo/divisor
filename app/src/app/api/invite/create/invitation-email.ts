export const getInvitationEmailHtml = (
  inviterName: string,
  tenantName: string,
  inviteLink: string,
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #09090b;
      color: #fafafa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #18181b;
      border: 1px solid #27272a;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #fff !important;
      margin-bottom: 24px;
      display: inline-block;
      text-decoration: none;
    }
    .logo-purple {
      color: #9333ea;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 16px;
      color: #fff;
    }
    p {
      font-size: 16px;
      line-height: 24px;
      color: #a1a1aa;
      margin-bottom: 32px;
    }
    .button {
      display: inline-block;
      background-color: #9333ea;
      color: #fff !important;
      padding: 12px 32px;
      border-radius: 9999px;
      font-weight: 600;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #a855f7;
    }
    .footer {
      margin-top: 32px;
      font-size: 12px;
      color: #71717a;
    }
    .divider {
      height: 1px;
      background-color: #27272a;
      margin: 32px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <a href="https://divisor.dev" class="logo">
        <span class="logo-purple">Divisor</span>.dev
      </a>
      <h1>You've been invited!</h1>
      <p>
        <strong>${inviterName}</strong> invited you to collaborate on the project <strong>${tenantName}</strong> at Divisor.
      </p>
      <a href="${inviteLink}" class="button">Accept Invitation</a>
      <div class="divider"></div>
      <p style="margin-bottom: 0; font-size: 14px;">
        If you weren't expecting this invitation, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Divisor. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

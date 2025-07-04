module.exports = {
  apps: [{
    name: 'mixit',
    cwd: '/home/ubuntu/project/Mixit',  
    script: 'npm',
    args: 'run start',                  
    env: {
      NODE_ENV: 'production',
      APP_ENV: 'live',
      NEXTAUTH_URL: 'http://15.164.12.9:3000',
      NEXT_PUBLIC_SSO_COOKIE_DOMAIN: '15.164.12.9',
      NEXTAUTH_COOKIE_NAME: 'next-auth.session-token-live',
      NEXTAUTH_SECRET: '1a2b3c4d5e6f7081a2b33b4c5d6e7f8091a2b3c4d5e6f708c4d5e6f708e2f1a',
      BACKEND_URL: 'http://54.180.33.96:8080',
      PORT: '3000'
    }
  }]
};

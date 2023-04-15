# Blog AI Generator

## Getting Started

## Create Next App

npx create-next-app .
npx create-next-app@latest . --typescript
npx create-next-app . -e <https://github.com/tomphill/nextjs-openai-starter>

## Stop In-use PORT

Retrieve PID: sudo lsof -i :3000
Execute Kill: kill -9 %PID%

## Run Project

Development: npm run dev

## Authentication => Auth0

[NextJS Auth0 Documentation](https://www.npmjs.com/package/@auth0/nextjs-auth0)
Generate Auth0 Secret Key: openssl rand -hex 32

login:
useUser:
withPageAuthRequired:

    export const getServerSideProps = withPageAuthRequired(async () => {
    });

withApiAuthRequired:

    export default withApiAuthRequired(async function handler(req, res) {});

getSession:

     const { user } = await getSession(req, res);

## Images

Add the base URL of external images to your projects 'next.config.js' file

    images: {
        domains: ["s.gravatar.com"],
    },

    npm run dev

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

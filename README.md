# SkyLogic - Portfolio CMS

A professional, full-stack, retro-themed Portfolio CMS built for developers. 
Designed with a "Stardew Valley / Terraria" pixel aesthetic.

## Features

- **Pixel Theme UI**: Built with Tailwind CSS and custom pixel-art styling (borders, shadows, fonts).
- **Fully Dynamic Content**: Everything shown on the public portfolio is editable from the Admin Dashboard. No hardcoded content!
- **Admin Dashboard**: Manage Hero section, About lore, Projects, Skills, Guestbook messages, Media uploads, and Site Settings.
- **Secure Authentication**: Email-based OTP login with JWT access and refresh tokens.
- **Visitor Analytics**: Real-time visitor tracking and view counts via Socket.io.
- **Unified Architecture**: Next.js (App Router) frontend and Express backend running seamlessly together on the same port, backed by Prisma + MySQL.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, TanStack Query.
- **Backend**: Express.js, TypeScript, Socket.io, Multer, JSON Web Tokens.
- **Database**: MySQL managed via Prisma ORM.

## Setup Instructions

1. **Database Setup**
   - Install MySQL and create a database named `skylogic_db`.
   - Update your `.env` file with the connection string:
     `DATABASE_URL="mysql://username:password@localhost:3306/skylogic_db"`
   - Run `npx prisma db push` to generate the schema.

2. **Environment Variables**
   - Create a `.env` file in the root based on `.env.example` (or just add the standard JWT_SECRET, NODEMAILER details, and DB URL).

3. **Install Dependencies**
   - Run `npm install`

4. **Development**
   - Run `npm run dev`
   - Access the portfolio at `http://localhost:3000`
   - Access the Admin Dashboard at `http://localhost:3000/login`

5. **Production**
   - Build the project: `npm run build`
   - Start the server: `npm start`

## Assets & Customization

- Add your pixel assets (like avatars, grid backgrounds) to the `public/pixel-assets` folder.
- Configure theme overrides via the Admin Settings page.

## License

MIT License. Designed by SkyLogic.

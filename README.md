This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Movies Application

This is a comprehensive movies application built with React, Redux, and Next.js.


### Installation
1. Clone the repository:
   ```
   git clone https://github.com/zulicek/movies-keyboard-navigation.git
   ```
2. Navigate to the project directory:
   ```
   cd movies-keyboard-navigation
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Features
- Loading movie genres and display them
- Navigation between slides using arrows
- Move to the correct active slide when using arrow keys
- Remove navigation buttons when arrow keys are pressed
- Scroll to active row when
- Update active slide index when hovering over a movie card

## Project Structure
```
movies-keyboard-navigation/
├── app/
│   ├── fonts
│   ├── globals.css
├---cypress/
├── src/
│   |── components/
|   ├── hooks/
|   ├── services/
|   ├── store/
├── .gitignore
├── cypress.config.ts
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Testing
Open cypress testing with:
```
npm run cypress
```
Run tests with:
```
npm run test:e2e
```

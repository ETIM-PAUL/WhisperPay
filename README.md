# WhisperPay - Privacy-first Group Payments


WhisperPay is a decentralized application (dApp) that enables secure, anonymous, and efficient group-based financial coordination using Web3 wallets. Built on the Avalanche blockchain, it provides a privacy-focused solution for group payments, DAO operations, and team fund management.

## Features

### 🔒 Privacy by Default
- Private group transactions
- Stealth address routing using eERC20
- End-to-end encrypted balances
- Anonymous peer-to-peer payments

### 👥 Built for Groups
- Create & manage multiple group wallets
- Set target amounts and event due date
- Track contributions privately
- Ideal for DAOs, Group Events (Birthdays, Weddings, Parties, Get Togethers), and Team payments

### ⚡ Technical Features
- Built on Avalanche C-Chain
- Smart contract-based group management
- Real-time countdown timers for events
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Yarn package manager
- Web3 wallet (MetaMask, etc.)
- Avalanche Fuji Testnet connection

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whisper_pay.git
cd whisper_pay
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file with your configuration:
```env
VITE_PROJECT_ID=your_project_id
```

4. Start the development server:
```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Smart Contracts

The application interacts with two main smart contracts:

### GroupFactory Contract
- Address: `0x0807840D99a4d6077bd3544C0Dd957735Bfc8AdF`
- Creates and manages group instances
- Tracks all groups and their details

### Group Contract
- Deployed per group
- Manages individual group operations
- Handles contributions and target amounts

## Technology Stack

- **Frontend**: React, Vite, TailwindCSS
- **Avalanche Encrypted ERC20 Standard** 
- **Web3**: Ethers.js, AppKit
- **UI Components**: 
  - Framer Motion for animations
  - HeadlessUI for modals
  - React Hot Toast for notifications
  - React Calendar for event scheduling

## Features in Detail

### Group Creation
- Set group name and description
- Define target amount
- Set event due date
- Automatic stealth address generation

### Group Management
- View all groups
- Track contribution progress
- Real-time countdown timers
- Private contribution handling

### Privacy Features
- Anonymous contributions
- Encrypted balances
- Stealth transfers
- Private group metadata

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

WhisperPay prioritizes security and privacy. All transactions are:
- End-to-end encrypted
- Routed through stealth addresses
- Protected by smart contract validation
- Verified on the Avalanche blockchain

## Support

For support, please open an issue in the GitHub repository or contact the team at support@whisperpay.xyz

## Acknowledgments

- Built with [AppKit](https://docs.appkit.xyz/)
- Powered by [Avalanche](https://www.avax.network/)
- UI components from [TailwindCSS](https://tailwindcss.com/)

# Vite React Tailwind Starter
![Screenshots](https://i.imgur.com/vlZMdj3.png)


This is a [Vite](https://vitejs.dev/), [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/) project bootstrapped using vite-react-tailwind-starter created by [Theodorus Clarence](https://github.com/theodorusclarence/vite-react-tailwind-starter).
- 💡 Instant Server Start
- ⚡️ Lightning Fast HMR
- 🛠️ Rich Features
- 📦 Optimized Build
- 🔩 Universal Plugin Interface
- 🔑 Fully Typed APIs

See the deployment on [https://vite-react-tailwind-starter.theodorusclarence.com/](https://vite-react-tailwind-starter.theodorusclarence.com/)


## Installation

### Clone the template

To clone this template you can use one of the three ways:


#### 1. Use npx degit
```bash
npx degit https://github.com/theodorusclarence/vite-react-tailwind-starter my-app
```
replace `my-app` with your application name


#### 2. Use this repository as a template

![Use as template](https://i.imgur.com/I6aThUJ.png)


#### 3. Deploy to vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftheodorusclarence%2Fvite-react-tailwind-starter)


### Running The Application
First, install all the dependencies,
```bash
npm i
# or
yarn
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

![Finished Build](https://i.imgur.com/c9P343j.png)

You can start editing the page by modifying `pages/Home.jsx`. The page auto-updates as you edit the file.

## What's Inside

### Absolute import

You can absolute import by using `@/`

For example
```jsx
import UnstyledLink from '@/components/UnstyledLink'
```
You can also use auto import and it should work automatically.

When you add a new folder in src, add it on the `jsconfig.json`
```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "baseUrl": "./src",
    "paths": {
      "@/components/*": ["./components/*"],
      "@/pages/*": ["./pages/*"],
      "@/routes/*": ["./routes/*"],
      // add new folder here
    },
  },
}
```

### Inter Fonts

Inter fonts is self hosted. The default weights are `400, 600, 700`. To add more, use fontsquirrel.

### UnstyledLink Component
Used as a component for Next.js Link. Will render out Next/Link if the href started with `/` or `#`, else will render an `a` tag with `target='_blank'`.

### CustomLink Component
An extension of UnstyledLink Component, you can add your default styling for a button/link.
```jsx
<UnstyledLink
      className={`${props.className} inline-flex items-center font-bold hover:text-primary-400`}
      {...props}
/>
```

### Default Favicon Declaration
Use [Favicon Generator](https://www.favicon-generator.org/) and then overwrite the files in `/public/favicon`

### Just-In-Time Tailwindcss
Defaulted to true, you can uncomment the `mode='jit'` in `/tailwind.config.js`

### Default Styles
There are default styles for responsive heading sizes, and `.layout` to support a max-width for larger screen size.

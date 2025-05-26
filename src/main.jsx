import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.css';
import App from '@/App';
import { Helmet } from 'react-helmet';
import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { avalanche } from "@reown/appkit/networks";

// 1. Get projectId
const projectId = "4940035ce4b4813061af223f7b3c77f4";

// 2. Create a metadata object - optional
const metadata = {
  name: "WhisperPay",
  description: "Privacy-first Group Payments",
  url: "https://whisperpay.xyz", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 3. Create the AppKit instance
createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadata,
  networks: [avalanche],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

// ReactDOM.render(
//   <React.StrictMode>
//     <Helmet
//       defaultTitle='WhisperPay'
//       titleTemplate='%s | WhisperPay'
//     >
//       <meta charSet='utf-8' />
//       <html lang='en' amp />
//     </Helmet>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

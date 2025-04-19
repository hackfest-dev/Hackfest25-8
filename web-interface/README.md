<div align="center">
  
  # Quantum-Safe Blockchain Explorer with SPHINCS+ and Lattice-Based Cryptography
  
  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
</div>

This project is a cutting-edge quantum-safe blockchain explorer that leverages SPHINCS+ and lattice-based cryptography to provide enhanced security against quantum attacks. It offers real-time insights into blockchain transactions, security metrics, and quantum-safe transaction tracking, making it an essential tool for researchers, developers, and security analysts interested in post-quantum cryptography and blockchain technology.

## ✨ Features

- **Quantum-Safe and Classical Block Simulation:** Add and simulate both quantum-safe and classical blocks to the blockchain.
- **Comprehensive Dashboard:** View total blocks, total transactions, quantum-safe transaction percentages, active attacks, vulnerabilities, and mitigation success rates.
- **Security Metrics Visualization:** Detailed security metrics and comparisons to assess blockchain safety.
- **Transaction List:** Real-time list of recent blockchain transactions.
- **Multi-Page Application:** Includes pages for Blockchain, Transactions, Security, Education, Smart Contracts, and Analytics.
- **Responsive UI:** Built with React, Tailwind CSS, and shadcn-ui for a modern and responsive user experience.
- **Notifications and Tooltips:** User-friendly notifications and tooltips for better interaction and feedback.

## 🛠️ Technologies Used

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://vitejs.dev/logo.svg" width="30"/><br>Vite</td>
      <td align="center"><img src="https://reactjs.org/favicon.ico" width="30"/><br>React</td>
      <td align="center"><img src="https://www.typescriptlang.org/favicon-32x32.png" width="30"/><br>TypeScript</td>
      <td align="center"><img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="30"/><br>Tailwind CSS</td>
    </tr>
    <tr>
      <td align="center"><img src="https://avatars.githubusercontent.com/u/139895814?s=200&v=4" width="30"/><br>shadcn/ui</td>
      <td align="center"><img src="https://supabase.com/favicon/favicon-32x32.png" width="30"/><br>Supabase</td>
      <td align="center"><img src="https://raw.githubusercontent.com/TanStack/query/main/media/emblem-light.svg" width="30"/><br>React Query</td>
      <td align="center"><img src="https://reactrouter.com/favicon-light.png" width="30"/><br>React Router</td>
    </tr>
  </table>
</div>

- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn-ui](https://ui.shadcn.com/) - Radix UI components with Tailwind CSS
- [Supabase](https://supabase.com/) - Backend as a service for data fetching and storage
- [React Query](https://tanstack.com/query/latest) - Data fetching and caching
- [React Router](https://reactrouter.com/) - Routing library
- Various Radix UI components for accessible UI primitives

## 🚀 Installation

1. Clone the repository:

```sh
git clone https://github.com/hackfest-dev/Hackfest25-8.git
```

2. Navigate to the project directory:

```sh
cd web-interface
```

3. Install dependencies:

```sh
npm install
```

## 📋 Usage

Start the development server with hot reloading:

```sh
npm run dev
```

Open your browser and navigate to `http://localhost:xxxx` (or the port shown in your terminal) to view the app.

## 🏗️ Build

To create a production build:

```sh
npm run build
```

To preview the production build locally:

```sh
npm run preview
```

## 📁 Folder Structure

```
web-interface/
├── node_modules/
├── public/
│   └── robots.txt
├── src/
│   ├── backend/
│   │   └── crypto/
│   │       ├── kyber/
│   │       └── sphincs/
│   │           └── utils.ts
│   ├── components/
│   │   └── ui/
│   │       ├── Layout.tsx
│   │       ├── Navbar.tsx
│   │       ├── NetworkSecurityGraph.tsx
│   │       ├── QuantumAttack.tsx
│   │       ├── QuantumDemo.tsx
│   │       ├── SearchInput.tsx
│   │       ├── SecurityComparison.tsx
│   │       ├── SecurityMetrics.tsx
│   │       ├── SecurityRiskPie.tsx
│   │       ├── SecurityStatus.tsx
│   │       ├── Sidebar.tsx
│   │       ├── StatsCard.tsx
│   │       ├── TransactionFlow.tsx
│   │       ├── TransactionsList.tsx
│   │       ├── TransactionVolume.tsx
│   │       └── WalletButton.tsx
│   ├── frontend/
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
├── .gitignore
├── blockchainapi.txt
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```





<div align="center">
  <p>Thank you for exploring this quantum-safe blockchain project! If you have any questions or feedback, feel free to open an issue or contact the maintainers.</p>
  
  <img src="https://img.shields.io/badge/SPHINCS+-Enabled-8A2BE2" alt="SPHINCS+ Enabled">
  <img src="https://img.shields.io/badge/Kyber-Lattice-00BFFF" alt="Kyber Lattice">
</div>


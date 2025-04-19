# Quantum-Safe Blockchain Explorer with SPHINCS+ and Lattice-Based Cryptography

This project is a cutting-edge quantum-safe blockchain explorer that leverages SPHINCS+ and lattice-based cryptography to provide enhanced security against quantum attacks. It offers real-time insights into blockchain transactions, security metrics, and quantum-safe transaction tracking, making it an essential tool for researchers, developers, and security analysts interested in post-quantum cryptography and blockchain technology.

## Features

- **Quantum-Safe and Classical Block Simulation:** Add and simulate both quantum-safe and classical blocks to the blockchain.
- **Comprehensive Dashboard:** View total blocks, total transactions, quantum-safe transaction percentages, active attacks, vulnerabilities, and mitigation success rates.
- **Security Metrics Visualization:** Detailed security metrics and comparisons to assess blockchain safety.
- **Transaction List:** Real-time list of recent blockchain transactions.
- **Multi-Page Application:** Includes pages for Blockchain, Transactions, Security, Education, Smart Contracts, and Analytics.
- **Responsive UI:** Built with React, Tailwind CSS, and shadcn-ui for a modern and responsive user experience.
- **Notifications and Tooltips:** User-friendly notifications and tooltips for better interaction and feedback.

## Technologies Used

- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn-ui](https://ui.shadcn.com/) - Radix UI components with Tailwind CSS
- [Supabase](https://supabase.com/) - Backend as a service for data fetching and storage
- [React Query](https://tanstack.com/query/latest) - Data fetching and caching
- [React Router](https://reactrouter.com/) - Routing library
- Various Radix UI components for accessible UI primitives

## Installation

1. Clone the repository:

```sh
git clone <YOUR_GIT_URL>
```

2. Navigate to the project directory:

```sh
cd <YOUR_PROJECT_NAME>
```

3. Install dependencies:

```sh
npm install
```

## Usage

Start the development server with hot reloading:

```sh
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal) to view the app.

## Build

To create a production build:

```sh
npm run build
```

To preview the production build locally:

```sh
npm run preview
```

## Folder Structure

```
src/
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations (e.g., Supabase)
├── lib/                 # Utility functions
├── pages/               # Application pages and routes
├── services/            # API and data fetching services
├── types/               # TypeScript type definitions
public/                  # Static assets
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code follows the existing style and passes linting.

## License

This project is licensed under the [MIT License](LICENSE) (or specify your license).

## Editing Files on GitHub

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

## Using GitHub Codespaces

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

---

Thank you for exploring this quantum-safe blockchain project! If you have any questions or feedback, feel free to open an issue or contact the maintainers.

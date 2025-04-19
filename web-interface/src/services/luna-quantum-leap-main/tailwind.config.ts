
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				quantum: {
					50: '#f0f7ff',
					100: '#e0f0fe',
					200: '#bae0fd',
					300: '#7cc8fb',
					400: '#36adf6',
					500: '#0c91e6',
					600: '#0072c3',
					700: '#0058a1',
					800: '#004985',
					900: '#073f70',
					950: '#042a4e'
				},
				dilithium: {
					50: '#f0f8ff',
					100: '#e0f1fe',
					200: '#b9e3fe',
					300: '#7ccefd',
					400: '#35b0fb',
					500: '#0e97f2',
					600: '#0078d4',
					700: '#0062b1',
					800: '#075390',
					900: '#0a4777',
					950: '#062c4e'
				},
				kyber: {
					50: '#f5f3ff',
					100: '#ede8ff',
					200: '#ddd5ff',
					300: '#c3b5fe',
					400: '#a889fd',
					500: '#9163fa',
					600: '#8042f0',
					700: '#7031df',
					800: '#5c29b8',
					900: '#4d2695',
					950: '#301463'
				},
				sphincs: {
					50: '#f2fbf4',
					100: '#e0f7e5',
					200: '#c1eece',
					300: '#90dfa7',
					400: '#5cc77a',
					500: '#36ad59',
					600: '#258a44',
					700: '#1e6e38',
					800: '#1c5830',
					900: '#174829',
					950: '#0c2816'
				}
			},
			fontFamily: {
				'sans': ['Inter', 'sans-serif'],
				'mono': ['JetBrains Mono', 'monospace']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'quantum-pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'quantum-pulse': 'quantum-pulse 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

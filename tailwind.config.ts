
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
					DEFAULT: 'hsl(var(--accent-green))',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#f8fafc',
					foreground: '#0f172a'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent-green-light))',
					foreground: '#ffffff'
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: '#f1f5f9',
					foreground: '#64748b'
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#0f172a'
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#0f172a'
				},
				// Dark theme
				dark: {
					bg: 'hsl(var(--dark-bg))',
					surface: 'hsl(var(--dark-surface))',
					card: 'hsl(var(--dark-card))',
					border: 'hsl(var(--dark-border))',
				},
				// Nutrition brand colors (kept for dashboard compatibility)
				nutrition: {
					green: '#22c55e',
					'green-light': '#4ade80',
					'green-lighter': '#bbf7d0',
					'green-dark': '#16a34a',
					'green-darker': '#15803d',
					'green-emerald': '#10b981',
					'green-sage': '#84cc16',
					'green-forest': '#14532d',
					accent: '#10b981',
					'accent-light': '#34d399',
					'accent-dark': '#059669',
					black: '#0f172a',
					white: '#ffffff',
					gray: '#64748b',
					'gray-light': '#94a3b8',
					'gray-lighter': '#f1f5f9',
				}
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
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

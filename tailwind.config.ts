
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
					DEFAULT: '#16a34a', // Green-600
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#f8fafc', // Slate-50
					foreground: '#0f172a'
				},
				accent: {
					DEFAULT: '#059669', // Emerald-600
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
				// Nueva paleta de colores más armoniosa para nutrición
				nutrition: {
					green: '#16a34a',        // Green-600 - Principal
					'green-light': '#4ade80', // Green-400 - Suave
					'green-lighter': '#bbf7d0', // Green-200 - Muy suave
					'green-dark': '#15803d',   // Green-700 - Oscuro
					'green-darker': '#166534', // Green-800 - Muy oscuro
					'green-emerald': '#059669', // Emerald-600 - Para acentos
					'green-sage': '#84cc16',   // Lime-500 - Verde sabio
					'green-forest': '#14532d', // Green-900 - Verde bosque
					accent: '#059669',         // Emerald-600 - Acento principal
					'accent-light': '#34d399', // Emerald-400
					'accent-dark': '#047857',  // Emerald-700
					black: '#0f172a',         // Slate-900
					white: '#ffffff',
					gray: '#64748b',          // Slate-500
					'gray-light': '#94a3b8',  // Slate-400
					'gray-lighter': '#f1f5f9', // Slate-100
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

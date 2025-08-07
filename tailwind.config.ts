import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ✅ This color mapping is correct and uses your CSS variables.
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Direct alias for convenience
        'muted-foreground': 'hsl(var(--muted-foreground))',
        // Custom Sri Lanka themed colors
        'sri-maroon': '#8D153A',
        'sri-gold': '#FFC72C',
        'sri-green': '#008060',
        'sri-orange': '#FF5722',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      // ⬇️ REVISED: All keyframes are now centralized here.
      keyframes: {
        // Your existing keyframes (preserved)
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Keyframes from globals.css, correctly translated
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        waveBuoyancy1: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) translateX(3px) rotate(0.5deg)' },
          '50%': { transform: 'translateY(-12px) translateX(0px) rotate(0deg)' },
          '75%': { transform: 'translateY(-6px) translateX(-3px) rotate(-0.5deg)' },
        },
        waveBuoyancy2: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '20%': { transform: 'translateY(-6px) translateX(2px) rotate(0.3deg)' },
          '40%': { transform: 'translateY(-10px) translateX(4px) rotate(0.8deg)' },
          '60%': { transform: 'translateY(-8px) translateX(0px) rotate(0deg)' },
          '80%': { transform: 'translateY(-4px) translateX(-2px) rotate(-0.3deg)' },
        },
        waveBuoyancy3: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '30%': { transform: 'translateY(-4px) translateX(-2px) rotate(-0.4deg)' },
          '60%': { transform: 'translateY(-14px) translateX(2px) rotate(0.6deg)' },
          '90%': { transform: 'translateY(-2px) translateX(-1px) rotate(-0.2deg)' },
        },
        waveFloatLeft: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) translateX(8px) rotate(1deg)' },
          '66%': { transform: 'translateY(-8px) translateX(-4px) rotate(-0.5deg)' },
        },
        waveFloatRight: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) translateX(-6px) rotate(-0.8deg)' },
          '66%': { transform: 'translateY(-18px) translateX(3px) rotate(0.4deg)' },
        },
        waveFloatCenter: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) translateX(2px) rotate(0.3deg)' },
          '50%': { transform: 'translateY(-20px) translateX(0px) rotate(0deg)' },
          '75%': { transform: 'translateY(-15px) translateX(-2px) rotate(-0.3deg)' },
        },
        titleWave: {
          '0%, 100%': { transform: 'translateY(0px) scale(1) rotate(0deg)' },
          '16%': { transform: 'translateY(-3px) scale(1.005) rotate(0.1deg)' },
          '33%': { transform: 'translateY(-8px) scale(1.01) rotate(0.2deg)' },
          '50%': { transform: 'translateY(-12px) scale(1.015) rotate(0deg)' },
          '66%': { transform: 'translateY(-8px) scale(1.01) rotate(-0.2deg)' },
          '83%': { transform: 'translateY(-3px) scale(1.005) rotate(-0.1deg)' },
        },
        subtitleWave: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '20%': { transform: 'translateY(-4px) translateX(1px) rotate(0.1deg)' },
          '40%': { transform: 'translateY(-7px) translateX(2px) rotate(0.2deg)' },
          '60%': { transform: 'translateY(-10px) translateX(0px) rotate(0deg)' },
          '80%': { transform: 'translateY(-6px) translateX(-1px) rotate(-0.1deg)' },
        },
        glow: {
          'from': { filter: 'brightness(1) saturate(1)', textShadow: 'none' },
          'to': { filter: 'brightness(1.2) saturate(1.3)', textShadow: '0 0 8px oklch(from var(--color-primary) l c h / 0.5)' },
        },
      },
      // ⬇️ REVISED: Animation utilities linked to the keyframes above.
      animation: {
        // Your existing animations (preserved)
        aurora: 'aurora 60s linear infinite',
        "fade-in-down": "fade-in-down 0.5s ease-in-out",
        // Animations from globals.css, correctly configured
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'wave-buoyancy-1': 'waveBuoyancy1 4s ease-in-out infinite',
        'wave-buoyancy-2': 'waveBuoyancy2 4s ease-in-out infinite',
        'wave-buoyancy-3': 'waveBuoyancy3 4s ease-in-out infinite',
        'wave-float-left': 'waveFloatLeft 5s ease-in-out infinite',
        'wave-float-right': 'waveFloatRight 5s ease-in-out infinite',
        'wave-float-center': 'waveFloatCenter 4.5s ease-in-out infinite',
        'title-wave': 'titleWave 6s ease-in-out infinite',
        'subtitle-wave': 'subtitleWave 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      boxShadow: {
        // This is a much better way to define a glow that adapts to your theme
        'glow': '0 0 15px oklch(from var(--color-primary) l c h / 0.4), 0 0 30px oklch(from var(--color-primary) l c h / 0.1), 0 4px 16px oklch(from var(--color-foreground) l c h / 0.05)',
      }
    },
  },
  plugins: [],
};
export default config;
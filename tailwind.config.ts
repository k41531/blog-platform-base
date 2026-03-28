import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import markdownStyles from "./lib/shared/markdown-styles.json";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            fontSize: markdownStyles.base.fontSize,
            lineHeight: markdownStyles.base.lineHeight,
            h1: {
              ...markdownStyles.h1,
              marginTop: "1em",
              marginBottom: "0.25em",
            },
            h2: {
              ...markdownStyles.h2,
              marginTop: "1em",
              marginBottom: "0.25em",
            },
            h3: {
              ...markdownStyles.h3,
              marginTop: "1em",
              marginBottom: "0.25em",
            },
            h4: {
              ...markdownStyles.h4,
              marginTop: "1em",
              marginBottom: "0.25em",
            },
            "h5, h6": {
              ...markdownStyles.h5h6,
              marginTop: "1em",
              marginBottom: "0.25em",
            },
            p: {
              marginTop: "0.75em",
              marginBottom: "0.75em",
            },
            pre: {
              backgroundColor: "hsl(var(--muted))",
              color: "hsl(var(--foreground))",
              borderRadius: "6px",
              padding: "12px 16px",
              marginTop: "0.5em",
              marginBottom: "0.5em",
            },
            "pre code": {
              backgroundColor: "transparent",
              padding: "0",
              borderRadius: "0",
              fontSize: markdownStyles.inlineCode.fontSize,
              fontFamily: markdownStyles.inlineCode.fontFamily,
              color: "inherit",
            },
            code: {
              fontFamily: markdownStyles.inlineCode.fontFamily,
              fontSize: markdownStyles.inlineCode.fontSize,
              backgroundColor: "hsl(var(--muted))",
              borderRadius: markdownStyles.inlineCode.borderRadius,
              padding: markdownStyles.inlineCode.padding,
              fontWeight: "400",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            a: {
              color: "hsl(var(--primary))",
              textDecoration: "underline",
            },
            blockquote: {
              color: "hsl(var(--muted-foreground))",
              fontStyle: "italic",
              marginTop: "0.5em",
              marginBottom: "0.5em",
            },
            img: {
              maxWidth: "100%",
              borderRadius: "6px",
            },
            hr: {
              borderColor: "hsl(var(--border))",
              marginTop: "1em",
              marginBottom: "1em",
            },
            ul: {
              marginTop: "0.25em",
              marginBottom: "0.25em",
            },
            ol: {
              marginTop: "0.25em",
              marginBottom: "0.25em",
            },
            li: {
              marginTop: "0",
              marginBottom: "0",
            },
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
} satisfies Config;

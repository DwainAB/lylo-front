import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#996f56', letterSpacing: '0.1em' }}>
      LYLO — Docs
    </span>
  ),
  project: {
    link: 'https://github.com/your-org/lylo-front',
  },
  docsRepositoryBase: 'https://github.com/your-org/lylo-front/tree/main/docs',
  footer: {
    text: (
      <span>
        © {new Date().getFullYear()} Lylo — Le Studio des Parfums. Documentation technique.
      </span>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Lylo Documentation" />
      <meta property="og:description" content="Documentation technique du projet Lylo — AI Perfumery Platform" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s — Lylo Docs',
    }
  },
  primaryHue: 25,
  primarySaturation: 30,
  sidebar: {
    titleComponent({ title }) {
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
  },
}

export default config

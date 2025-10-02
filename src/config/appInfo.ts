/**
 * Application Information and Trademark Details
 * Contains software maker, version, and trademark information
 */

export interface AppInfo {
  name: string
  version: string
  description: string
  maker: {
    company: string
    website: string
    email: string
    trademark: string
  }
  copyright: {
    year: string
    holder: string
    notice: string
  }
  build: {
    version: string
    date: string
  }
}

export const APP_INFO: AppInfo = {
  name: 'Sistem Informasi Akademik',
  version: '1.0.0',
  description: 'Sistem Manajemen Sekolah Digital',

  maker: {
    company: 'Digital Innovation Labs',
    website: 'https://digitalinnovationlabs.com',
    email: 'info@digitalinnovationlabs.com',
    trademark: 'Digital Innovation Labs™'
  },

  copyright: {
    year: '2024',
    holder: 'Digital Innovation Labs',
    notice: '© 2024 Digital Innovation Labs. All rights reserved.'
  },

  build: {
    version: '1.0.0-stable',
    date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
  }
}

// Helper functions for common app info usage
export const getAppVersion = (): string => APP_INFO.version
export const getAppName = (): string => APP_INFO.name
export const getMakerTrademark = (): string => APP_INFO.maker.trademark
export const getCopyrightNotice = (): string => APP_INFO.copyright.notice
export const getFullAppInfo = (): string => `${APP_INFO.name} v${APP_INFO.version}`

// Export individual constants for easy access
export const {
  name: APP_NAME,
  version: APP_VERSION,
  description: APP_DESCRIPTION
} = APP_INFO

export const {
  company: MAKER_COMPANY,
  trademark: MAKER_TRADEMARK,
  website: MAKER_WEBSITE,
  email: MAKER_EMAIL
} = APP_INFO.maker

export const {
  year: COPYRIGHT_YEAR,
  holder: COPYRIGHT_HOLDER,
  notice: COPYRIGHT_NOTICE
} = APP_INFO.copyright
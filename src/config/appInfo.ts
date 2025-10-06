/**
 * ============================================================================
 * KONFIGURASI APLIKASI DAN IDENTITAS SEKOLAH
 * ============================================================================
 * 
 * File ini berisi konfigurasi untuk aplikasi dan data identitas sekolah.
 * PETUNJUK: Edit bagian KONFIGURASI di bawah sesuai dengan data sekolah Anda.
 */

// ============================================================================
// BAGIAN 1: KONFIGURASI SEKOLAH (SILAKAN EDIT SESUAI DATA SEKOLAH ANDA)
// ============================================================================

export const SCHOOL_CONFIG = {
  // ---------- PROFIL SEKOLAH (DATA DASAR + KONTAK) ----------
  profile: {
    name: 'MAS AL-HIDAYAT GINUK',                    // Nama lengkap sekolah
    level: 'SMP' as const,                           // Jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'UNIVERSITAS' | 'PESANTREN'
    npsn: '205820859',                                // Nomor Pokok Sekolah Nasional
    nss: '13123520012',                             // Nomor Statistik Sekolah
    address: {
      street: 'RT 02 - RW 02',
      village: 'Ginuk',
      district: 'Karas',
      city: 'Magetan',
      province: 'Jawa Timur',
      postalCode: '63393'
    },
    phone: '0888 xxx xxxx',
    email: 'masalhidayatginuk@gmail.com',
    website: 'https://alhidayat.my.id/'
  }
}

// ============================================================================
// BAGIAN 2: KONFIGURASI APLIKASI (SILAKAN EDIT SESUAI INFO APLIKASI ANDA)
// ============================================================================

export const APP_CONFIG = {
  name: 'Sistem Informasi Akademik - ArtaPay',
  version: '1.0.0',
  description: 'Sistem Manajemen Sekolah Digital',
  publisher: 'Aksiomatika VibeCod',
  supportEmail: 'arisidanto.mdn@gmail.com',
  website: 'https://aksiomatik.com',
  legalNotice: 'Copyright 2024 aksiomatik. All rights reserved.',
  releaseDate: new Date().toISOString().split('T')[0]
}

// ============================================================================
// BAGIAN 3: INTERFACES & TYPES (JANGAN UBAH BAGIAN INI)
// ============================================================================

export interface SchoolIdentity {
  profile: {
    name: string
    level: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'UNIVERSITAS' | 'PESANTREN'
    npsn: string
    nss: string
    address: {
      street: string
      village: string
      district: string
      city: string
      province: string
      postalCode: string
    }
    phone: string
    email: string
    website?: string
  }
}

export interface AppInfo {
  name: string
  version: string
  description: string
  publisher: string
  supportEmail: string
  website?: string
  legalNotice: string
  releaseDate: string
}

// ============================================================================
// BAGIAN 4: EXPORTS UTAMA (JANGAN UBAH BAGIAN INI)
// ============================================================================

export const SCHOOL_IDENTITY: SchoolIdentity = SCHOOL_CONFIG
export const APP_INFO: AppInfo = APP_CONFIG

// ============================================================================
// BAGIAN 5: HELPER FUNCTIONS - SCHOOL (JANGAN UBAH BAGIAN INI)
// ============================================================================

// Fungsi dasar untuk mendapatkan informasi sekolah
export const getSchoolName = (): string => SCHOOL_IDENTITY.profile.name
export const getSchoolLevel = (): string => SCHOOL_IDENTITY.profile.level
export const getSchoolNPSN = (): string => SCHOOL_IDENTITY.profile.npsn
export const getSchoolNSS = (): string => SCHOOL_IDENTITY.profile.nss

const formatSchoolAddress = (address: SchoolIdentity['profile']['address']): string => {
  const { street, village, district, city, province, postalCode } = address
  return [street, village, district, city, province, postalCode].filter(Boolean).join(', ')
}

export const getSchoolAddress = (): string => formatSchoolAddress(SCHOOL_IDENTITY.profile.address)
export const getSchoolPhone = (): string => SCHOOL_IDENTITY.profile.phone
export const getSchoolEmail = (): string => SCHOOL_IDENTITY.profile.email
export const getSchoolWebsite = (): string => SCHOOL_IDENTITY.profile.website || ''

// Fungsi format untuk informasi sekolah
export const getSchoolFullTitle = (): string => `${SCHOOL_IDENTITY.profile.name} (${SCHOOL_IDENTITY.profile.level})`
export const getSchoolContactInfo = (): string => {
  const { address, phone, email } = SCHOOL_IDENTITY.profile
  return `${formatSchoolAddress(address)} | Tel: ${phone} | Email: ${email}`
}

// Fungsi untuk mendapatkan konfigurasi dari environment variables
export const getSchoolIdentityForEnv = (): SchoolIdentity => {
  const envName = import.meta.env.VITE_SCHOOL_NAME
  const envAddress = import.meta.env.VITE_SCHOOL_ADDRESS
  const envPhone = import.meta.env.VITE_SCHOOL_PHONE
  const envEmail = import.meta.env.VITE_SCHOOL_EMAIL

  if (envName || envAddress || envPhone || envEmail) {
    return {
      ...SCHOOL_IDENTITY,
      profile: {
        ...SCHOOL_IDENTITY.profile,
        name: envName || SCHOOL_IDENTITY.profile.name,
        address: {
          ...SCHOOL_IDENTITY.profile.address,
          street: envAddress || SCHOOL_IDENTITY.profile.address.street,
        },
        phone: envPhone || SCHOOL_IDENTITY.profile.phone,
        email: envEmail || SCHOOL_IDENTITY.profile.email,
      }
    }
  }
  return SCHOOL_IDENTITY
}

// ============================================================================
// BAGIAN 6: HELPER FUNCTIONS - APP (JANGAN UBAH BAGIAN INI)
// ============================================================================

export const getAppName = (): string => APP_INFO.name
export const getAppVersion = (): string => APP_INFO.version
export const getAppDescription = (): string => APP_INFO.description
export const getAppPublisher = (): string => APP_INFO.publisher
export const getAppSupportEmail = (): string => APP_INFO.supportEmail
export const getAppWebsite = (): string => APP_INFO.website || ''
export const getAppLegalNotice = (): string => APP_INFO.legalNotice
export const getAppReleaseDate = (): string => APP_INFO.releaseDate
export const getFullAppInfo = (): string => `${APP_INFO.name} v${APP_INFO.version}`

// ============================================================================
// BAGIAN 7: CONSTANTS EXPORTS (JANGAN UBAH BAGIAN INI)
// ============================================================================

// School constants - Profile
export const {
  name: SCHOOL_NAME,
  level: SCHOOL_LEVEL,
  npsn: SCHOOL_NPSN,
  nss: SCHOOL_NSS,
  address: SCHOOL_ADDRESS,
  phone: SCHOOL_PHONE,
  email: SCHOOL_EMAIL,
  website: SCHOOL_WEBSITE
} = SCHOOL_IDENTITY.profile

// App constants
export const {
  name: APP_NAME,
  version: APP_VERSION,
  description: APP_DESCRIPTION,
  publisher: APP_PUBLISHER,
  supportEmail: APP_SUPPORT_EMAIL,
  website: APP_WEBSITE,
  legalNotice: APP_LEGAL_NOTICE,
  releaseDate: APP_RELEASE_DATE
} = APP_INFO


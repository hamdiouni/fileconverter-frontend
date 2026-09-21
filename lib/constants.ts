export const CONVERSION_CATEGORIES = [
  {
    id: 'documents',
    name: 'Documents',
    count: 230,
    icon: 'FileText',
    description: 'Word, PDF, TXT, HTML, and more',
    subcategories: [
      {
        name: 'Word Documents',
        formats: ['DOC', 'DOCX', 'RTF', 'TXT']
      },
      {
        name: 'PDF & HTML',
        formats: ['PDF', 'HTML', 'MD']
      },
      {
        name: 'Open Formats',
        formats: ['ODT', 'ODTX']
      }
    ]
  },
  {
    id: 'images',
    name: 'Images',
    count: 515,
    icon: 'Image',
    description: 'JPG, PNG, SVG, WEBP, and more',
    subcategories: [
      {
        name: 'Raster',
        formats: ['JPG', 'PNG', 'GIF', 'WEBP', 'TIFF']
      },
      {
        name: 'Vector',
        formats: ['SVG', 'EPS', 'AI', 'CDR']
      },
      {
        name: 'Raw Formats',
        formats: ['RAW', 'CR2', 'NEF', 'ARW']
      }
    ]
  },
  {
    id: 'audio',
    name: 'Audio',
    count: 137,
    icon: 'Music',
    description: 'MP3, WAV, FLAC, OGG, and more',
    subcategories: [
      {
        name: 'Compressed',
        formats: ['MP3', 'AAC', 'OGG', 'M4A']
      },
      {
        name: 'Uncompressed',
        formats: ['WAV', 'FLAC', 'AIFF']
      },
      {
        name: 'Professional',
        formats: ['WMA', 'AC3', 'FLAC']
      }
    ]
  },
  {
    id: 'video',
    name: 'Video',
    count: 417,
    icon: 'Video',
    description: 'MP4, AVI, MOV, WEBM, and more',
    subcategories: [
      {
        name: 'Common',
        formats: ['MP4', 'AVI', 'MKV', 'MOV']
      },
      {
        name: 'Web',
        formats: ['WEBM', '3GP', 'FLV']
      },
      {
        name: 'Professional',
        formats: ['WMV', 'MPEG', 'TS']
      }
    ]
  },
  {
    id: 'archives',
    name: 'Archives',
    count: 222,
    icon: 'Archive',
    description: 'ZIP, RAR, 7Z, TAR, and more',
    subcategories: [
      {
        name: 'Compression',
        formats: ['ZIP', 'RAR', '7Z', 'TAR']
      },
      {
        name: 'Disk Images',
        formats: ['ISO', 'DMG', 'IMG']
      },
      {
        name: 'Packages',
        formats: ['DEB', 'RPM', 'CAB']
      }
    ]
  },
  {
    id: 'ebooks',
    name: 'Ebooks',
    count: 189,
    icon: 'Book',
    description: 'EPUB, MOBI, PDF, AZW, and more',
    subcategories: [
      {
        name: 'Open',
        formats: ['EPUB', 'MOBI', 'PDF']
      },
      {
        name: 'Kindle',
        formats: ['AZW', 'AZW3', 'AZW4']
      },
      {
        name: 'Legacy',
        formats: ['LRF', 'PDB', 'LIT']
      }
    ]
  },
  {
    id: 'presentations',
    name: 'Presentations',
    count: 96,
    icon: 'Presentation',
    description: 'PPT, KEY, ODP, and more',
    subcategories: [
      {
        name: 'Microsoft',
        formats: ['PPT', 'PPTX']
      },
      {
        name: 'Apple',
        formats: ['KEY']
      },
      {
        name: 'Open',
        formats: ['ODP', 'DPS']
      }
    ]
  },
  {
    id: 'spreadsheets',
    name: 'Spreadsheets',
    count: 55,
    icon: 'Table',
    description: 'XLS, CSV, NUMBERS, and more',
    subcategories: [
      {
        name: 'Microsoft',
        formats: ['XLS', 'XLSX']
      },
      {
        name: 'Apple',
        formats: ['NUMBERS']
      },
      {
        name: 'Open',
        formats: ['ODS', 'CSV']
      }
    ]
  },
  {
    id: 'vector',
    name: 'Vector',
    count: 112,
    icon: 'PenTool',
    description: 'SVG, AI, EPS, CDR, and more',
    subcategories: [
      {
        name: 'Web',
        formats: ['SVG', 'SVGZ']
      },
      {
        name: 'Print',
        formats: ['EPS', 'AI', 'PDF']
      },
      {
        name: 'Design',
        formats: ['CDR', 'WMF', 'EMF']
      }
    ]
  },
  {
    id: 'cad',
    name: 'CAD Files',
    count: 23,
    icon: 'Compass',
    description: 'DWG, DXF, PDF export, and more',
    subcategories: [
      {
        name: 'AutoCAD',
        formats: ['DWG', 'DXF']
      },
      {
        name: 'Export',
        formats: ['PDF', 'SVG', 'PNG']
      }
    ]
  },
  {
    id: 'fonts',
    name: 'Fonts',
    count: 25,
    icon: 'Type',
    description: 'TTF, WOFF, OTF, and more',
    subcategories: [
      {
        name: 'Web',
        formats: ['WOFF', 'WOFF2', 'EOT']
      },
      {
        name: 'Desktop',
        formats: ['TTF', 'OTF']
      }
    ]
  }
];

export const FEATURES = [
  {
    title: '2000+ Conversion Types',
    description: 'Comprehensive format support across all major file categories with enterprise-grade conversion quality.',
    icon: 'Zap'
  },
  {
    title: 'Developer-First API',
    description: 'RESTful APIs with comprehensive SDKs, webhooks, and detailed documentation for seamless integration.',
    icon: 'Code'
  },
  {
    title: 'Enterprise Security',
    description: 'SOC 2 Type II & ISO 27001 compliant infrastructure with end-to-end encryption and data protection.',
    icon: 'Shield'
  },
  {
    title: 'Global Performance',
    description: 'Sub-second response times with globally distributed CDN and intelligent load balancing.',
    icon: 'Globe'
  },
  {
    title: 'Batch Processing',
    description: 'Convert multiple files simultaneously with queue management and progress tracking capabilities.',
    icon: 'Layers'
  },
  {
    title: 'White-Label Solutions',
    description: 'Complete customization options with branded interfaces and domain integration for enterprises.',
    icon: 'Palette'
  }
];

export const TESTIMONIALS = [
  {
    quote: "FileConverter Pro has transformed our document workflow. The API integration was seamless and the conversion quality is outstanding.",
    author: "Sarah Chen",
    title: "CTO, TechFlow Solutions",
    company: "TechFlow"
  },
  {
    quote: "We process millions of files monthly through their platform. The reliability and speed are exactly what we needed for our enterprise applications.",
    author: "Michael Rodriguez",
    title: "Lead Developer, DataSync Corp",
    company: "DataSync"
  },
  {
    quote: "The comprehensive format support and developer-friendly APIs made FileConverter Pro our go-to solution for all conversion needs.",
    author: "Emily Watson",
    title: "Product Manager, CloudDocs",
    company: "CloudDocs"
  }
];
import fs from 'node:fs/promises'
import path from 'node:path'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

function getR2Config() {
  const isConfigured = !!(
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ENDPOINT &&
    process.env.R2_BUCKET_NAME
  )
  if (!isConfigured) return null
  
  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
  return { client, bucketName: process.env.R2_BUCKET_NAME! }
}

async function deleteFromR2(url?: string): Promise<void> {
  const r2 = getR2Config()
  if (!url || !r2) return
  try {
    let key = ''
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url)
      key = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname
    } else {
      key = url
    }
    
    if (!key || key.startsWith('database/')) {
      return
    }

    await r2.client.send(
      new DeleteObjectCommand({
        Bucket: r2.bucketName,
        Key: key,
      })
    )
    console.log(`🗑️ Successfully deleted object from R2: ${key}`)
  } catch (err) {
    console.error('Failed to delete object from R2:', err)
  }
}

export interface GalleryItem {
  id: string
  title: string
  category: "road" | "trail" | "brand" | "action"
  location: string
  specs: string
  image_url: string
  gradient: string
  description: string
  year: string
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: "race-report" | "gear" | "behind-the-lens"
  categoryLabel: string
  gradient: string
  author: string
  leadParagraph: string
  bodyContent: {
    heading?: string
    paragraphs: string[]
    pullQuote?: string
  }[]
  technicalNotes: {
    camera: string
    lens: string
    exposure: string
    settingReason: string
  }
  created_at: string
  puck_data?: any
  image_url?: string
}

export interface RaceEventGalleryItem {
  id: number
  title: string
  category: "start" | "grit" | "finish" | "details"
  specs: string
  gradient: string
  description: string
  image_url?: string
}

export interface RaceEvent {
  id: string
  slug: string
  title: string
  location: string
  date: string
  type: "marathon" | "trail" | "cycling"
  runners: string
  gradient: string
  desc: string
  highlight: string
  weather: string
  gearUsed: string
  intro: string
  technicalLog: string
  gallery: RaceEventGalleryItem[]
  created_at: string
  puck_data?: any
  image_url?: string
  featured_in_navbar?: boolean
  featured_on_homepage?: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  topic: string
  type: string
  eventDetails?: string
  date?: string
  runners?: string
  created_at: string
}

export interface HeroSettings {
  background_type: "aurora" | "image_carousel" | "video_carousel"
  media_urls: string[]
  badge: string
  title_line_1: string
  title_line_2: string
  title_line_3: string
  description: string
  spec_1_label: string
  spec_1_value: string
  spec_2_label: string
  spec_2_value: string
  spec_3_label: string
  spec_3_value: string
}

export interface SavedDesign {
  id: string
  type: string // "homepage" | "blog" | "event"
  name: string
  content: any
  created_at: string
}

export interface CapabilityStat {
  value: string
  label: string
}

export interface CapabilityItem {
  num: string
  title: string
  desc: string
  bg_image_url?: string
}

export interface CapabilitiesSettings {
  badge: string
  title: string
  description: string
  stats: CapabilityStat[]
  items: CapabilityItem[]
}

export interface OperationalCard {
  title: string
  desc: string
  image_url?: string
}

export interface GearItem {
  name: string
  desc: string
}

export interface GearCategory {
  category: string
  items: GearItem[]
}

export interface AboutSettings {
  badge: string
  title: string
  description: string
  cards: OperationalCard[]
  gear_badge?: string
  gear_title?: string
  gear_description?: string
  gear_categories?: GearCategory[]
}

export interface DbSchema {
  gallery: GalleryItem[]
  blogs: BlogPost[]
  events: RaceEvent[]
  messages: ContactMessage[]
  hero_settings: HeroSettings
  capabilities_settings?: CapabilitiesSettings
  about_settings?: AboutSettings
  homepage_puck_data?: any
  templates?: Record<string, any>
  saved_designs?: SavedDesign[]
}

const dataDir = path.join(process.cwd(), '.data')
const filePath = path.join(dataDir, 'db.json')

// Helper seed data
const defaultGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Apex Stride",
    category: "road",
    location: "Berlin Marathon",
    specs: "85mm • f/2.0 • 1/2000s • ISO 100",
    image_url: "",
    gradient: "from-blue-900/60 to-slate-900",
    description: "An elite runner's foot strike capturing the exact moment of energy release on tarmac.",
    year: "2025",
    created_at: new Date().toISOString()
  },
  {
    id: "gal-2",
    title: "Summit Ridge Line",
    category: "trail",
    location: "UTMB Chamonix",
    specs: "400mm • f/2.8 • 1/1600s • ISO 200",
    image_url: "",
    gradient: "from-teal-900/60 to-slate-900",
    description: "Endurance athletes dwarfed by the massive granite spikes of the French Alps under high-contrast noon light.",
    year: "2025",
    created_at: new Date().toISOString()
  },
  {
    id: "gal-3",
    title: "Velocity Branding",
    category: "brand",
    location: "Zenith Footwear Campaign",
    specs: "50mm • f/1.4 • 1/4000s • ISO 50",
    image_url: "",
    gradient: "from-teal-900/60 to-slate-900",
    description: "Commercial campaign detailing shoe mechanics, mud sprays, and brand logo placement in active trail conditions.",
    year: "2026",
    created_at: new Date().toISOString()
  },
  {
    id: "gal-4",
    title: "Heartbreak Peak",
    category: "action",
    location: "Boston Marathon",
    specs: "135mm • f/1.8 • 1/1600s • ISO 100",
    image_url: "",
    gradient: "from-rose-900/60 to-slate-900",
    description: "Close-up portrait of extreme grit and sweat during the final incline pushes near Mile 21.",
    year: "2026",
    created_at: new Date().toISOString()
  }
]

const defaultBlogs: BlogPost[] = [
  {
    id: "blog-1",
    slug: "chasing-the-global-shutter-sony-a9-iii",
    title: "Chasing the Global Shutter: Sony A9 III Race Review",
    excerpt: "Why the global shutter change is a game-changer for track and trail sports. Analyzing stride freeze, zero rolling distortion, and real-world sync speed.",
    date: "May 12, 2026",
    readTime: "6 min read",
    category: "gear",
    categoryLabel: "Gear Review",
    gradient: "from-teal-900 via-cyan-950 to-zinc-900",
    author: "Shahine",
    leadParagraph: "The transition from traditional rolling shutters to a global shutter is the most significant technological leap in sports photography in a generation. In race conditions, where runners are moving at high velocities and camera pans are rapid, the global shutter completely changes the game.",
    bodyContent: [
      {
        heading: "Eliminating the Rolling Shutter Jello Effect",
        paragraphs: [
          "With traditional focal plane rolling shutters, the sensor reads data line-by-line. This speed differential results in bending or warping when fast-moving objects cross the frame. In marathon sports, rolling shutters can cause runner strides to appear distorted, and background sponsor banners to slant during rapid camera pans.",
          "The Sony A9 III's global shutter reads all 24.6 megapixels simultaneously. When shooting a leading pack sprinting past a crowded bridge at 1/2000s, every leg angle, shoelace, and background sponsor banner is captured without warping. Every line is straight, and the biomechanics are preserved with anatomical precision."
        ],
        pullQuote: "In elite race photography, precision is not a choice. A warped stride makes an action shot useless for medical analysis or brand publications."
      },
      {
        heading: "120 Frames-Per-Second Speed & Pre-Capture",
        paragraphs: [
          "Another breakthrough of the global shutter sensor is the raw data throughput. The ability to lock focus and track exposure while blasting 120 RAW files per second ensures that you never miss the exact millisecond of shoe strike or finish-tape impact.",
          "By utilizing the camera's Pre-Capture buffer, we can half-press the shutter button, and the camera starts recording frames. The moment the runner breaks the ribbon, we press the shutter fully, and the preceding 1 second is already saved, guaranteeing zero-failure delivery on the critical finish line moment."
        ]
      }
    ],
    technicalNotes: {
      camera: "Sony Alpha 9 III",
      lens: "Sony FE 70-200mm f/2.8 GM II",
      exposure: "1/2000s • f/2.8 • ISO 160",
      settingReason: "Global shutter allows shutter speed sync up to 1/80,000s. We selected 1/2000s to freeze runner strides while maintaining low ISO grain."
    },
    created_at: new Date().toISOString()
  },
  {
    id: "blog-2",
    slug: "capturing-utmb-climbing-10000m-with-lenses",
    title: "Capturing UTMB: Climbing 10,000m with 15kg of Lenses",
    excerpt: "Behind the scenes of mountain ultra-marathon photography. Managing battery freeze, night tracking on ridges, and lightweight carbon operations.",
    date: "April 28, 2026",
    readTime: "12 min read",
    category: "race-report",
    categoryLabel: "Race Report",
    gradient: "from-teal-900/40 via-cyan-950 to-slate-900",
    author: "Shahine",
    leadParagraph: "Covering the Ultra-Trail du Mont-Blanc (UTMB) requires as much physical conditioning as it does technical camera capability. Hicking steep mountain passes in Chamonix to capture the world's most elite ultra runners is a test of weight management and weather endurance.",
    bodyContent: [
      {
        heading: "Lightweight Rig Configurations",
        paragraphs: [
          "When you are hiking up to Col du Bonhomme at 2,300 meters, every ounce in your backpack counts. We designed custom carbon-fiber harnesses to carry two bodies safely on the chest while packing lightweight carbon tripods and secondary battery packs.",
          "Our lenses are carefully selected for maximum focal range flexibility. The Sony 400mm f/2.8 prime is used for compressing trail ridges from distance, while the 24-70mm f/2.8 GM II stays on the body for wide-angle environmental portraits as athletes scale rocky passages."
        ],
        pullQuote: "Mountain photography is a balancing act between pack weight and the creative choices made possible by long telephoto lenses."
      },
      {
        heading: "Handling the Alpine Cold",
        paragraphs: [
          "As night temperatures drop below freezing, camera batteries lose charge efficiency. We store backup Lithium-ion packs in insulated internal thermal sleeves against our bodies to keep them warm.",
          "Lens condensation is another major threat. Transitioning from cold mountain summits to humid valley bases requires double-sealed weather protection to prevent optical fogging."
        ]
      }
    ],
    technicalNotes: {
      camera: "Sony Alpha 1",
      lens: "Sony FE 400mm f/2.8 GM OSS",
      exposure: "1/1600s • f/2.8 • ISO 200",
      settingReason: "Telephoto compression allows framing the runner directly against the massive alpine peaks from a distance of over 300 meters."
    },
    created_at: new Date().toISOString()
  }
]

const defaultEvents: RaceEvent[] = [
  {
    id: "evt-1",
    slug: "boston-marathon",
    title: "Boston Marathon",
    location: "Boston, USA",
    date: "April 2026",
    type: "marathon",
    runners: "30,000+ Runners",
    gradient: "from-orange-950 via-amber-950 to-zinc-900",
    desc: "Elite road coverage focusing on key mile marks, historic pacing, and high-tension emotional finishes near Copley Square.",
    highlight: "Finish line stagers & heartbreaks",
    weather: "Cool, 12°C, Overcast",
    gearUsed: "Sony A9 III + 70-200mm f/2.8 GM II",
    intro: "The Boston Marathon demands capturing raw energy over a long point-to-point course. From the nervous excitement of Hopkinton to the grueling elevation changes of Heartbreak Hill and the crowded tears near Copley Square.",
    technicalLog: "For this race, the high-speed global shutter of the Sony A9 III was crucial to capture runner stride mechanics without rolling shutter distortions. The 70-200mm GM II lens was used for isolating runners against compressed street backgrounds while preserving sponsor banner clarity.",
    gallery: [
      { id: 101, title: "The Preamble", category: "start", specs: "70mm • f/2.8 • 1/500s", gradient: "from-amber-900/60 to-zinc-900", description: "Corral packing in Hopkinton as final gear adjustments are made in the cool morning air.", image_url: "" },
      { id: 102, title: "Heartbreak Climb", category: "grit", specs: "200mm • f/2.8 • 1/1600s", gradient: "from-orange-900/60 to-zinc-900", description: "Mid-race grit as runners battle the infamous incline, faces etched with effort.", image_url: "" },
      { id: 103, title: "Boylston Scream", category: "finish", specs: "135mm • f/2.0 • 1/2000s", gradient: "from-red-900/60 to-zinc-900", description: "Finisher crossing the line with arms raised in victory, crowd out of focus in the background.", image_url: "" },
      { id: 104, title: "Medals of honor", category: "details", specs: "50mm Macro • f/3.2 • 1/500s", gradient: "from-stone-900/60 to-zinc-900", description: "Finisher medals gleaming on the blue ribbons, stacked near the finish line tents.", image_url: "" }
    ],
    created_at: new Date().toISOString(),
    image_url: ""
  },
  {
    id: "evt-2",
    slug: "utmb-mont-blanc",
    title: "UTMB Mont Blanc",
    location: "Chamonix, France",
    date: "August 2025",
    type: "trail",
    runners: "10,000+ Runners",
    gradient: "from-teal-950 via-zinc-950 to-zinc-900",
    desc: "Physically demanding trail documentation covering remote ridges, alpine night stretches, and extreme altitude weather conditions.",
    highlight: "Ridge running & sub-zero mountain pass shots",
    weather: "Alpine shifts, -2°C to 18°C",
    gearUsed: "Sony A1 + 400mm f/2.8 GM + 24-70mm GM II",
    intro: "UTMB is the pinnacle of trail running. It is a 170km loop around Mont Blanc with 10,000 meters of elevation change. Capturing this event requires scaling mountains to catch athletes battling night cold, steep peaks, and sunrise crossings.",
    technicalLog: "We packed lightweight weatherized carbon rigs to hike to remote alpine passes. The Sony Alpha 1's 50MP sensor allowed cropping into wide mountain panoramas to isolate runners on high ridge paths under variable morning lighting.",
    gallery: [
      { id: 201, title: "The Arc Lights", category: "start", specs: "24mm • f/2.8 • 1/120s", gradient: "from-teal-950/60 to-zinc-900", description: "Chamonix town center glows under floodlights as thousands of headlamps await the UTMB start signal.", image_url: "" },
      { id: 202, title: "Col du Bonhomme Pass", category: "grit", specs: "400mm • f/2.8 • 1/1200s", gradient: "from-blue-900/60 to-zinc-900", description: "Runners scale the snowy alpine pass at 2,300m, Materhorn silhouettes visible in distant mist.", image_url: "" },
      { id: 203, title: "Finisher Cheers", category: "finish", specs: "85mm • f/1.4 • 1/800s", gradient: "from-teal-900/60 to-zinc-900", description: "Finisher embraced by family in Chamonix plaza, bell towers ringing in background.", image_url: "" },
      { id: 204, title: "Frozen Hydration", category: "details", specs: "90mm Macro • f/4.0 • 1/1000s", gradient: "from-sky-950/60 to-zinc-900", description: "Frozen ice particles forming on an athlete's collapsible hydration flask.", image_url: "" }
    ],
    created_at: new Date().toISOString(),
    image_url: ""
  }
]

const defaultHeroSettings: HeroSettings = {
  background_type: "aurora",
  media_urls: [],
  badge: "SPORTS PHOTOGRAPHY REDEFINED",
  title_line_1: "CAPTURE",
  title_line_2: "THE GRIT",
  title_line_3: "ON THE COURSE",
  description: "Translating the raw victory, sweat, and split-second milestones of marathon and trail running events into high-performance visual assets for race organizers and global athletics brands.",
  spec_1_label: "SHUTTER",
  spec_1_value: "1/2000S",
  spec_2_label: "RESOLUTION",
  spec_2_value: "50.1MP",
  spec_3_label: "PIPELINE",
  spec_3_value: "FTPS LIVE"
}

const defaultCapabilitiesSettings: CapabilitiesSettings = {
  badge: "CORE CAPABILITY",
  title: "Engineered for zero-failure delivery.",
  description: "In elite endurance events, missed frames are not an option. Our field setups carry weatherproof enclosures, carbon-fiber rigs, and secondary cellular nodes to guarantee instantaneous PR deliveries.",
  stats: [
    { value: "120+", label: "Races Covered" },
    { value: "80,000+", label: "Runners Captured" },
    { value: "15+", label: "International Brands" },
    { value: "12h", label: "Media Delivery Time" }
  ],
  items: [
    {
      num: "01",
      title: "Marathons & Road Races",
      desc: "Start lines, pack dynamics, elite pacing, and high-emotion finish arches. Engineered for race organizers needing quick media turnarounds.",
      bg_image_url: ""
    },
    {
      num: "02",
      title: "Trail & Ultra Running",
      desc: "Backcountry endurance events, steep vertical accents, and remote aid stations. Physically capable of covering remote trail points.",
      bg_image_url: ""
    },
    {
      num: "03",
      title: "Athletic Brand Campaigns",
      desc: "Commercial-grade shots focused on footwear, apparel, and sponsor placements. Highlighting brand logos in live, unscripted race contexts.",
      bg_image_url: ""
    },
    {
      num: "04",
      title: "Looking for Custom Rates?",
      desc: "Custom media structures configured specifically to client runner counts and commercial logo deliveries.",
      bg_image_url: ""
    }
  ]
}

const defaultAboutSettings: AboutSettings = {
  badge: "The Photographer",
  title: "Behind the Lens: Shahine",
  description: "I document the boundary points of athletic capability. Having run trail ultra-marathons myself, I understand where the mental barriers break, where sponsors' logos get maximum exposure, and how to stay ahead of the pack to capture stories that convert.",
  cards: [
    {
      title: "Zero-Failure Protocol",
      desc: "Race events have zero room for error. We run dual CFexpress slots for instant write backups, carry fully redundant weather-sealed bodies, and operate back-up batteries tested to sub-zero temperatures.",
      image_url: ""
    },
    {
      title: "Real-Time Media Pipeline",
      desc: "Using built-in FTPS cameras and localized cellular-satellite nodes, we transmit high-res elite selection files directly from the course to your PR team's inbox while the race is still running.",
      image_url: ""
    },
    {
      title: "Sponsor-Centric Eye",
      desc: "We design our compositions to frame the athlete's peak emotion alongside clearly readable race branding, bib sponsor logos, and partner banner visibility.",
      image_url: ""
    }
  ],
  gear_badge: "The Equipment",
  gear_title: "Professional Toolkit",
  gear_description: "High-shutter speed cameras, ultra-bright lenses, and rugged field gear. Here is the technical foundation that ensures crisp, sharp details under any lighting and weather conditions.",
  gear_categories: [
    {
      category: "Camera Bodies",
      items: [
        { name: "Sony Alpha 9 III", desc: "Global shutter sensor, 120 fps burst shooting, zero rolling shutter distortion for fast-moving runners." },
        { name: "Sony Alpha 1", desc: "50.1 MP resolution, 30 fps, dual processors. Used for ultra-high-res marketing prints and branding campaigns." }
      ]
    },
    {
      category: "Lenses",
      items: [
        { name: "Sony FE 70-200mm f/2.8 GM OSS II", desc: "Industry-standard sports lens. Pin-sharp focus tracking, excellent background separation." },
        { name: "Sony FE 400mm f/2.8 GM OSS", desc: "Super-telephoto lens for compressing perspective and isolating runners on trail ridges from distance." },
        { name: "Sony FE 24-70mm f/2.8 GM II", desc: "Standard zoom for wide-angle start line crowds and atmospheric race atmosphere." }
      ]
    },
    {
      category: "Field Operations & Backup",
      items: [
        { name: "Dual-Slot Redundancy", desc: "Every photo is written to two CFexpress cards simultaneously to guarantee zero data loss." },
        { name: "Mobile Satellite Upload", desc: "Real-time on-course uploads via satellite hotspots for instantaneous social media turnarounds." },
        { name: "Weatherproof Enclosures", desc: "All bodies and lenses are double-sealed against dust, mountain rain, and coastal spray." }
      ]
    }
  ]
}

const defaultDb: DbSchema = {
  gallery: defaultGallery,
  blogs: defaultBlogs,
  events: defaultEvents,
  messages: [],
  hero_settings: defaultHeroSettings,
  capabilities_settings: defaultCapabilitiesSettings,
  about_settings: defaultAboutSettings,
  saved_designs: []
}

let isInit = false
let cachedDb: DbSchema | null = null
let lastFetchedTime = 0
const CACHE_TTL = 5000 // 5 seconds in-memory caching to avoid multiple parallel R2 reads

async function initDb(): Promise<void> {
  if (isInit) return
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultDb, null, 2), 'utf8')
  }
  isInit = true
}

export async function readDb(): Promise<DbSchema> {
  const now = Date.now()
  if (cachedDb && (now - lastFetchedTime < CACHE_TTL)) {
    return cachedDb
  }

  const r2 = getR2Config()
  if (r2) {
    const bucketName = r2.bucketName
    const key = 'database/db.json'
    try {
      const response = await r2.client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      )
      const raw = await response.Body?.transformToString()
      if (raw) {
        cachedDb = JSON.parse(raw) as DbSchema
        lastFetchedTime = now
        console.log('✅ Loaded database from Cloudflare R2')
        return cachedDb!
      }
    } catch (err: any) {
      const isNotFound = err.name === 'NoSuchKey' || err.code === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404
      if (isNotFound) {
        console.log('⚠️ Database file not found in Cloudflare R2. Checking for migration...')
        let initialData = defaultDb
        try {
          await initDb()
          const rawLocal = await fs.readFile(filePath, 'utf8')
          initialData = JSON.parse(rawLocal) as DbSchema
          console.log('🚀 Found local database file. Migrating to Cloudflare R2...')
        } catch {
          console.log('No local database file found. Seeding default data to R2...')
        }
        await writeDb(initialData)
        cachedDb = initialData
        lastFetchedTime = now
        return initialData
      }
      console.error('Failed to read database from R2, falling back to local file:', err)
    }
  }

  // Fallback to local filesystem
  await initDb()
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    cachedDb = JSON.parse(raw) as DbSchema
    lastFetchedTime = now
    return cachedDb!
  } catch (error) {
    console.error('Failed to read local database:', error)
    return defaultDb
  }
}

export async function writeDb(data: DbSchema): Promise<void> {
  cachedDb = data
  lastFetchedTime = Date.now()

  const r2 = getR2Config()
  if (r2) {
    const bucketName = r2.bucketName
    const key = 'database/db.json'
    try {
      const body = JSON.stringify(data, null, 2)
      await r2.client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: body,
          ContentType: 'application/json',
        })
      )
      console.log('✅ Database written to Cloudflare R2 storage')
      return
    } catch (err) {
      console.error('Failed to write database to R2, writing locally instead:', err)
    }
  }

  // Fallback to local filesystem
  await initDb()
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
    console.log('✅ Database written to local filesystem')
  } catch (error) {
    console.error('Failed to write local database:', error)
  }
}

// ============================================
// GALLERY CRUD METHODS
// ============================================
export async function getGalleryItems(): Promise<GalleryItem[]> {
  const db = await readDb()
  return db.gallery || []
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  const db = await readDb()
  const idx = db.gallery.findIndex(g => g.id === item.id)
  if (idx !== -1) {
    db.gallery[idx] = { ...db.gallery[idx], ...item }
  } else {
    db.gallery.push(item)
  }
  await writeDb(db)
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const db = await readDb()
  const item = db.gallery.find(g => g.id === id)
  if (item && item.image_url) {
    await deleteFromR2(item.image_url)
  }
  db.gallery = db.gallery.filter(g => g.id !== id)
  await writeDb(db)
}

// ============================================
// BLOG CRUD METHODS
// ============================================
export async function getBlogPosts(): Promise<BlogPost[]> {
  const db = await readDb()
  return db.blogs || []
}

export async function saveBlogPost(post: BlogPost): Promise<void> {
  const db = await readDb()
  const idx = db.blogs.findIndex(b => b.id === post.id || b.slug === post.slug)
  if (idx !== -1) {
    db.blogs[idx] = { ...db.blogs[idx], ...post }
  } else {
    db.blogs.push(post)
  }
  await writeDb(db)
}

export async function deleteBlogPost(id: string): Promise<void> {
  const db = await readDb()
  const post = db.blogs.find(b => b.id === id)
  if (post && post.image_url) {
    await deleteFromR2(post.image_url)
  }
  db.blogs = db.blogs.filter(b => b.id !== id)
  await writeDb(db)
}

// ============================================
// EVENTS CRUD METHODS
// ============================================
export async function getEvents(): Promise<RaceEvent[]> {
  const db = await readDb()
  return db.events || []
}

export async function saveEvent(event: RaceEvent): Promise<void> {
  const db = await readDb()
  const idx = db.events.findIndex(e => e.id === event.id || e.slug === event.slug)
  if (idx !== -1) {
    db.events[idx] = { ...db.events[idx], ...event }
  } else {
    db.events.push(event)
  }
  await writeDb(db)
}

export async function deleteEvent(id: string): Promise<void> {
  const db = await readDb()
  const event = db.events.find(e => e.id === id)
  if (event) {
    if (event.image_url) {
      await deleteFromR2(event.image_url)
    }
    if (event.gallery) {
      for (const item of event.gallery) {
        if (item.image_url) {
          await deleteFromR2(item.image_url)
        }
      }
    }
  }
  db.events = db.events.filter(e => e.id !== id)
  await writeDb(db)
}

// ============================================
// CONTACT INQUIRIES CRUD
// ============================================
export async function getMessages(): Promise<ContactMessage[]> {
  const db = await readDb()
  return db.messages || []
}

export async function addMessage(message: ContactMessage): Promise<void> {
  const db = await readDb()
  if (!db.messages) db.messages = []
  db.messages.push(message)
  await writeDb(db)
}

export async function deleteMessage(id: string): Promise<void> {
  const db = await readDb()
  db.messages = db.messages.filter(m => m.id !== id)
  await writeDb(db)
}

// ============================================
// HERO SETTINGS METHODS
// ============================================
export async function getHeroSettings(): Promise<HeroSettings> {
  const db = await readDb()
  return db.hero_settings || defaultHeroSettings
}

export async function saveHeroSettings(settings: HeroSettings): Promise<void> {
  const db = await readDb()
  db.hero_settings = settings
  await writeDb(db)
}

// ============================================
// MASTER TEMPLATES METHODS
// ============================================
export async function getTemplate(id: string): Promise<any> {
  const db = await readDb()
  if (!db.templates) return null
  return db.templates[id] || null
}

export async function saveTemplate(id: string, content: any): Promise<void> {
  const db = await readDb()
  if (!db.templates) {
    db.templates = {}
  }
  db.templates[id] = content
  await writeDb(db)
}

// ============================================
// SAVED LAYOUT PRESETS (NON-DEPLOYED DESIGNS)
// ============================================
export async function getSavedDesigns(type?: string): Promise<SavedDesign[]> {
  const db = await readDb()
  const list = db.saved_designs || []
  if (type) {
    return list.filter(item => item.type === type)
  }
  return list
}

export async function saveSavedDesign(design: SavedDesign): Promise<void> {
  const db = await readDb()
  if (!db.saved_designs) {
    db.saved_designs = []
  }
  const idx = db.saved_designs.findIndex(d => d.id === design.id)
  if (idx !== -1) {
    db.saved_designs[idx] = design
  } else {
    db.saved_designs.push(design)
  }
  await writeDb(db)
}

export async function deleteSavedDesign(id: string): Promise<void> {
  const db = await readDb()
  if (!db.saved_designs) return
  db.saved_designs = db.saved_designs.filter(d => d.id !== id)
  await writeDb(db)
}

// ============================================
// CAPABILITIES SETTINGS METHODS
// ============================================
export async function getCapabilitiesSettings(): Promise<CapabilitiesSettings> {
  const db = await readDb()
  return db.capabilities_settings || defaultCapabilitiesSettings
}

export async function saveCapabilitiesSettings(settings: CapabilitiesSettings): Promise<void> {
  const db = await readDb()
  db.capabilities_settings = settings
  await writeDb(db)
}

// ============================================
// ABOUT SETTINGS METHODS
// ============================================
export async function getAboutSettings(): Promise<AboutSettings> {
  const db = await readDb()
  const settings = db.about_settings || defaultAboutSettings
  if (!settings.gear_categories) {
    settings.gear_badge = defaultAboutSettings.gear_badge
    settings.gear_title = defaultAboutSettings.gear_title
    settings.gear_description = defaultAboutSettings.gear_description
    settings.gear_categories = defaultAboutSettings.gear_categories
  }
  return settings
}

export async function saveAboutSettings(settings: AboutSettings): Promise<void> {
  const db = await readDb()
  db.about_settings = settings
  await writeDb(db)
}

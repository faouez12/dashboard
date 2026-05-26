'use server'

import { revalidatePath } from 'next/cache'
import * as db from '@/lib/db'
import crypto from 'crypto'

// ============================================
// GALLERY ACTIONS
// ============================================
export async function fetchGalleryItems() {
  return await db.getGalleryItems()
}

export async function addOrUpdateGalleryItem(data: Omit<db.GalleryItem, 'id' | 'created_at'>, id?: string) {
  const itemId = id || `gal-${crypto.randomUUID()}`
  const newItem: db.GalleryItem = {
    ...data,
    id: itemId,
    created_at: new Date().toISOString()
  }
  await db.saveGalleryItem(newItem)
  revalidatePath('/')
  revalidatePath('/gallery')
  revalidatePath('/admin/dashboard/gallery')
  return itemId
}

export async function deleteGalleryItem(id: string) {
  await db.deleteGalleryItem(id)
  revalidatePath('/')
  revalidatePath('/gallery')
  revalidatePath('/admin/dashboard/gallery')
}

// ============================================
// BLOG ACTIONS
// ============================================
export async function fetchBlogPosts() {
  return await db.getBlogPosts()
}

export async function addOrUpdateBlogPost(data: Omit<db.BlogPost, 'id' | 'created_at'>, id?: string) {
  const itemId = id || `blog-${crypto.randomUUID()}`
  const newPost: db.BlogPost = {
    ...data,
    id: itemId,
    created_at: new Date().toISOString()
  }
  await db.saveBlogPost(newPost)
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath(`/blog/${data.slug}`)
  revalidatePath('/admin/dashboard/blog')
  return itemId
}

export async function deleteBlogPost(id: string) {
  await db.deleteBlogPost(id)
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/admin/dashboard/blog')
}

// ============================================
// EVENT ACTIONS
// ============================================
export async function fetchEvents() {
  return await db.getEvents()
}

export async function addOrUpdateEvent(data: Omit<db.RaceEvent, 'id' | 'created_at'>, id?: string) {
  const itemId = id || `evt-${crypto.randomUUID()}`
  const newEvent: db.RaceEvent = {
    ...data,
    id: itemId,
    created_at: new Date().toISOString()
  }
  await db.saveEvent(newEvent)
  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath(`/events/${data.slug}`)
  revalidatePath('/admin/dashboard/events')
  return itemId
}

export async function deleteEvent(id: string) {
  await db.deleteEvent(id)
  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath('/admin/dashboard/events')
}

// ============================================
// MESSAGE ACTIONS
// ============================================
export async function fetchMessages() {
  return await db.getMessages()
}

export async function deleteMessage(id: string) {
  await db.deleteMessage(id)
  revalidatePath('/admin/dashboard/messages')
  return { success: true }
}

// ============================================
// HERO SETTINGS ACTIONS
// ============================================
export async function fetchHeroSettings() {
  return await db.getHeroSettings()
}

export async function updateHeroSettings(data: db.HeroSettings) {
  await db.saveHeroSettings(data)
  revalidatePath('/')
  revalidatePath('/admin/dashboard/settings/hero')
}

// ============================================
// PUCK PAGE BUILDER ACTIONS
// ============================================
export async function fetchBlogPostById(id: string) {
  const posts = await db.getBlogPosts()
  return posts.find(p => p.id === id) || null
}

export async function fetchEventById(id: string) {
  const events = await db.getEvents()
  return events.find(e => e.id === id) || null
}

export async function savePuckData(type: 'blog' | 'event', id: string, puckData: any) {
  if (type === 'blog') {
    const posts = await db.getBlogPosts()
    const post = posts.find(p => p.id === id)
    if (post) {
      post.puck_data = puckData
      await db.saveBlogPost(post)
      revalidatePath(`/blog/${post.slug}`)
    }
  } else if (type === 'event') {
    const events = await db.getEvents()
    const event = events.find(e => e.id === id)
    if (event) {
      event.puck_data = puckData
      await db.saveEvent(event)
      revalidatePath(`/events/${event.slug}`)
    }
  }
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/events')
  revalidatePath('/admin/dashboard/blog')
  revalidatePath('/admin/dashboard/events')
}

// ============================================
// HOMEPAGE PUCK ACTIONS
// ============================================
export async function fetchHomepagePuckData() {
  const database = await db.readDb()
  return database.homepage_puck_data || null
}

export async function saveHomepagePuckData(data: any) {
  const database = await db.readDb()
  database.homepage_puck_data = data
  await db.writeDb(database)
  revalidatePath('/')
}

// ============================================
// TEMPLATE ACTIONS
// ============================================
export async function getTemplate(id: string) {
  return await db.getTemplate(id)
}

export async function saveTemplate(id: string, content: any) {
  await db.saveTemplate(id, content)
  revalidatePath('/admin/dashboard')
}

// ============================================
// SAVED LAYOUT PRESETS (NON-DEPLOYED DESIGNS)
// ============================================
export async function fetchSavedDesigns(type?: string) {
  return await db.getSavedDesigns(type)
}

export async function addSavedDesign(type: string, name: string, content: any) {
  const id = `preset-${crypto.randomUUID()}`
  const newDesign: db.SavedDesign = {
    id,
    type,
    name,
    content,
    created_at: new Date().toISOString()
  }
  await db.saveSavedDesign(newDesign)
  return id
}

export async function deleteSavedDesign(id: string) {
  await db.deleteSavedDesign(id)
}

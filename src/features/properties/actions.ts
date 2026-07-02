/**
 * src/features/properties/actions.ts
 *
 * Next.js Server Actions for Shivara CRM property management.
 *
 * All actions follow the pattern:
 *   { success: true,  data: <T> }       — on success
 *   { success: false, error: string }   — on failure
 */

'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'

// ---------------------------------------------------------------------------
// Zod validation schemas
// ---------------------------------------------------------------------------

const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.string().min(1, 'Property type is required'),   // e.g. APARTMENT, VILLA, PLOT
  price: z.number().positive('Price must be positive'),
  area: z.number().positive('Area must be positive').optional(),
  areaUnit: z.string().optional(),                         // e.g. sqft, sqm
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  location: z.string().min(1, 'Location is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  brochureUrl: z.string().url().optional().or(z.literal('')),
  reraNumber: z.string().optional(),
  possessionDate: z.coerce.date().optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
})

const updatePropertySchema = createPropertySchema.partial()

// ---------------------------------------------------------------------------
// TypeScript types
// ---------------------------------------------------------------------------

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>

export interface PropertyFilters {
  type?: string
  isActive?: boolean
  isFeatured?: boolean
  city?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string }

// ---------------------------------------------------------------------------
// getProperties
// ---------------------------------------------------------------------------

/**
 * Fetches properties with optional filtering by type, active status,
 * featured status, city, price range, and a free-text search.
 */
export async function getProperties(filters: PropertyFilters = {}): Promise<
  ActionResult<Record<string, unknown>[]>
> {
  try {
    const where: Record<string, unknown> = {}

    if (filters.type) where.type = filters.type
    if (typeof filters.isActive === 'boolean') where.isActive = filters.isActive
    if (typeof filters.isFeatured === 'boolean') where.isFeatured = filters.isFeatured
    if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return { success: true, data: properties as unknown as Record<string, unknown>[] }
  } catch (error) {
    console.error('[getProperties]', error)
    return { success: false, error: 'Failed to fetch properties.' }
  }
}

// ---------------------------------------------------------------------------
// getProperty
// ---------------------------------------------------------------------------

/**
 * Fetches a single property by its ID.
 */
export async function getProperty(id: string): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const property = await prisma.property.findUnique({ where: { id } })

    if (!property) {
      return { success: false, error: 'Property not found.' }
    }

    return { success: true, data: property as unknown as Record<string, unknown> }
  } catch (error) {
    console.error('[getProperty]', error)
    return { success: false, error: 'Failed to fetch property.' }
  }
}

// ---------------------------------------------------------------------------
// createProperty
// ---------------------------------------------------------------------------

/**
 * Creates a new property listing.
 */
export async function createProperty(
  data: CreatePropertyInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = createPropertySchema.parse(data)

    const property = await prisma.property.create({
      data: {
        title: validated.title,
        description: validated.description ?? null,
        type: validated.type,
        price: validated.price,
        area: validated.area ?? null,
        areaUnit: validated.areaUnit ?? null,
        bedrooms: validated.bedrooms ?? null,
        bathrooms: validated.bathrooms ?? null,
        location: validated.location,
        address: validated.address ?? null,
        city: validated.city ?? null,
        state: validated.state ?? null,
        pincode: validated.pincode ?? null,
        latitude: validated.latitude ?? null,
        longitude: validated.longitude ?? null,
        amenities: validated.amenities ?? [],
        images: validated.images ?? [],
        videoUrl: validated.videoUrl || null,
        brochureUrl: validated.brochureUrl || null,
        reraNumber: validated.reraNumber ?? null,
        possessionDate: validated.possessionDate ?? null,
        isActive: validated.isActive ?? true,
        isFeatured: validated.isFeatured ?? false,
      },
      select: { id: true },
    })

    revalidatePath('/crm/properties')

    return { success: true, data: { id: property.id } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? 'Validation failed.' }
    }
    console.error('[createProperty]', error)
    return { success: false, error: 'Failed to create property.' }
  }
}

// ---------------------------------------------------------------------------
// updateProperty
// ---------------------------------------------------------------------------

/**
 * Updates a property's fields.  Only fields present in `data` are modified.
 */
export async function updateProperty(
  id: string,
  data: UpdatePropertyInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = updatePropertySchema.parse(data)

    const existing = await prisma.property.findUnique({ where: { id }, select: { id: true } })
    if (!existing) {
      return { success: false, error: 'Property not found.' }
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...validated,
        videoUrl: validated.videoUrl || undefined,
        brochureUrl: validated.brochureUrl || undefined,
        updatedAt: new Date(),
      },
      select: { id: true },
    })

    revalidatePath('/crm/properties')
    revalidatePath(`/crm/properties/${id}`)

    return { success: true, data: { id: property.id } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? 'Validation failed.' }
    }
    console.error('[updateProperty]', error)
    return { success: false, error: 'Failed to update property.' }
  }
}

// ---------------------------------------------------------------------------
// togglePropertyActive
// ---------------------------------------------------------------------------

/**
 * Flips the `isActive` flag on a property — used to publish / unpublish it.
 */
export async function togglePropertyActive(
  id: string,
): Promise<ActionResult<{ id: string; isActive: boolean }>> {
  try {
    const existing = await prisma.property.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    })
    if (!existing) {
      return { success: false, error: 'Property not found.' }
    }

    const property = await prisma.property.update({
      where: { id },
      data: { isActive: !existing.isActive, updatedAt: new Date() },
      select: { id: true, isActive: true },
    })

    revalidatePath('/crm/properties')
    revalidatePath(`/crm/properties/${id}`)

    return { success: true, data: { id: property.id, isActive: property.isActive } }
  } catch (error) {
    console.error('[togglePropertyActive]', error)
    return { success: false, error: 'Failed to toggle property active state.' }
  }
}

// ---------------------------------------------------------------------------
// togglePropertyFeatured
// ---------------------------------------------------------------------------

/**
 * Flips the `isFeatured` flag on a property — used to feature it on the
 * website homepage / marketing materials.
 */
export async function togglePropertyFeatured(
  id: string,
): Promise<ActionResult<{ id: string; isFeatured: boolean }>> {
  try {
    const existing = await prisma.property.findUnique({
      where: { id },
      select: { id: true, isFeatured: true },
    })
    if (!existing) {
      return { success: false, error: 'Property not found.' }
    }

    const property = await prisma.property.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured, updatedAt: new Date() },
      select: { id: true, isFeatured: true },
    })

    revalidatePath('/crm/properties')
    revalidatePath(`/crm/properties/${id}`)

    return { success: true, data: { id: property.id, isFeatured: property.isFeatured } }
  } catch (error) {
    console.error('[togglePropertyFeatured]', error)
    return { success: false, error: 'Failed to toggle property featured state.' }
  }
}

// ---------------------------------------------------------------------------
// deleteProperty
// ---------------------------------------------------------------------------

/**
 * Permanently deletes a property.
 */
export async function deleteProperty(id: string): Promise<ActionResult<undefined>> {
  try {
    const existing = await prisma.property.findUnique({ where: { id }, select: { id: true } })
    if (!existing) {
      return { success: false, error: 'Property not found.' }
    }

    await prisma.property.delete({ where: { id } })

    revalidatePath('/crm/properties')

    return { success: true, data: undefined }
  } catch (error) {
    console.error('[deleteProperty]', error)
    return { success: false, error: 'Failed to delete property.' }
  }
}

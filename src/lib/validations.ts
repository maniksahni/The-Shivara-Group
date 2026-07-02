/**
 * src/lib/validations.ts
 *
 * Zod validation schemas for all forms and API routes in the Shivara CRM.
 *
 * Schemas defined here:
 *  1. loginSchema        — admin / agent sign-in
 *  2. leadSchema         — create / update a lead
 *  3. propertySchema     — create / update a property listing
 *  4. agentSchema        — create a new agent user
 *  5. noteSchema         — add a note to a lead
 *  6. enquirySchema      — public website enquiry form (maps to a new lead)
 */

import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// Shared enum validators — kept in sync with prisma/schema.prisma
// ─────────────────────────────────────────────────────────────────────────────

const LeadStatusEnum = z.enum([
  'NEW',
  'CONTACTED',
  'FOLLOW_UP',
  'SITE_VISIT_SCHEDULED',
  'NEGOTIATION',
  'CLOSED',
  'LOST',
])

const LeadSourceEnum = z.enum([
  'INSTAGRAM',
  'WHATSAPP',
  'WEBSITE',
  'FACEBOOK',
  'GOOGLE',
  'REFERRAL',
  'OTHER',
])

const PriorityEnum = z.enum(['HIGH', 'MEDIUM', 'LOW'])

const PropertyTypeEnum = z.enum([
  'APARTMENT',
  'VILLA',
  'PLOT',
  'COMMERCIAL',
  'FARMHOUSE',
])

const RoleEnum = z.enum(['ADMIN', 'AGENT'])

// ─────────────────────────────────────────────────────────────────────────────
// 1. Login schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates the sign-in form / API payload.
 */
export const loginSchema = z.object({
  /** Must be a valid e-mail address. */
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),

  /** Minimum 6 characters to allow existing bcrypt-hashed passwords. */
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ─────────────────────────────────────────────────────────────────────────────
// 2. Lead schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates create / update lead forms and the corresponding API endpoints.
 * All optional fields are nullable so that partial updates work cleanly.
 */
export const leadSchema = z.object({
  /** Full name of the prospect — required. */
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),

  /** Primary contact number — minimum 10 digits. */
  phone: z
    .string({ required_error: 'Phone number is required' })
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .trim(),

  /** Optional WhatsApp number (may differ from primary phone). */
  whatsappNumber: z
    .string()
    .min(10, 'WhatsApp number must be at least 10 digits')
    .max(15, 'WhatsApp number must be at most 15 digits')
    .trim()
    .optional()
    .nullable(),

  /** Optional e-mail address. */
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim()
    .optional()
    .nullable(),

  /**
   * Budget expressed as a string so that it can hold values like
   * "50 Lakh", "1.5 Cr", or a raw number string.
   */
  budget: z
    .string()
    .max(50, 'Budget description must be at most 50 characters')
    .trim()
    .optional()
    .nullable(),

  /** Preferred area / locality the prospect is interested in. */
  preferredLocation: z
    .string()
    .max(200, 'Preferred location must be at most 200 characters')
    .trim()
    .optional()
    .nullable(),

  /** Type of property the prospect is looking for. */
  propertyType: PropertyTypeEnum.optional().nullable(),

  /** Channel through which the lead was acquired. */
  source: LeadSourceEnum.default('WEBSITE'),

  /** Current stage in the sales pipeline. */
  status: LeadStatusEnum.default('NEW'),

  /** Urgency / importance rating. */
  priority: PriorityEnum.default('MEDIUM'),

  /** ID of the agent this lead is assigned to. */
  assignedToId: z
    .string()
    .cuid('Invalid agent ID')
    .optional()
    .nullable(),

  /** Scheduled date-time for the next follow-up action. */
  followUpDate: z
    .string()
    .datetime({ message: 'Follow-up date must be a valid ISO datetime string' })
    .optional()
    .nullable(),
})

export type LeadInput = z.infer<typeof leadSchema>

// ─────────────────────────────────────────────────────────────────────────────
// 3. Property schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates the property listing create / update form.
 */
export const propertySchema = z.object({
  /** Display name / headline for the property. */
  title: z
    .string({ required_error: 'Title is required' })
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be at most 200 characters')
    .trim(),

  /** Detailed description shown on the listing page. */
  description: z
    .string({ required_error: 'Description is required' })
    .min(20, 'Description must be at least 20 characters')
    .trim(),

  /**
   * Price expressed as a human-readable string, e.g. "₹45 Lakh" or
   * "1.2 Cr" — stored as text to avoid floating-point issues.
   */
  price: z
    .string({ required_error: 'Price is required' })
    .min(1, 'Price is required')
    .max(50, 'Price must be at most 50 characters')
    .trim(),

  /** Full address or area description. */
  location: z
    .string({ required_error: 'Location is required' })
    .min(3, 'Location must be at least 3 characters')
    .max(300, 'Location must be at most 300 characters')
    .trim(),

  /** Category of the property. */
  type: PropertyTypeEnum,

  /** Number of bedrooms (not applicable for plots / commercial). */
  bedrooms: z
    .number()
    .int('Bedrooms must be a whole number')
    .min(0, 'Bedrooms cannot be negative')
    .max(50, 'Bedrooms value seems too high')
    .optional()
    .nullable(),

  /** Number of bathrooms. */
  bathrooms: z
    .number()
    .int('Bathrooms must be a whole number')
    .min(0, 'Bathrooms cannot be negative')
    .max(50, 'Bathrooms value seems too high')
    .optional()
    .nullable(),

  /** Total built-up / plot area, e.g. "1,200 sq ft" or "500 sq yd". */
  area: z
    .string()
    .max(50, 'Area must be at most 50 characters')
    .trim()
    .optional()
    .nullable(),

  /** List of available amenities, e.g. ["Swimming Pool", "Gym"]. */
  amenities: z
    .array(z.string().trim())
    .default([]),

  /** Array of public image URLs. */
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .default([]),

  /** Whether the listing is visible to the public / active. */
  isActive: z.boolean().default(true),

  /** Whether to feature this property on the home page. */
  isFeatured: z.boolean().default(false),
})

export type PropertyInput = z.infer<typeof propertySchema>

// ─────────────────────────────────────────────────────────────────────────────
// 4. Agent schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates the "create new agent" admin form.
 * Password is collected in plain text here; the API route must hash it
 * with bcryptjs before persisting.
 */
export const agentSchema = z.object({
  /** Full name of the agent. */
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),

  /** Unique e-mail used for login. */
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),

  /** Initial password — must be at least 8 characters for security. */
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters (bcrypt limit)'),

  /** Agent's contact phone number. */
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .trim()
    .optional()
    .nullable(),

  /** System role assigned to this user. */
  role: RoleEnum.default('AGENT'),
})

export type AgentInput = z.infer<typeof agentSchema>

// ─────────────────────────────────────────────────────────────────────────────
// 5. Note schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates the "add note" form on the lead detail page.
 */
export const noteSchema = z.object({
  /** Body of the note — must not be blank. */
  content: z
    .string({ required_error: 'Note content is required' })
    .min(1, 'Note content cannot be empty')
    .max(5000, 'Note must be at most 5,000 characters')
    .trim(),
})

export type NoteInput = z.infer<typeof noteSchema>

// ─────────────────────────────────────────────────────────────────────────────
// 6. Enquiry schema  (public website contact / property enquiry form)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates submissions from the public-facing enquiry form.
 * On submission, the API creates a new Lead record with status = NEW.
 */
export const enquirySchema = z.object({
  /** Full name of the person enquiring. */
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),

  /** Primary phone number — minimum 10 digits. */
  phone: z
    .string({ required_error: 'Phone number is required' })
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .trim(),

  /** Optional WhatsApp number if different from above. */
  whatsappNumber: z
    .string()
    .min(10, 'WhatsApp number must be at least 10 digits')
    .max(15, 'WhatsApp number must be at most 15 digits')
    .trim()
    .optional()
    .nullable(),

  /**
   * Budget range the enquirer is comfortable with.
   * Free-form text, e.g. "50–70 Lakh".
   */
  budget: z
    .string()
    .max(50, 'Budget description must be at most 50 characters')
    .trim()
    .optional()
    .nullable(),

  /** Preferred area / locality. */
  preferredLocation: z
    .string()
    .max(200, 'Preferred location must be at most 200 characters')
    .trim()
    .optional()
    .nullable(),

  /** Type of property the enquirer is interested in. */
  propertyType: PropertyTypeEnum.optional().nullable(),

  /** Channel through which this enquiry arrived. */
  source: LeadSourceEnum.default('WEBSITE'),

  /** Optional free-text message from the enquirer. */
  message: z
    .string()
    .max(2000, 'Message must be at most 2,000 characters')
    .trim()
    .optional()
    .nullable(),
})

export type EnquiryInput = z.infer<typeof enquirySchema>

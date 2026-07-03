/**
 * prisma/seed.ts
 *
 * Database seed script for the Shivara CRM.
 *
 * Creates:
 *  • 1 admin user
 *  • 3 agent users
 *  • 6 property listings (various types across Bareilly)
 *  • 15 sample leads spread across all statuses, sources & priorities
 *  • Notes and activity entries for the first 5 leads
 *
 * Run with:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 * or add to package.json:
 *   "prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }
 * then run: npx prisma db seed
 */

import bcryptjs from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Hashes a plain-text password using bcryptjs with 12 salt rounds. */
async function hashPassword(plain: string): Promise<string> {
  return bcryptjs.hash(plain, 12)
}

/**
 * Returns a Date offset from today by the given number of days.
 * Negative values go into the past, positive into the future.
 */
function daysFromNow(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

// ─────────────────────────────────────────────────────────────────────────────
// Main seed function
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Starting Shivara CRM seed …\n')

  // ───────────────────────────────────────────────────────────────────────────
  // Step 1 — Users (Admin + Agents)
  // ───────────────────────────────────────────────────────────────────────────

  console.log('👤  Creating users …')

  const [adminHash, agentHash] = await Promise.all([
    hashPassword('admin123'),
    hashPassword('agent123'),
  ])

  // Admin
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@shivaragroup.com' },
    update: {},
    create: {
      name:         'Admin User',
      email:        'admin@shivaragroup.com',
      passwordHash: adminHash,
      role:         'ADMIN',
      phone:        '9999900000',
      isActive:     true,
    },
  })
  console.log(`   ✅  Admin: ${admin.name} <${admin.email}>`)

  // Agent 1
  const agent1 = await prisma.user.upsert({
    where:  { email: 'agent1@shivaragroup.com' },
    update: {},
    create: {
      name:         'Rahul Sharma',
      email:        'agent1@shivaragroup.com',
      passwordHash: agentHash,
      role:         'AGENT',
      phone:        '9876543210',
      isActive:     true,
    },
  })
  console.log(`   ✅  Agent 1: ${agent1.name} <${agent1.email}>`)

  // Agent 2
  const agent2 = await prisma.user.upsert({
    where:  { email: 'agent2@shivaragroup.com' },
    update: {},
    create: {
      name:         'Priya Singh',
      email:        'agent2@shivaragroup.com',
      passwordHash: agentHash,
      role:         'AGENT',
      phone:        '9876543211',
      isActive:     true,
    },
  })
  console.log(`   ✅  Agent 2: ${agent2.name} <${agent2.email}>`)

  // Agent 3
  const agent3 = await prisma.user.upsert({
    where:  { email: 'agent3@shivaragroup.com' },
    update: {},
    create: {
      name:         'Amit Kumar',
      email:        'agent3@shivaragroup.com',
      passwordHash: agentHash,
      role:         'AGENT',
      phone:        '9876543212',
      isActive:     true,
    },
  })
  console.log(`   ✅  Agent 3: ${agent3.name} <${agent3.email}>`)

  // Avoid duplicate demo inventory/leads when the seed is run more than once.
  // Users are safely upserted above; sample properties/leads are intentionally
  // skipped if any existing CRM data is present.
  const [existingProperties, existingLeads] = await Promise.all([
    prisma.property.count(),
    prisma.lead.count(),
  ])

  if (existingProperties > 0 || existingLeads > 0) {
    console.log('\n🛡️  Existing CRM data found — skipping sample properties and leads.')
    console.log(`   Properties: ${existingProperties}`)
    console.log(`   Leads: ${existingLeads}`)
    console.log('   Users were still upserted safely.\n')
    return
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Step 2 — Properties
  // ───────────────────────────────────────────────────────────────────────────

  console.log('\n🏠  Creating properties …')

  const prop1 = await prisma.property.create({
    data: {
      title:       '3 BHK Premium Apartment — Civil Lines',
      description:
        'A beautifully designed 3 BHK apartment located in the heart of Civil Lines, Bareilly. ' +
        'The unit features marble flooring, modular kitchen, and a spacious balcony overlooking ' +
        'the city. Part of a gated society with 24/7 security, power backup, and ample parking.',
      price:       '65 Lakh',
      location:    'Civil Lines, Bareilly',
      type:        'APARTMENT',
      bedrooms:    3,
      bathrooms:   2,
      area:        '1,450 sq ft',
      amenities:   [
        'Swimming Pool',
        'Gymnasium',
        'Power Backup',
        'Covered Parking',
        '24/7 Security',
        'Clubhouse',
        'Children Play Area',
      ],
      images:      [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      ],
      isActive:    true,
      isFeatured:  true,
    },
  })
  console.log(`   ✅  Property: ${prop1.title}`)

  const prop2 = await prisma.property.create({
    data: {
      title:       'Luxury 4 BHK Villa — Pilibhit Road',
      description:
        'An exquisite 4 BHK independent villa on Pilibhit Road, Bareilly. Spread across ' +
        '3,200 sq ft of living space on a 250 sq yd plot, this villa offers a private lawn, ' +
        'rooftop terrace, imported flooring, and a fully equipped modular kitchen. Perfect ' +
        'for families seeking premium living with excellent road connectivity.',
      price:       '1.85 Cr',
      location:    'Pilibhit Road, Bareilly',
      type:        'VILLA',
      bedrooms:    4,
      bathrooms:   4,
      area:        '3,200 sq ft on 250 sq yd',
      amenities:   [
        'Private Lawn',
        'Rooftop Terrace',
        'Modular Kitchen',
        'Solar Panels',
        'CCTV Surveillance',
        'Rainwater Harvesting',
        'Servant Quarter',
      ],
      images:      [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      ],
      isActive:    true,
      isFeatured:  true,
    },
  })
  console.log(`   ✅  Property: ${prop2.title}`)

  const prop3 = await prisma.property.create({
    data: {
      title:       'Residential Plot — Cantt Area',
      description:
        'Prime residential plot of 200 sq yd in the prestigious Cantt area of Bareilly. ' +
        'The plot has clear title documents, is in a well-developed colony with wide roads, ' +
        'underground sewage, street lighting, and is close to reputed schools and hospitals. ' +
        'Ideal for building your dream home or as a long-term investment.',
      price:       '42 Lakh',
      location:    'Cantt Area, Bareilly',
      type:        'PLOT',
      bedrooms:    null,
      bathrooms:   null,
      area:        '200 sq yd',
      amenities:   [
        'Clear Title',
        'Wide Roads',
        'Underground Sewage',
        'Street Lighting',
        'Near Schools',
        'Near Hospitals',
      ],
      images:      [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      ],
      isActive:    true,
      isFeatured:  false,
    },
  })
  console.log(`   ✅  Property: ${prop3.title}`)

  const prop4 = await prisma.property.create({
    data: {
      title:       'Commercial Shop — Kutchery Road',
      description:
        'A ground-floor commercial shop measuring 500 sq ft on Kutchery Road, one of ' +
        'Bareilly\'s busiest commercial corridors. High foot traffic, suitable for retail, ' +
        'showroom, or a bank branch. Comes with a mezzanine level and storage area. ' +
        'Monthly rental income potential of ₹35,000–₹40,000.',
      price:       '75 Lakh',
      location:    'Kutchery Road, Bareilly',
      type:        'COMMERCIAL',
      bedrooms:    null,
      bathrooms:   1,
      area:        '500 sq ft + mezzanine',
      amenities:   [
        'Ground Floor',
        'High Footfall Area',
        'Mezzanine Level',
        'Storage Area',
        'Parking Available',
        'Fire Safety Equipment',
      ],
      images:      [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      ],
      isActive:    true,
      isFeatured:  false,
    },
  })
  console.log(`   ✅  Property: ${prop4.title}`)

  const prop5 = await prisma.property.create({
    data: {
      title:       '2 BHK Ready-to-Move Apartment — Subhash Nagar',
      description:
        'A ready-to-move 2 BHK apartment in Subhash Nagar, Bareilly. The unit is on the ' +
        '4th floor of a 7-storey building with lift, and offers a great city view. Features ' +
        'vitrified tiles, 2-tonne AC points, and a semi-modular kitchen. Excellent choice ' +
        'for first-time home buyers and investors looking for rental yield.',
      price:       '38 Lakh',
      location:    'Subhash Nagar, Bareilly',
      type:        'APARTMENT',
      bedrooms:    2,
      bathrooms:   2,
      area:        '1,050 sq ft',
      amenities:   [
        'Lift',
        'Power Backup',
        'Security Guard',
        'Open Parking',
        'Near Market',
        'City View',
      ],
      images:      [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
      isActive:    true,
      isFeatured:  false,
    },
  })
  console.log(`   ✅  Property: ${prop5.title}`)

  const prop6 = await prisma.property.create({
    data: {
      title:       'Farmhouse with Agricultural Land — Nawabganj Road',
      description:
        'Exclusive farmhouse spread over 2 acres on Nawabganj Road, 12 km from Bareilly city. ' +
        'The property includes a fully furnished 3 BHK bungalow, a fruit orchard, fish pond, ' +
        'and a bore-well. Ideal as a weekend retreat, agri-tourism venture, or a premium ' +
        'agricultural investment. Highway frontage with easy access from Bareilly.',
      price:       '3.20 Cr',
      location:    'Nawabganj Road, Bareilly',
      type:        'FARMHOUSE',
      bedrooms:    3,
      bathrooms:   3,
      area:        '2 Acres',
      amenities:   [
        'Furnished Bungalow',
        'Fruit Orchard',
        'Fish Pond',
        'Bore-Well',
        'Highway Frontage',
        'Agri-Tourism Potential',
        'Private Gate',
      ],
      images:      [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      ],
      isActive:    true,
      isFeatured:  true,
    },
  })
  console.log(`   ✅  Property: ${prop6.title}`)

  // ───────────────────────────────────────────────────────────────────────────
  // Step 3 — Sample Leads (15 leads across all statuses / sources / priorities)
  // ───────────────────────────────────────────────────────────────────────────

  console.log('\n📋  Creating leads …')

  // Lead 1 — NEW, INSTAGRAM, HIGH, assigned to agent1
  const lead1 = await prisma.lead.create({
    data: {
      name:              'Vikram Malhotra',
      phone:             '9811223344',
      whatsappNumber:    '9811223344',
      email:             'vikram.malhotra@gmail.com',
      budget:            '60–70 Lakh',
      preferredLocation: 'Civil Lines',
      propertyType:      'APARTMENT',
      source:            'INSTAGRAM',
      status:            'NEW',
      priority:          'HIGH',
      assignedToId:      agent1.id,
      followUpDate:      daysFromNow(1),
    },
  })
  console.log(`   ✅  Lead 1: ${lead1.name} — ${lead1.status}`)

  // Lead 2 — CONTACTED, WHATSAPP, MEDIUM, assigned to agent2
  const lead2 = await prisma.lead.create({
    data: {
      name:              'Sunita Agarwal',
      phone:             '9822334455',
      whatsappNumber:    '9822334455',
      email:             null,
      budget:            '40–50 Lakh',
      preferredLocation: 'Subhash Nagar',
      propertyType:      'APARTMENT',
      source:            'WHATSAPP',
      status:            'CONTACTED',
      priority:          'MEDIUM',
      assignedToId:      agent2.id,
      followUpDate:      daysFromNow(2),
    },
  })
  console.log(`   ✅  Lead 2: ${lead2.name} — ${lead2.status}`)

  // Lead 3 — FOLLOW_UP, FACEBOOK, HIGH, assigned to agent3
  const lead3 = await prisma.lead.create({
    data: {
      name:              'Deepak Verma',
      phone:             '9833445566',
      whatsappNumber:    '9833445566',
      email:             'deepak.v@yahoo.com',
      budget:            '1.5–2 Cr',
      preferredLocation: 'Pilibhit Road',
      propertyType:      'VILLA',
      source:            'FACEBOOK',
      status:            'FOLLOW_UP',
      priority:          'HIGH',
      assignedToId:      agent1.id,
      followUpDate:      daysFromNow(-1), // overdue follow-up
    },
  })
  console.log(`   ✅  Lead 3: ${lead3.name} — ${lead3.status}`)

  // Lead 4 — SITE_VISIT_SCHEDULED, GOOGLE, HIGH, assigned to agent1
  const lead4 = await prisma.lead.create({
    data: {
      name:              'Anjali Kapoor',
      phone:             '9844556677',
      whatsappNumber:    null,
      email:             'anjali.kapoor@outlook.com',
      budget:            '35–45 Lakh',
      preferredLocation: 'Cantt Area',
      propertyType:      'PLOT',
      source:            'GOOGLE',
      status:            'SITE_VISIT_SCHEDULED',
      priority:          'HIGH',
      assignedToId:      agent2.id,
      followUpDate:      daysFromNow(3),
    },
  })
  console.log(`   ✅  Lead 4: ${lead4.name} — ${lead4.status}`)

  // Create SiteVisit for lead4
  await prisma.siteVisit.create({
    data: {
      leadId:      lead4.id,
      scheduledAt: daysFromNow(3),
      location:    'Cantt Area Plot — Near Army Gate No. 3',
      notes:       'Client confirmed visit. Will be accompanied by husband.',
      status:      'SCHEDULED',
    },
  })
  console.log(`      → Site visit booked for ${lead4.name}`)

  // Lead 5 — NEGOTIATION, REFERRAL, HIGH, assigned to agent3
  const lead5 = await prisma.lead.create({
    data: {
      name:              'Rohit Joshi',
      phone:             '9855667788',
      whatsappNumber:    '9855667788',
      email:             'rohit.joshi@gmail.com',
      budget:            '70–80 Lakh',
      preferredLocation: 'Civil Lines',
      propertyType:      'APARTMENT',
      source:            'REFERRAL',
      status:            'NEGOTIATION',
      priority:          'HIGH',
      assignedToId:      agent3.id,
      followUpDate:      daysFromNow(2),
    },
  })
  console.log(`   ✅  Lead 5: ${lead5.name} — ${lead5.status}`)

  // Lead 6 — CLOSED, INSTAGRAM, MEDIUM, assigned to agent1
  const lead6 = await prisma.lead.create({
    data: {
      name:              'Meena Tiwari',
      phone:             '9866778899',
      whatsappNumber:    '9866778899',
      email:             'meena.t@gmail.com',
      budget:            '38 Lakh',
      preferredLocation: 'Subhash Nagar',
      propertyType:      'APARTMENT',
      source:            'INSTAGRAM',
      status:            'CLOSED',
      priority:          'MEDIUM',
      assignedToId:      agent1.id,
      followUpDate:      null,
    },
  })
  console.log(`   ✅  Lead 6: ${lead6.name} — ${lead6.status}`)

  // Lead 7 — LOST, WEBSITE, LOW, assigned to agent2
  const lead7 = await prisma.lead.create({
    data: {
      name:              'Suresh Pandey',
      phone:             '9877889900',
      whatsappNumber:    null,
      email:             null,
      budget:            '20–25 Lakh',
      preferredLocation: 'Any area in Bareilly',
      propertyType:      null,
      source:            'WEBSITE',
      status:            'LOST',
      priority:          'LOW',
      assignedToId:      agent2.id,
      followUpDate:      null,
    },
  })
  console.log(`   ✅  Lead 7: ${lead7.name} — ${lead7.status}`)

  // Lead 8 — NEW, WHATSAPP, MEDIUM, unassigned
  const lead8 = await prisma.lead.create({
    data: {
      name:              'Kavitha Reddy',
      phone:             '9888990011',
      whatsappNumber:    '9888990011',
      email:             'kavitha.r@gmail.com',
      budget:            '80 Lakh – 1 Cr',
      preferredLocation: 'Pilibhit Road',
      propertyType:      'VILLA',
      source:            'WHATSAPP',
      status:            'NEW',
      priority:          'MEDIUM',
      assignedToId:      null,
      followUpDate:      daysFromNow(5),
    },
  })
  console.log(`   ✅  Lead 8: ${lead8.name} — ${lead8.status}`)

  // Lead 9 — CONTACTED, GOOGLE, LOW, assigned to agent3
  const lead9 = await prisma.lead.create({
    data: {
      name:              'Narayan Gupta',
      phone:             '9899001122',
      whatsappNumber:    null,
      email:             'narayan.g@hotmail.com',
      budget:            '40–45 Lakh',
      preferredLocation: 'Cantt Area',
      propertyType:      'PLOT',
      source:            'GOOGLE',
      status:            'CONTACTED',
      priority:          'LOW',
      assignedToId:      agent3.id,
      followUpDate:      daysFromNow(7),
    },
  })
  console.log(`   ✅  Lead 9: ${lead9.name} — ${lead9.status}`)

  // Lead 10 — NEW, FACEBOOK, HIGH, assigned to agent2
  const lead10 = await prisma.lead.create({
    data: {
      name:              'Pooja Chaudhary',
      phone:             '9800112233',
      whatsappNumber:    '9800112233',
      email:             'pooja.c@gmail.com',
      budget:            '2.5–3 Cr',
      preferredLocation: 'Nawabganj Road',
      propertyType:      'FARMHOUSE',
      source:            'FACEBOOK',
      status:            'NEW',
      priority:          'HIGH',
      assignedToId:      agent2.id,
      followUpDate:      daysFromNow(1),
    },
  })
  console.log(`   ✅  Lead 10: ${lead10.name} — ${lead10.status}`)

  // Lead 11 — FOLLOW_UP, REFERRAL, MEDIUM, assigned to agent1
  const lead11 = await prisma.lead.create({
    data: {
      name:              'Sanjay Bhatt',
      phone:             '9811334455',
      whatsappNumber:    '9811334455',
      email:             null,
      budget:            '70–75 Lakh',
      preferredLocation: 'Civil Lines',
      propertyType:      'APARTMENT',
      source:            'REFERRAL',
      status:            'FOLLOW_UP',
      priority:          'MEDIUM',
      assignedToId:      agent1.id,
      followUpDate:      daysFromNow(4),
    },
  })
  console.log(`   ✅  Lead 11: ${lead11.name} — ${lead11.status}`)

  // Lead 12 — NEW, OTHER, LOW, unassigned
  const lead12 = await prisma.lead.create({
    data: {
      name:              'Rajesh Tripathi',
      phone:             '9822445566',
      whatsappNumber:    null,
      email:             'rajesh.t@gmail.com',
      budget:            '1–1.2 Cr',
      preferredLocation: 'Kutchery Road',
      propertyType:      'COMMERCIAL',
      source:            'OTHER',
      status:            'NEW',
      priority:          'LOW',
      assignedToId:      null,
      followUpDate:      null,
    },
  })
  console.log(`   ✅  Lead 12: ${lead12.name} — ${lead12.status}`)

  // Lead 13 — SITE_VISIT_SCHEDULED, INSTAGRAM, HIGH, assigned to agent3
  const lead13 = await prisma.lead.create({
    data: {
      name:              'Nisha Srivastava',
      phone:             '9833556677',
      whatsappNumber:    '9833556677',
      email:             'nisha.s@gmail.com',
      budget:            '50–60 Lakh',
      preferredLocation: 'Civil Lines',
      propertyType:      'APARTMENT',
      source:            'INSTAGRAM',
      status:            'SITE_VISIT_SCHEDULED',
      priority:          'HIGH',
      assignedToId:      agent3.id,
      followUpDate:      daysFromNow(2),
    },
  })
  console.log(`   ✅  Lead 13: ${lead13.name} — ${lead13.status}`)

  // Create SiteVisit for lead13
  await prisma.siteVisit.create({
    data: {
      leadId:      lead13.id,
      scheduledAt: daysFromNow(2),
      location:    '3 BHK Premium Apartment, Tower B, Civil Lines',
      notes:       'Client interested in 3rd or 4th floor unit. Needs corner flat.',
      status:      'SCHEDULED',
    },
  })
  console.log(`      → Site visit booked for ${lead13.name}`)

  // Lead 14 — NEGOTIATION, GOOGLE, HIGH, assigned to agent2
  const lead14 = await prisma.lead.create({
    data: {
      name:              'Harish Mishra',
      phone:             '9844667788',
      whatsappNumber:    '9844667788',
      email:             'harish.m@outlook.com',
      budget:            '38–42 Lakh',
      preferredLocation: 'Subhash Nagar',
      propertyType:      'APARTMENT',
      source:            'GOOGLE',
      status:            'NEGOTIATION',
      priority:          'HIGH',
      assignedToId:      agent2.id,
      followUpDate:      daysFromNow(1),
    },
  })
  console.log(`   ✅  Lead 14: ${lead14.name} — ${lead14.status}`)

  // Lead 15 — CLOSED, WHATSAPP, MEDIUM, assigned to agent3
  const lead15 = await prisma.lead.create({
    data: {
      name:              'Geeta Yadav',
      phone:             '9855778899',
      whatsappNumber:    '9855778899',
      email:             null,
      budget:            '3 Cr',
      preferredLocation: 'Nawabganj Road',
      propertyType:      'FARMHOUSE',
      source:            'WHATSAPP',
      status:            'CLOSED',
      priority:          'MEDIUM',
      assignedToId:      agent3.id,
      followUpDate:      null,
    },
  })
  console.log(`   ✅  Lead 15: ${lead15.name} — ${lead15.status}`)

  // ───────────────────────────────────────────────────────────────────────────
  // Step 4 — Notes and Activity entries for the first 5 leads
  // ───────────────────────────────────────────────────────────────────────────

  console.log('\n📝  Creating notes and activities for leads 1–5 …')

  // ── Lead 1: Vikram Malhotra (NEW → active prospect) ───────────────────────

  await prisma.leadNote.create({
    data: {
      leadId:   lead1.id,
      authorId: agent1.id,
      content:
        'Spoke with Vikram on call. He is looking for a 3 BHK in Civil Lines within a budget ' +
        'of 60–70 Lakh. He has seen our Instagram reel featuring the Civil Lines tower project. ' +
        'Sending the brochure on WhatsApp. Very interested — follow up tomorrow morning.',
    },
  })

  await prisma.leadNote.create({
    data: {
      leadId:   lead1.id,
      authorId: agent1.id,
      content:
        'Brochure sent on WhatsApp. He has forwarded it to his wife for review. ' +
        'Will call back day after tomorrow once family has discussed.',
    },
  })

  await prisma.leadActivity.createMany({
    data: [
      {
        leadId:   lead1.id,
        userId:   admin.id,
        action:   'Lead created',
        oldValue: null,
        newValue: 'Status: NEW',
      },
      {
        leadId:   lead1.id,
        userId:   admin.id,
        action:   'Lead assigned',
        oldValue: 'Unassigned',
        newValue: agent1.name,
      },
      {
        leadId:   lead1.id,
        userId:   agent1.id,
        action:   'Note added',
        oldValue: null,
        newValue: 'Initial call — brochure sent on WhatsApp',
      },
    ],
  })
  console.log(`   ✅  Notes & activities created for Lead 1 (${lead1.name})`)

  // ── Lead 2: Sunita Agarwal (CONTACTED) ────────────────────────────────────

  await prisma.leadNote.create({
    data: {
      leadId:   lead2.id,
      authorId: agent2.id,
      content:
        'Sunita WhatsApp-ed us asking about 2 BHK options in Subhash Nagar. ' +
        'Called her back and had a 20-minute conversation. She is self-employed and ' +
        'can arrange 30% down payment. Budget confirmed at 40–50 Lakh. ' +
        'Shared two options — she is reviewing with her husband.',
    },
  })

  await prisma.leadActivity.createMany({
    data: [
      {
        leadId:   lead2.id,
        userId:   admin.id,
        action:   'Lead created',
        oldValue: null,
        newValue: 'Status: NEW',
      },
      {
        leadId:   lead2.id,
        userId:   admin.id,
        action:   'Lead assigned',
        oldValue: 'Unassigned',
        newValue: agent2.name,
      },
      {
        leadId:   lead2.id,
        userId:   agent2.id,
        action:   'Status changed',
        oldValue: 'NEW',
        newValue: 'CONTACTED',
      },
      {
        leadId:   lead2.id,
        userId:   agent2.id,
        action:   'Note added',
        oldValue: null,
        newValue: 'Contacted via call — options shared',
      },
    ],
  })
  console.log(`   ✅  Notes & activities created for Lead 2 (${lead2.name})`)

  // ── Lead 3: Deepak Verma (FOLLOW_UP — overdue) ────────────────────────────

  await prisma.leadNote.create({
    data: {
      leadId:   lead3.id,
      authorId: agent1.id,
      content:
        'Deepak reached out via Facebook ad about the Pilibhit Road villa. ' +
        'He is a business owner and is very serious about the 4 BHK villa listing. ' +
        'Visited the office, reviewed floor plans. Asked for a site visit next week. ' +
        'Needs bank loan of ~1 Cr. Loan pre-approval in process at SBI.',
    },
  })

  await prisma.leadNote.create({
    data: {
      leadId:   lead3.id,
      authorId: agent1.id,
      content:
        'Follow-up call done. Deepak\'s SBI loan pre-approval is expected in 5 days. ' +
        'He will confirm site visit date once the loan docs are ready. ' +
        'Action: Call again on the scheduled follow-up date.',
    },
  })

  await prisma.leadActivity.createMany({
    data: [
      {
        leadId:   lead3.id,
        userId:   admin.id,
        action:   'Lead created',
        oldValue: null,
        newValue: 'Status: NEW',
      },
      {
        leadId:   lead3.id,
        userId:   admin.id,
        action:   'Lead assigned',
        oldValue: 'Unassigned',
        newValue: agent1.name,
      },
      {
        leadId:   lead3.id,
        userId:   agent1.id,
        action:   'Status changed',
        oldValue: 'NEW',
        newValue: 'CONTACTED',
      },
      {
        leadId:   lead3.id,
        userId:   agent1.id,
        action:   'Status changed',
        oldValue: 'CONTACTED',
        newValue: 'FOLLOW_UP',
      },
      {
        leadId:   lead3.id,
        userId:   agent1.id,
        action:   'Follow-up date set',
        oldValue: null,
        newValue: daysFromNow(-1).toISOString(),
      },
      {
        leadId:   lead3.id,
        userId:   agent1.id,
        action:   'Note added',
        oldValue: null,
        newValue: 'Awaiting SBI loan pre-approval',
      },
    ],
  })
  console.log(`   ✅  Notes & activities created for Lead 3 (${lead3.name})`)

  // ── Lead 4: Anjali Kapoor (SITE_VISIT_SCHEDULED) ──────────────────────────

  await prisma.leadNote.create({
    data: {
      leadId:   lead4.id,
      authorId: agent2.id,
      content:
        'Anjali found us through Google Search while looking for plots in Cantt area. ' +
        'She and her husband run a medical clinic and are looking to invest in land. ' +
        'Very specific about Cantt area only. Budget confirmed at 40 Lakh for 200 sq yd. ' +
        'Site visit scheduled for the 200 sq yd plot near Army Gate 3.',
    },
  })

  await prisma.leadActivity.createMany({
    data: [
      {
        leadId:   lead4.id,
        userId:   admin.id,
        action:   'Lead created',
        oldValue: null,
        newValue: 'Status: NEW',
      },
      {
        leadId:   lead4.id,
        userId:   admin.id,
        action:   'Lead assigned',
        oldValue: 'Unassigned',
        newValue: agent2.name,
      },
      {
        leadId:   lead4.id,
        userId:   agent2.id,
        action:   'Status changed',
        oldValue: 'NEW',
        newValue: 'CONTACTED',
      },
      {
        leadId:   lead4.id,
        userId:   agent2.id,
        action:   'Status changed',
        oldValue: 'CONTACTED',
        newValue: 'SITE_VISIT_SCHEDULED',
      },
      {
        leadId:   lead4.id,
        userId:   agent2.id,
        action:   'Site visit scheduled',
        oldValue: null,
        newValue: `Cantt Area Plot — ${daysFromNow(3).toLocaleDateString('en-IN')}`,
      },
    ],
  })
  console.log(`   ✅  Notes & activities created for Lead 4 (${lead4.name})`)

  // ── Lead 5: Rohit Joshi (NEGOTIATION) ─────────────────────────────────────

  await prisma.leadNote.create({
    data: {
      leadId:   lead5.id,
      authorId: agent3.id,
      content:
        'Rohit was referred by our existing client Mr. Gupta. He is a government officer ' +
        'and is looking for a premium 3 BHK in Civil Lines. Budget is 70–80 Lakh. ' +
        'Has already visited the site twice and is very keen. Currently negotiating price — ' +
        'he is asking for ₹63 Lakh all-inclusive. Our offer is ₹65 Lakh.',
    },
  })

  await prisma.leadNote.create({
    data: {
      leadId:   lead5.id,
      authorId: agent3.id,
      content:
        'Spoke to management about Rohit\'s offer of ₹63 Lakh. Management approved ' +
        '₹63.5 Lakh as the final price. Will present counter-offer to Rohit tomorrow. ' +
        'If he agrees, agreement will be signed by end of week.',
    },
  })

  await prisma.leadNote.create({
    data: {
      leadId:   lead5.id,
      authorId: admin.id,
      content:
        'Admin note: Rohit\'s deal is very close to closing. Ensure all legal documents ' +
        'for the flat are ready — title deed, NOC, layout approval. Assign legal team.',
    },
  })

  await prisma.leadActivity.createMany({
    data: [
      {
        leadId:   lead5.id,
        userId:   admin.id,
        action:   'Lead created',
        oldValue: null,
        newValue: 'Status: NEW',
      },
      {
        leadId:   lead5.id,
        userId:   admin.id,
        action:   'Lead assigned',
        oldValue: 'Unassigned',
        newValue: agent3.name,
      },
      {
        leadId:   lead5.id,
        userId:   agent3.id,
        action:   'Status changed',
        oldValue: 'NEW',
        newValue: 'CONTACTED',
      },
      {
        leadId:   lead5.id,
        userId:   agent3.id,
        action:   'Status changed',
        oldValue: 'CONTACTED',
        newValue: 'FOLLOW_UP',
      },
      {
        leadId:   lead5.id,
        userId:   agent3.id,
        action:   'Status changed',
        oldValue: 'FOLLOW_UP',
        newValue: 'SITE_VISIT_SCHEDULED',
      },
      {
        leadId:   lead5.id,
        userId:   agent3.id,
        action:   'Status changed',
        oldValue: 'SITE_VISIT_SCHEDULED',
        newValue: 'NEGOTIATION',
      },
      {
        leadId:   lead5.id,
        userId:   agent3.id,
        action:   'Note added',
        oldValue: null,
        newValue: 'Counter-offer: ₹63.5 Lakh — pending client response',
      },
      {
        leadId:   lead5.id,
        userId:   admin.id,
        action:   'Note added',
        oldValue: null,
        newValue: 'Legal docs checklist assigned',
      },
    ],
  })
  console.log(`   ✅  Notes & activities created for Lead 5 (${lead5.name})`)

  // ───────────────────────────────────────────────────────────────────────────
  // Done
  // ───────────────────────────────────────────────────────────────────────────

  console.log('\n🎉  Seed completed successfully!\n')
  console.log('   Login credentials:')
  console.log('   ┌─────────────────────────────────────────────────────┐')
  console.log('   │  Role   │  Email                       │  Password  │')
  console.log('   ├─────────────────────────────────────────────────────┤')
  console.log('   │  ADMIN  │  admin@shivaragroup.com      │  admin123  │')
  console.log('   │  AGENT  │  agent1@shivaragroup.com     │  agent123  │')
  console.log('   │  AGENT  │  agent2@shivaragroup.com     │  agent123  │')
  console.log('   │  AGENT  │  agent3@shivaragroup.com     │  agent123  │')
  console.log('   └─────────────────────────────────────────────────────┘\n')
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry point — run main() and disconnect prisma regardless of outcome
// ─────────────────────────────────────────────────────────────────────────────

main()
  .catch((error) => {
    console.error('\n❌  Seed failed:\n', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

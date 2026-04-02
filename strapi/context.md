# Strapi Schema Context

Updated: 2026-03-28
Project path: `/Users/admin/DEV/BostonGrad/strapi`

## Scope
This document summarizes schema definitions found in:
- `src/api/*/content-types/*/schema.json`
- `src/components/**/*.json`

It intentionally excludes plugin and `node_modules` schemas.

## Content Types

### `api::article.article` (collectionType, i18n enabled)
- Collection: `articles`
- Draft/Publish: `false`
- Fields:
- `header`: string, max 200, localized
- `subheader`: string, max 300, localized
- `code`: string, required, non-localized
- `chapters`: json, localized
- `stats`: json, localized
- `seo_title`: string, localized
- `seo_description`: string, localized
- `preview`: media(image), single, non-localized
- `wallpaper`: media(image), single, non-localized
- `text`: richtext, non-localized
- `type`: enum(`generated|blog|page`), default `blog`, non-localized

### `api::click.click` (collectionType)
- Collection: `clicks`
- Draft/Publish: `false`
- Fields:
- `identificator`: string, required
- `fingerprint`: string, required, unique
- `userAgent`: string
- `ipAddress`: string
- `location`: string

### `api::country.country` (collectionType)
- Collection: `countries`
- Draft/Publish: `false`
- Fields:
- `name`: string, required
- `preposition`: string
- `rank`: integer

### `api::main-text.main-text` (collectionType, i18n enabled)
- Collection: `main_texts`
- Draft/Publish: `false`
- Fields:
- `title`: string, localized
- `description`: text, localized
- `image`: media(image), single, non-localized
- `rank`: integer, private, non-localized
- `link`: component `shared.link` (single), localized

### `api::office.office` (collectionType)
- Collection: `offices`
- Draft/Publish: `false`
- Fields:
- `coordinates`: string, required, regex for `lat,lng`
- `city`: string, required
- `visible`: boolean, default `true`
- `working_time`: string
- `image`: media(image), single
- `description`: text, max 1000
- `address`: string, required

### `api::review-category.review-category` (collectionType, i18n enabled)
- Collection: `review_categories`
- Draft/Publish: `false`
- Fields:
- `title`: string, required, localized
- `image`: media(image), multiple, non-localized
- `description`: text, localized
- `isNegative`: boolean, default `false`, localized
- `rank`: integer, non-localized

### `api::review-reply.review-reply` (collectionType)
- Collection: `review_replies`
- Draft/Publish: `false`
- Fields:
- `text`: string, required, max 10000
- `review`: relation manyToOne -> `api::review.review` (inversedBy `review_replies`)
- `screenshots`: media(image), multiple
- `from`: enum(`author|admin|exchanger`), required
- `iaApproved`: boolean

### `api::review.review` (collectionType)
- Collection: `reviews`
- Draft/Publish: `false`
- Fields:
- `fingerprint`: string, unique, optional
- `text`: text, required, max 10000
- `screenshots`: media(image), multiple
- `type`: enum(`positive|neutral|negative|question`), required
- `isDispute`: boolean
- `isClosed`: boolean
- `isApproved`: boolean
- `admin_comment`: string, private
- `ipAddress`: string
- `userAgent`: string
- `location`: string
- `ai_data`: json
- `review_replies`: relation oneToMany -> `api::review-reply.review-reply` (mappedBy `review`)
- `honeypot`: string, max 120
- `telegram`: string
- `whatsapp`: string
- `name`: string
- `review_categories`: relation oneToMany -> `api::review-category.review-category`
- `isExchangeDone`: boolean
- `gossip`: string, max 1000
- `isVerified`: boolean

### `api::reviews-category.reviews-category` (singleType, i18n enabled)
- Collection: `reviews_categories`
- Draft/Publish: `false`
- Fields (all localized json):
- `positive`
- `neutral`
- `negative`
- `question`

### `api::text-box.text-box` (collectionType, i18n enabled)
- Collection: `text_boxes`
- Draft/Publish: `false`
- Fields:
- `header`: string, localized
- `subheader`: string, localized
- `text`: text, localized
- `key`: string, required, non-localized
- `seo_title`: string, localized
- `seo_description`: string, localized

### `api::x-faq-category.x-faq-category` (collectionType, i18n enabled)
- Collection: `x_faq_categories`
- Draft/Publish: `false`
- Fields:
- `code`: string, required, localized
- `description`: text, localized
- `image`: media(image), single, localized
- `color`: enum(gray/red/orange/yellow/green/teal/blue/cyan/purple/pink + dark_* variants), localized
- `rank`: integer, localized
- `x_faqs`: relation oneToMany -> `api::x-faq.x-faq` (mappedBy `x_faq_category`)

### `api::x-faq.x-faq` (collectionType, i18n enabled)
- Collection: `x_faqs`
- Draft/Publish: `false`
- Fields:
- `question`: string, required, localized
- `response`: text, required, localized
- `x_faq_category`: relation manyToOne -> `api::x-faq-category.x-faq-category` (inversedBy `x_faqs`)

## Components

### `article.chapter`
- Collection: `components_article_chapters`
- Fields:
- `title`: string, max 200
- `text`: richtext, required
- `link`: component `shared.link`, repeatable
- `disclaimer`: component `article.disclaimer`, single

### `article.disclaimer`
- Collection: `components_article_disclaimers`
- Fields:
- `title`: string, max 300
- `text`: string, max 240
- `color`: enum(`green|red|yellow`), required, default `yellow`

### `shared.color`
- Collection: `components_shared_colors`
- Field:
- `color`: enum of gray/red/orange/.../dark_pink, required, default gray
- Note: enum values in JSON currently include leading spaces (for example `"    gray"`), which may be unintended.

### `shared.link`
- Collection: `components_shared_links`
- Fields:
- `text`: string, max 250, optional
- `href`: string
- `isExternal`: boolean, required, default `true`
- `isBlank`: boolean, required, default `true`

### `shared.meta-social`
- Collection: `components_shared_meta_socials`
- Fields:
- `socialNetwork`: enum(`Facebook|Twitter`), required
- `title`: string, required
- `description`: string, required
- `image`: media(single; allowed: images/files/videos)

### `shared.seo`
- Collection: `components_shared_seos`
- Fields:
- `metaTitle`: string, required, max 60
- `metaDescription`: string, required, min 50, max 160
- `metaImage`: media(single), required, allowed: images/files/videos
- `metaSocial`: component `shared.meta-social`, repeatable
- `keywords`: text, regex `[^,]+`
- `metaRobots`: string, regex `[^,]+`
- `structuredData`: json
- `metaViewport`: string
- `canonicalURL`: string

## Relation Map (Quick)
- `review` 1 -> N `review-reply`
- `x-faq-category` 1 -> N `x-faq`
- `main-text` embeds `shared.link`
- `article.chapter` embeds `shared.link[]` and `article.disclaimer`
- `shared.seo` embeds `shared.meta-social[]`

## Notes For Future Changes
- Many models are i18n-localized; when adding fields, explicitly decide localized vs non-localized.
- `review.review_categories` is defined as oneToMany without explicit inverse in `review-category`; verify intended direction before extending.
- `shared.color` enum values appear whitespace-prefixed and may need cleanup if used by exact match logic.

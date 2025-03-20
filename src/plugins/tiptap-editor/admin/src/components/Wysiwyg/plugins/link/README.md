# Link Plugin for Tiptap Editor

This plugin provides enhanced link functionality for the Tiptap editor, allowing users to create various types of links including custom URLs, internal page links, news entry links, and download links.

## Features

- Multiple link types:
  - Custom URL links
  - Internal page links (with record ID storage for dynamic URL generation)
  - News entry links (with record ID storage for dynamic URL generation)
  - Download links from media library
- Link styling options:
  - Regular link or button appearance
  - Target options (_self, _blank)
- Integrated with Strapi media library for file selection
- Automatic data fetching from Strapi API for pages and news entries
- Dynamic URL generation at render time to prevent inconsistencies when slugs change

## Components

### Core Components

- `LinkButton`: The toolbar button component for inserting/editing links
- `LinkDialog`: The modal dialog for configuring links
- `LinkExtension`: The Tiptap extension that defines the link mark with enhanced attributes

### Types

- `LinkAttributes`: TypeScript interface for link attributes
- `MediaFile`: TypeScript interface for media files
- `Page`: TypeScript interface for page data
- `NewsEntry`: TypeScript interface for news entry data

## Usage

The link plugin is integrated into the Tiptap editor toolbar. To use it:

1. Click the link button in the toolbar
2. Choose the type of link you want to create:
   - Custom URL: Enter a URL directly
   - Page: Select from available pages
   - News Entry: Select from available news entries
   - Download: Select a file from the media library
3. Choose the link style (link or button)
4. Choose the target (_self or _blank)
5. Click "Save" to insert the link

## Architecture

The link plugin is built using a modular architecture:

1. `LinkExtension`: Extends the Tiptap Link extension with additional attributes
2. `LinkButton`: The toolbar button component that opens the link dialog
3. `LinkDialog`: The modal dialog for configuring links
4. `types.ts`: TypeScript interfaces for the plugin

## API Integration

The plugin integrates with the Strapi API to fetch pages and news entries. It uses the following endpoints:

- `/api/pages?pagination[pageSize]=1000&populate=*`: To fetch available pages
- `/api/news-entries?pagination[pageSize]=1000&populate=*`: To fetch available news entries

It also integrates with the Strapi media library to allow users to select files for download links.

## Dynamic URL Generation

Instead of generating URLs at the time of link creation, this plugin stores the record type and ID in the link attributes. This approach has several advantages:

1. **Resilience to Slug Changes**: If a page or news entry's slug changes, the link will still work because it references the record ID, not the slug.
2. **Consistency**: URLs are always generated based on the current state of the database, ensuring consistency across the application.
3. **Flexibility**: The URL generation logic can be modified without having to update existing links.

The link attributes include:
- `recordType`: The type of record (e.g., "page" or "news")
- `recordId`: The ID of the record
- `href`: A placeholder URL in the format `{recordType}:{recordId}` that can be used to generate the actual URL at render time

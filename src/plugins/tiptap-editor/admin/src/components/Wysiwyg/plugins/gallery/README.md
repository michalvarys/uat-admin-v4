# Gallery Plugin for Tiptap Editor

This plugin provides a gallery component for the Tiptap editor that can be used in both the admin interface and on the frontend of your website.

## Features

- Image gallery with customizable layout
- Enhanced lightbox for viewing images:
  - Navigation arrows for browsing through images
  - Thumbnail strip for quick access to all gallery images
  - Keyboard navigation support (left/right arrow keys)
- Drag and drop reordering of images
- Customizable columns, spacing, and aspect ratio
- Can be used both in the Tiptap editor and as a standalone component

## Components

### Admin Interface Components

- `GalleryComponent`: The main component used in the Tiptap editor
- `TiptapChakraGallery`: The toolbar button component for inserting/editing galleries
- `GalleryDialog`: The dialog for configuring the gallery
- `GalleryExtension`: The Tiptap extension that defines the gallery node

### Frontend Components

- `StandaloneGallery`: A component that can be used outside of the Tiptap editor
- `GalleryDisplay`: The base component for displaying a gallery
- `FrontendGalleryExample`: An example of how to use the gallery on the frontend
- `FrontendGalleryFromHTML`: An example of how to extract gallery data from HTML

## Usage

### In the Admin Interface

The gallery plugin is already integrated into the Tiptap editor. You can use it by clicking the gallery button in the toolbar.

### On the Frontend

To use the gallery on the frontend, you can use the `StandaloneGallery` component:

```tsx
import { StandaloneGallery, GalleryAttributes } from 'path/to/gallery';

const MyComponent = () => {
  const galleryData: GalleryAttributes = {
    images: [
      {
        src: "https://example.com/image1.jpg",
        alt: "Example image 1",
        title: "Example image 1",
      },
      // More images...
    ],
    columns: 3,
    spacing: 4,
    aspectRatio: "1",
  };

  return (
    <div>
      <h2>My Gallery</h2>
      <StandaloneGallery attrs={galleryData} />
    </div>
  );
};
```

### Extracting Gallery Data from HTML

If you have HTML content from the Tiptap editor and want to extract the gallery data, you can use the approach shown in the `FrontendGalleryFromHTML` component:

```tsx
import { StandaloneGallery, GalleryAttributes } from 'path/to/gallery';

const MyComponent = ({ html }) => {
  // Parse the HTML to extract gallery data
  const parseGalleryData = (html: string): GalleryAttributes[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const galleryElements = doc.querySelectorAll('div[data-type="gallery"]');
    
    return Array.from(galleryElements).map((element) => {
      try {
        const dataGallery = element.getAttribute("data-gallery");
        if (!dataGallery) {
          return {
            images: [],
            columns: 3,
            spacing: 4,
            aspectRatio: "1",
          };
        }
        
        return JSON.parse(dataGallery);
      } catch (e) {
        console.error("Error parsing gallery data", e);
        return {
          images: [],
          columns: 3,
          spacing: 4,
          aspectRatio: "1",
        };
      }
    });
  };

  const galleries = parseGalleryData(html);

  return (
    <div>
      <h2>Galleries from HTML</h2>
      {galleries.map((gallery, index) => (
        <div key={index}>
          <StandaloneGallery attrs={gallery} />
        </div>
      ))}
    </div>
  );
};
```

## Architecture

The gallery plugin is built using a shared context architecture:

1. `GalleryContext`: Provides a shared state for all gallery components
2. `GalleryProvider`: Wraps the editor and provides the context
3. `useGalleryDialog`: A hook that provides access to the shared state
4. `GalleryComponent`: The component that renders the gallery in the editor
5. `GalleryDisplay`: The base component for displaying a gallery
6. `StandaloneGallery`: A wrapper around GalleryDisplay for use outside the editor

This architecture ensures that all components share the same state and can communicate with each other.

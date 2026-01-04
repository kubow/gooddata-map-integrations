# MapTiler Map Integration

MapLibre-based service with multiple visualization modes integrated with GoodData.

## Screenshot

![MapTiler Map](./screenshot.png)
*Add screenshot here*

## Key Dependencies

```json
{
  "@gooddata/sdk-ui": "^11.x",
  "@gooddata/sdk-backend-tiger": "^11.x",
  "@gooddata/sdk-model": "^11.x",
  "@maptiler/sdk": "^2.x",
  "react": "^18.3.x",
  "typescript": "^5.x"
}
```

## Features

- Multiple visualization modes: markers and heatmap
- Various map styles (streets, outdoor, satellite, etc.)
- Interactive markers with popups
- Heatmap density visualization
- Advanced features: polygons, clustering, 3D terrain

## Setup

Requires MapTiler API key in `.env`:
```env
VITE_MAPTILER_TOKEN=your_maptiler_token
```

Get your free API key at [MapTiler Cloud](https://cloud.maptiler.com/)

## Run Locally

```bash
cd maptiler
npm install
npm start
```

## Documentation

- [MapTiler SDK Documentation](https://docs.maptiler.com/sdk-js/)
- [MapTiler Examples](https://docs.maptiler.com/sdk-js/examples/)


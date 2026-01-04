# MapBox Map Integration

Professional mapping service with beautiful styles integrated with GoodData.

## Screenshot

![MapBox Map](./screenshot.png)
*Add screenshot here*

## Key Dependencies

```json
{
  "@gooddata/sdk-ui": "^11.x",
  "@gooddata/sdk-backend-tiger": "^11.x",
  "@gooddata/sdk-model": "^11.x",
  "mapbox-gl": "^3.x",
  "react": "^18.3.x",
  "typescript": "^5.x"
}
```

## Features

- High-quality map styles
- Custom data visualizations
- Interactive markers with popups
- Professional appearance

## Setup

Requires MapBox API key in `.env`:
```env
VITE_MAPBOX_TOKEN=your_mapbox_token
```

Get your free API key at [MapBox](https://www.mapbox.com/)

## Run Locally

```bash
cd mapbox
npm install
npm start
```

## Documentation

[MapBox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)


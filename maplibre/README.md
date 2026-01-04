# MapLibre GL JS Integration

Open-source mapping library integrated with GoodData - no API key required!

## Screenshot

![MapLibre](./screenshot.png)
*Add screenshot here*

## Key Dependencies

```json
{
  "@gooddata/sdk-ui": "^11.14.0",
  "@gooddata/sdk-backend-tiger": "^11.14.0",
  "@gooddata/sdk-model": "^11.14.0",
  "maplibre-gl": "^4.7.1",
  "react": "^18.3.1",
  "typescript": "^5.3.3"
}
```

## Features

- **No API key required!** Uses free OpenStreetMap tiles
- Multiple visualization modes: markers and heatmap
- Interactive markers with popups
- Heatmap density visualization
- Open-source and free to use
- Lightweight and performant

## Setup

No API keys needed! Just install and run:

```bash
cd mapcn
npm install
npm start
```

The application will start on http://localhost:8080

## Configuration

Update your `.env` file in the root directory:
```env
# GoodData Configuration (required)
VITE_BACKEND_URL=https://your-gooddata-instance.com
VITE_TIGER_API_TOKEN=your_gooddata_token
VITE_WORKSPACE=your_workspace_id
```

**No map API key needed!** MapLibre uses free OpenStreetMap tiles.

## Data Requirements

Your GoodData workspace should have:
- Location attributes with latitude and longitude display forms
- Customer or location-based measures (e.g., TotalCustomers)
- Properly configured catalog.ts (run `npm run refresh-md` to regenerate)

## Documentation

- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js/docs/)
- [MapLibre Examples](https://maplibre.org/maplibre-gl-js/docs/examples/)
- [GoodData.UI Documentation](https://sdk.gooddata.com/gooddata-ui/)

## Features in Detail

### Marker Mode
- Displays each location as a colored marker
- Click markers to see detailed information
- Color intensity represents data values
- Auto-zoom to fit all markers

### Heatmap Mode
- Shows data density and concentration
- Smooth gradient visualization
- Adjustable radius and opacity
- Optimized for large datasets

## Why MapLibre?

- ✅ **100% Free** - No API keys, no usage limits
- ✅ **Open Source** - MIT licensed, fork of Mapbox GL JS
- ✅ **Performant** - WebGL-based rendering
- ✅ **Feature-rich** - Heatmaps, 3D terrain, vector tiles
- ✅ **Privacy-friendly** - Uses OpenStreetMap tiles
- ✅ **No vendor lock-in** - Complete control

## Troubleshooting

**Map not loading:**
- Check browser console for errors
- Ensure your GoodData workspace has location data
- Verify network connectivity (needs to fetch OSM tiles)

**No data showing:**
- Run `npm run refresh-md` to update catalog.ts
- Check that latitude/longitude display forms are configured
- Verify GoodData workspace permissions

**Build errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (18+ required)

## License

LicenseRef-LICENSE

## About MapLibre

MapLibre GL JS is an open-source library for publishing maps on your websites. Fast displaying of maps is possible thanks to GPU-accelerated vector tile rendering. It originated as an open-source fork of mapbox-gl-js and is maintained by the MapLibre community.

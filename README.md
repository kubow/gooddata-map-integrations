# GoodData Map Integrations

Examples of integrating GoodData analytics with popular mapping libraries using React, TypeScript, and Vite.

## Technology Stack

- Node.js 18+ (managed via `nvm use`)
- **React** 18.3
- **TypeScript** 5
- **Vite** 5 (dev server & bundler)
- **GoodData Cloud** workspace with location attributes (latitude/longitude display forms)
- **GoodData SDK** for data extraction
- Various mapping libraries (see Available integrations)

## Available Integrations

| Service                              | API Key Required | Free to use      | Notes                                                                                                          |
| ------------------------------------ | ---------------- | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| [GoodData Geo](./gooddata/README.md) | No               | ✅                | Part of GoodData license<br>Uses GoodData's `GeoPushpinChart` component                                        |
| [Leaflet](./leaflet/README.md)       | No               | ✅                | Uses free OpenStreetMap<br>Lightweight, mobile-friendly open-source                                            |
| [OpenLayers](./openlayers/README.md) | No               | ✅                | Uses free OpenStreetMap<br>Powerful open-source library with advanced features.                                |
| [MapBox](./mapbox/README.md)         | Yes              | 50k loads/month  | [MapBox Pricing](https://www.mapbox.com/pricing)<br>Professional mapping service with beautiful styles         |
| [MapTiler](./maptiler/README.md)     | Yes              | 100k tiles/month | [MapTiler Pricing](https://www.maptiler.com/cloud/pricing)<br>multiple visualization modes (based on MapLibre) |
| [MapLibre](./maplibre/README.md)     | No               | ✅                | Uses free OpenStreetMap                                                                                        |

## Quick Start

### Setup

1. **Clone and install dependencies:**
   ```bash
   # Install in root
   npm install
   
   # Or in specific integration
   cd leaflet && npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.template .env
   ```

   Edit `.env` in the **root folder**:
   ```env
   VITE_BACKEND=https://your-gooddata-instance.com
   VITE_WORKSPACE=your_workspace_id
   VITE_TIGER_API_TOKEN=your_api_token
   
   # For MapBox (optional)
   VITE_MAPBOX_TOKEN=your_mapbox_token
   
   # For MapTiler (optional)
   VITE_MAPTILER_TOKEN=your_maptiler_token
   ```

3. **Update catalog (for live data):**
   ```bash
   cd leaflet  # or any integration
   npm run refresh-md
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Open browser:**
   - Default: http://localhost:5173 (or port shown in terminal)

## Data Requirements

Your GoodData workspace needs location attributes with geo display forms:

```typescript
// Example: CustomerCity attribute
{
  Default: "City Name",
  CityPushpinLatitude: "40.7128",
  CityPushpinLongitude: "-74.0060"
}
```

### How to add geo display forms in GoodData:
1. Navigate to **Data → Attributes**
2. Select your location attribute
3. Add display forms with **Geo Pushpin** type
4. Map to latitude/longitude columns

## Project Structure

```
gooddata-map-integrations/
├── .env                      # Environment config (create from .env.template)
├── gooddata/                 # GoodData native component
├── leaflet/                  # Leaflet integration
├── mapbox/                   # MapBox integration
├── mapcn/                    # MapLibre GL JS integration
├── maptiler/                 # MapTiler integration
└── openlayers/               # OpenLayers integration
```

Each integration follows a similar structure:
```
integration/
├── src/
│   ├── example/
│   │   ├── Example.tsx              # Main component
│   │   ├── *DataLoader.tsx          # GoodData data fetching
│   │   ├── *Map.tsx                 # Map rendering
│   │   └── *MapDemo.tsx             # Demo with sample data
│   ├── App.tsx                      # React app wrapper
│   ├── backend.ts                   # GoodData backend config
│   └── catalog.ts                   # Generated semantic model
└── package.json
```

## Key Features

### Data Extraction Pattern

All integrations use GoodData's execution API with display forms:

```typescript
import { useExecutionDataView } from "@gooddata/sdk-ui";

const execution = backend
  .workspace(workspace)
  .execution()
  .forItems([
    Md.CustomerCity.Default,              // City name
    Md.CustomerCity.CityPushpinLatitude,  // Latitude
    Md.CustomerCity.CityPushpinLongitude, // Longitude
    Md.TotalCustomers,                    // Measure
  ])
  .withDimensions(...);

const { result } = useExecutionDataView({ execution });
```

### Common Features
- ✅ Interactive markers with popups
- ✅ Dynamic coloring based on values
- ✅ Auto-centering on data bounds
- ✅ Demo mode (works without GoodData)
- ✅ Error handling and loading states

## Resources

### GoodData
- [GoodData.UI Documentation](https://www.gooddata.com/docs/gooddata-ui/latest/)
- [GitHub Examples](https://github.com/gooddata/gooddata-ui-sdk/tree/master/examples/sdk-interactive-examples#gooddataui-sdk---interactive-examples)
- [Execution Model](https://www.gooddata.com/docs/cloud/api-and-sdk/create-visualization/execution-model/)

### Alternative
- [Carto](https://clausa.app.carto.com) - Another interesting mapping option

## License

(C) 2017-2026 GoodData Corporation

This repository is under the GoodData commercial license available in the [LICENSE](LICENSE) file.

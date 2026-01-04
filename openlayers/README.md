# OpenLayers Map Integration

Powerful open-source library with advanced features integrated with GoodData.

## Screenshot

![OpenLayers Map](./screenshot.png)
*Add screenshot here*

## Key Dependencies

```json
{
  "@gooddata/sdk-ui": "^11.x",
  "@gooddata/sdk-backend-tiger": "^11.x",
  "@gooddata/sdk-model": "^11.x",
  "ol": "^9.x",
  "react": "^18.3.x",
  "typescript": "^5.x"
}
```

## Features

- No API key required (uses OpenStreetMap)
- Simple mode: City markers
- Advanced mode: State polygons + city points (choropleth)
- Full control over map features
- Supports custom projections and layers

## Run Locally

```bash
cd openlayers
npm install
npm start
```

## Visualization Modes

- **Simple**: Interactive city markers
- **Advanced**: State polygons colored by data + city markers on top

## Documentation

[OpenLayers Documentation](https://openlayers.org/)


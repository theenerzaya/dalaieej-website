"use client";

import accessRoadTrace from "@/app/data/accessRoadTrace.json";
import { CTALink } from "@/app/components/ui/Typography";
import { dalaiEejMapStyles } from "@/lib/googleMapStyles";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useMemo } from "react";
import { useLocale } from "next-intl";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

const ROUTE_PATH = accessRoadTrace.path;
const WAYPOINTS = accessRoadTrace.waypoints;

const pinSvg = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
  )}`;

type Props = {
  className?: string;
};

export default function AccessRoadMap({ className = "" }: Props) {
  const locale = useLocale();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    preventGoogleFontsLoading: true,
  });

  const bounds = useMemo(
    () => ({
      north: accessRoadTrace.bounds.north,
      south: accessRoadTrace.bounds.south,
      east: accessRoadTrace.bounds.east,
      west: accessRoadTrace.bounds.west,
    }),
    []
  );

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      const b = new google.maps.LatLngBounds(
        { lat: bounds.south, lng: bounds.west },
        { lat: bounds.north, lng: bounds.east }
      );
      map.fitBounds(b, { top: 48, right: 48, bottom: 48, left: 48 });
    },
    [bounds]
  );

  const polylineOptions = useMemo<google.maps.PolylineOptions>(
    () => ({
      strokeColor: "#C9A86A",
      strokeOpacity: 0.95,
      strokeWeight: 4,
      geodesic: true,
    }),
    []
  );

  if (!apiKey) {
    return (
      <div
        className={`flex aspect-[16/10] w-full flex-col items-center justify-center gap-4 rounded-sm bg-leaf/10 px-6 text-center ${className}`}
      >
        <p className="font-body text-sm text-ink/70 max-w-md">
          {locale === "mn"
            ? "Төв замаас салж ресортын зогсоол хүрэх албан ёсны замын GPS мэдээлэл."
            : "GPS trace of the official resort access road from the main-road turnoff to guest parking."}
        </p>
        <CTALink href={accessRoadTrace.kmlPath} external>
          {locale === "mn" ? "GPS зам татах (KML)" : "Download GPS Route (KML)"}
        </CTALink>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`flex aspect-[16/10] w-full items-center justify-center rounded-sm bg-leaf/10 px-6 ${className}`}
      >
        <p className="font-body text-sm text-ink/60">
          {locale === "mn" ? "Газрын зураг ачааллаж чадсангүй." : "Map could not be loaded."}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-ink/5">
        {!isLoaded ? (
          <div className="absolute inset-0 animate-pulse bg-leaf/10" aria-hidden />
        ) : (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={ROUTE_PATH[0]}
            zoom={13}
            onLoad={onMapLoad}
            options={{
              styles: dalaiEejMapStyles,
              disableDefaultUI: true,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              clickableIcons: false,
            }}
          >
            <Polyline path={ROUTE_PATH} options={polylineOptions} />
            {WAYPOINTS.map((wp, i) => (
              <Marker
                key={wp.name}
                position={{ lat: wp.lat, lng: wp.lng }}
                title={wp.name}
                icon={{
                  url: pinSvg(
                    i === 0 ? "#F5F5F0" : i === WAYPOINTS.length - 1 ? "#C9A86A" : "#8FA89A"
                  ),
                  scaledSize: new google.maps.Size(32, 32),
                  anchor: new google.maps.Point(16, 32),
                }}
              />
            ))}
          </GoogleMap>
        )}
      </div>
      <div className="mt-4">
        <CTALink href={accessRoadTrace.kmlPath} external>
          {locale === "mn" ? "GPS зам татах (KML)" : "Download GPS Route (KML)"}
        </CTALink>
      </div>
    </div>
  );
}

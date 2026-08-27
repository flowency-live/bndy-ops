/**
 * bndy — Neon Map Marker System · React + Mapbox GL components
 * ------------------------------------------------------------
 * Pairs with design-kit/markers.css (import once, app-level).
 * Visual reference / source of truth: design-kit/marker-kit.html
 *
 * Two ways to use:
 *   1. <GigMarker/>, <VenueMarker/>, <ClusterMarker/>, <UserLocationMarker/>
 *      — plain components, render them into a Mapbox marker element via
 *      createPortal (see useMapboxMarker hook at the bottom).
 *   2. createMarkerElement(props) — imperative factory returning a DOM
 *      element for `new mapboxgl.Marker({ element, anchor: 'center' })`,
 *      handy inside cluster render loops without portals.
 *
 * Theming: add className "theme-light" to the map container when the app
 * is in light mode — markers restyle via CSS, no prop changes needed.
 */

import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import mapboxgl from 'mapbox-gl';

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const clusterTier = (count) => (count >= 10 ? 'lg' : count >= 5 ? 'md' : 'sm');

const cx = (...parts) => parts.filter(Boolean).join(' ');

/** Random delay so the breathing dots shimmer instead of pulsing in sync. */
const useBreatheDelay = () =>
  useMemo(() => ({ animationDelay: `${(Math.random() * 2.8).toFixed(2)}s` }), []);

const Label = ({ label, sub }) =>
  label ? (
    <span className="bndy-mk-label">
      {label}
      {sub ? <span className="sub">{sub}</span> : null}
    </span>
  ) : null;

/* ------------------------------------------------------------------ */
/* 1 · Gig map — single event dot                                      */
/* ------------------------------------------------------------------ */

/**
 * @param {object}  p
 * @param {boolean} p.isTonight  event date === today → sonar ping
 * @param {boolean} p.selected
 * @param {string}  [p.label]    e.g. artist name (shows on hover/selected)
 * @param {string}  [p.sub]      e.g. "8:00 PM"
 * @param {func}    [p.onClick]
 */
export function GigMarker({ isTonight, selected, label, sub, onClick }) {
  const delay = useBreatheDelay();
  return (
    <div
      className={cx(
        'bndy-mk bndy-mk--dot bndy-mk--gig',
        isTonight && 'bndy-mk--tonight',
        selected && 'is-selected',
      )}
      style={delay}
      onClick={onClick}
      role="button"
      aria-label={label ? `Gig: ${label}` : 'Gig'}
    >
      <Label label={label} sub={sub} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · Venue mode — single venue dot                                   */
/* ------------------------------------------------------------------ */

/**
 * @param {object}  p
 * @param {boolean} p.hasGigs   true → pink full-bloom, false → dimmed cyan
 * @param {number}  [p.gigCount] used for the label sub ("3 gigs")
 * @param {boolean} p.selected
 * @param {string}  [p.label]   venue name
 */
export function VenueMarker({ hasGigs, gigCount, selected, label, onClick }) {
  const delay = useBreatheDelay();
  return (
    <div
      className={cx(
        'bndy-mk bndy-mk--dot',
        hasGigs ? 'bndy-mk--venue-live' : 'bndy-mk--venue-idle',
        selected && 'is-selected',
      )}
      style={hasGigs ? delay : undefined}
      onClick={onClick}
      role="button"
      aria-label={label ? `Venue: ${label}` : 'Venue'}
    >
      <Label
        label={label}
        sub={hasGigs && gigCount ? `${gigCount} gig${gigCount === 1 ? '' : 's'}` : undefined}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · Clusters (both modes)                                           */
/* ------------------------------------------------------------------ */

/**
 * @param {object} p
 * @param {number} p.count
 * @param {'gig'|'venue-live'|'venue-idle'} p.kind
 * @param {boolean} p.selected
 */
export function ClusterMarker({ count, kind = 'gig', selected, onClick }) {
  return (
    <div
      className={cx(
        'bndy-mk bndy-mk--cluster',
        `bndy-mk--${kind}`,
        `bndy-mk--${clusterTier(count)}`,
        selected && 'is-selected',
      )}
      onClick={onClick}
      role="button"
      aria-label={`${count} ${kind === 'gig' ? 'gigs' : 'venues'} — zoom in`}
    >
      {count}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · User location                                                   */
/* ------------------------------------------------------------------ */

export function UserLocationMarker() {
  return <div className="bndy-mk bndy-mk--user" aria-label="Your location" />;
}

/* ------------------------------------------------------------------ */
/* 5 · Imperative factory (no React render needed)                    */
/* ------------------------------------------------------------------ */

/**
 * createMarkerElement({ type, ...opts }) → HTMLElement for mapboxgl.Marker.
 *
 * type: 'gig' | 'venue' | 'cluster' | 'user'
 *   gig:     { isTonight, selected, label, sub }
 *   venue:   { hasGigs, gigCount, selected, label }
 *   cluster: { count, kind: 'gig'|'venue-live'|'venue-idle', selected }
 *   user:    {}
 */
export function createMarkerElement(opts) {
  const el = document.createElement('div');
  const labelHtml = (label, sub) =>
    label
      ? `<span class="bndy-mk-label">${escapeHtml(label)}${
          sub ? `<span class="sub">${escapeHtml(sub)}</span>` : ''
        }</span>`
      : '';

  switch (opts.type) {
    case 'gig':
      el.className = cx(
        'bndy-mk bndy-mk--dot bndy-mk--gig',
        opts.isTonight && 'bndy-mk--tonight',
        opts.selected && 'is-selected',
      );
      el.style.animationDelay = `${(Math.random() * 2.8).toFixed(2)}s`;
      el.innerHTML = labelHtml(opts.label, opts.sub);
      break;

    case 'venue':
      el.className = cx(
        'bndy-mk bndy-mk--dot',
        opts.hasGigs ? 'bndy-mk--venue-live' : 'bndy-mk--venue-idle',
        opts.selected && 'is-selected',
      );
      if (opts.hasGigs) el.style.animationDelay = `${(Math.random() * 2.8).toFixed(2)}s`;
      el.innerHTML = labelHtml(
        opts.label,
        opts.hasGigs && opts.gigCount
          ? `${opts.gigCount} gig${opts.gigCount === 1 ? '' : 's'}`
          : undefined,
      );
      break;

    case 'cluster':
      el.className = cx(
        'bndy-mk bndy-mk--cluster',
        `bndy-mk--${opts.kind ?? 'gig'}`,
        `bndy-mk--${clusterTier(opts.count)}`,
        opts.selected && 'is-selected',
      );
      el.textContent = String(opts.count);
      break;

    case 'user':
      el.className = 'bndy-mk bndy-mk--user';
      break;

    default:
      throw new Error(`Unknown marker type: ${opts.type}`);
  }
  return el;
}

function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/* ------------------------------------------------------------------ */
/* 6 · React ↔ Mapbox bridge                                           */
/* ------------------------------------------------------------------ */

/**
 * useMapboxMarker — mounts a React-rendered marker on the map.
 *
 *   const portal = useMapboxMarker(map, [lng, lat],
 *     <VenueMarker hasGigs label="The Friendship" gigCount={3} />);
 *   return <>{portal}</>;
 *
 * Keep markers in a list and render all portals from your Map component.
 */
export function useMapboxMarker(map, lngLat, children) {
  const elRef = useRef(null);
  if (!elRef.current && typeof document !== 'undefined') {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    if (!map || !elRef.current) return undefined;
    const marker = new mapboxgl.Marker({ element: elRef.current, anchor: 'center' })
      .setLngLat(lngLat)
      .addTo(map);
    return () => marker.remove();
  }, [map, lngLat?.[0], lngLat?.[1]]);

  return elRef.current ? createPortal(children, elRef.current) : null;
}

/* ------------------------------------------------------------------ */
/* Implementation notes for the map page                               */
/* ------------------------------------------------------------------ */
/*
 * CLUSTERING — use Mapbox GL's native clustering on the GeoJSON source:
 *   map.addSource('gigs', { type: 'geojson', data, cluster: true,
 *     clusterMaxZoom: 13, clusterRadius: 46 });
 * Then render HTML markers from the clustered features on 'render'
 * (query via map.querySourceFeatures('gigs')), diffing by cluster_id /
 * feature id so markers persist between frames. Singles get GigMarker /
 * VenueMarker; features with point_count get ClusterMarker.
 *
 * VENUE MODE — pass kind 'venue-live' or 'venue-idle' to clusters. If a
 * cluster mixes live + idle venues, prefer 'venue-live' (action wins).
 * To make this cheap, put hasGigs in feature properties and use
 * clusterProperties: { hasLive: ['any', ['get', 'hasGigs']] }.
 *
 * SELECTED — only one marker selected at a time; set selected=true and
 * the CSS handles halo/scale/label. Clear on map click.
 *
 * THEME — toggle 'theme-light' class on the map container div alongside
 * your existing Tailwind dark-mode switch.
 *
 * Z-ORDER — hover/selected bump z-index via CSS (5/6); Mapbox markers
 * are absolutely-positioned siblings so this Just Works.
 */

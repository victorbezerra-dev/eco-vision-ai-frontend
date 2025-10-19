import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import * as L from "leaflet";
import { Subscription, timer } from "rxjs";
import { switchMap } from "rxjs/operators";
import { DetectionItem } from "src/app/models/detection";
import { DetectionsService } from "src/app/services/detections.service";

@Component({
  selector: "app-urban-degradation-map",
  templateUrl: "./urban-degradation-map.component.html",
  styleUrls: ["./urban-degradation-map.component.scss"],
})
export class UrbanDegradationMapComponent implements AfterViewInit, OnDestroy {
  @Input() title = "Mapa de Degradação Urbana";
  @Input() center: L.LatLngExpression = [-8.7620, -63.9039];
  @Input() zoom = 13;

  @Input() refreshMs = 0;

  @Output() addNew = new EventEmitter<void>();

  public map!: L.Map;
  private pointsLayer = L.layerGroup();
  private autoRefreshSub?: Subscription;

  constructor(private service: DetectionsService) {}

  alertIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 28px; height: 28px;
        background: linear-gradient(135deg, #da5d5dff, #f00000ff);
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        display: flex; align-items: center; justify-content: center;
        color: white; font-size: 16px; font-weight: bold;
      ">!</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -24],
  });

  ngAfterViewInit(): void {
    this.map = L.map("udm-map", {
      center: this.center,
      zoom: this.zoom,
      zoomControl: true,
      preferCanvas: true,
    });

    (L.Icon.Default as any).mergeOptions({
      iconRetinaUrl: "assets/leaflet/marker-icon-2x.png",
      iconUrl: "assets/leaflet/marker-icon.png",
      shadowUrl: "assets/leaflet/marker-shadow.png",
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap",
    }).addTo(this.map);

    this.pointsLayer.addTo(this.map);
    setTimeout(() => this.map?.invalidateSize(), 0);
    window.addEventListener("resize", this.handleResize, false);

    this.loadPoints();

    if (this.refreshMs && this.refreshMs > 0) {
      this.autoRefreshSub = timer(this.refreshMs, this.refreshMs)
        .pipe(switchMap(() => this.service.getDetections()))
        .subscribe({
          next: (items) => this.plot(items as DetectionItem[]),
          error: (err) => console.error("Erro no auto refresh:", err),
        });
    }
  }

  private loadPoints(): void {
    this.service.getDetections().subscribe({
      next: (items) => {
        console.log("Itens recebidos:", items);
        this.plot(items as DetectionItem[]);
      },
      error: (err) => console.error("Erro ao carregar detecções:", err),
    });
  }

  private plot(items: DetectionItem[]): void {
    this.pointsLayer.clearLayers();
    const bounds = L.latLngBounds([]);
    if (!items || items.length === 0) return;

    const groups = new Map<string, DetectionItem[]>();
    for (const it of items) {
      const key = `${it.lat.toFixed(6)}_${it.long.toFixed(6)}`;
      const arr = groups.get(key);
      if (arr) arr.push(it);
      else groups.set(key, [it]);
    }

    for (const [, group] of groups) {
      if (group.length === 1) {
        this.addMarker(group[0].lat, group[0].long, group[0], bounds);
      } else {
        const n = group.length;
        const radiusMeters = 8; 
        for (let i = 0; i < n; i++) {
          const angle = (2 * Math.PI * i) / n;
          const dx = radiusMeters * Math.cos(angle);
          const dy = radiusMeters * Math.sin(angle);
          const [latOff, lngOff] = this.offsetByMeters(
            group[0].lat,
            group[0].long,
            dx,
            dy
          );
          this.addMarker(latOff, lngOff, group[i], bounds);
        }
      }
    }

    if (bounds.isValid()) this.map.fitBounds(bounds.pad(0.2));
  }
  private offsetByMeters(
    lat: number,
    lng: number,
    metersEast: number,
    metersNorth: number
  ): [number, number] {
    const R = 6378137;
    const dLat = (metersNorth / R) * (180 / Math.PI);
    const dLng =
      (metersEast / (R * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);
    return [lat + dLat, lng + dLng];
  }

  private addMarker(
    lat: number,
    lng: number,
    it: DetectionItem,
    bounds: L.LatLngBounds
  ): void {
    const marker = L.circleMarker([lat, lng], {
      radius: 8,
      color: this.colorForTipo(it.tipo?.[0]),
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    });

    const dateStr = this.formatLocalDate(it.data);
    const popupHtml = `
    <div style="min-width:220px">
      <div style="font-weight:600;margin-bottom:4px">ID: ${it.id}</div>
      <div style="font-size:12px;margin-bottom:6px">
        <div><b>Data:</b> ${dateStr}</div>
        <div><b>Lat/Lng:</b> ${it.lat.toFixed(6)}, ${it.long.toFixed(6)}</div>
        <div><b>Tipo:</b> ${it.tipo?.join(", ") || "-"}</div>
      </div>
      <a href="${it.url_image}" target="_blank" rel="noopener">
        <img src="${it.url_image}" alt="detecção ${
      it.id
    }" style="width:100%;border-radius:8px;display:block"/>
      </a>
    </div>
  `;
    marker.bindPopup(popupHtml, { maxWidth: 360 });
    marker.addTo(this.pointsLayer);
    bounds.extend([lat, lng]);
  }

  private colorForTipo(tipo?: string): string {
    const palette: Record<string, string> = {
      "5": "#1f77b4",
      "17": "#d62728",
      "1": "#2ca02c",
      "2": "#ff7f0e",
      "3": "#9467bd",
    };
    return (tipo && palette[tipo]) || "#333333";
  }

  private formatLocalDate(iso: string): string {
    try {
      const d = new Date(iso);
      return d.toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  public resetView(): void {
    this.map?.setView(this.center as L.LatLngExpression, this.zoom);
  }

  public onAddNewClick(): void {
    this.addNew.emit();
  }

  private handleResize = () => {
    this.map?.invalidateSize();
  };

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.handleResize, false);
    this.map?.remove();
    this.autoRefreshSub?.unsubscribe();
  }
}

import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import * as L from "leaflet";

@Component({
  selector: "app-urban-degradation-map",
  templateUrl: "./urban-degradation-map.component.html",
  styleUrls: ["./urban-degradation-map.component.scss"],
})
export class UrbanDegradationMapComponent implements AfterViewInit, OnDestroy {
  @Input() title = "Mapa de Degradação Urbana";
  @Input() center: L.LatLngExpression = [-23.55052, -46.63331];
  @Input() zoom = 12;

  @Output() addNew = new EventEmitter<void>();

  public map!: L.Map;

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
    });

    (L.Icon.Default as any).mergeOptions({
      iconRetinaUrl: "assets/leaflet/marker-icon-2x.png",
      iconUrl: "assets/leaflet/marker-icon.png",
      shadowUrl: "assets/leaflet/marker-shadow.png",
    });

    L.marker(this.center, { icon: this.alertIcon })
      .addTo(this.map)
      .bindPopup("<b>Ponto de degradação</b><br/>Lixo acumulado na rua.");

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap",
    }).addTo(this.map);

    setTimeout(() => this.map?.invalidateSize(), 0);
    window.addEventListener("resize", this.handleResize, false);
  }

  public resetView(): void {
    this.map?.setView(this.center as L.LatLngExpression, this.zoom);
  }

  /** 👉 método chamado pelo botão “+ Adicionar novo” */
  public onAddNewClick(): void {
    this.addNew.emit();
  }

  private handleResize = () => {
    this.map?.invalidateSize();
  };

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.handleResize, false);
    this.map?.remove();
  }
}

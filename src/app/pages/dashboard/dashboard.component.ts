import { Component, OnInit, OnDestroy } from "@angular/core";
import { StatsService } from "src/app/services/stats.service";
import { ClusterStats } from "src/app/models/stats";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public datasets: any;
  public data: any;
  public salesChart: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  stats: ClusterStats[] = [];
  loading = false;
  errorMsg: string | null = null;

  showZip = false;

  private sub?: Subscription;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40],
    ];
    this.data = this.datasets[0];

    this.loadStats();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private loadStats(): void {
    console.log("ihuuulll")
    this.loading = true;
    this.errorMsg = null;

    this.sub = this.statsService.fetchStats().subscribe({
      next: (arr) => {
        this.stats = arr || [];
        console.log(this.stats)
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar stats', err);
        this.errorMsg = 'Não foi possível carregar as estatísticas.';
        this.loading = false;
      }
    });
  }

  onAddNewPoint(): void {
    this.showZip = true;
  }

  closeZip(): void {
    this.showZip = false;
  }

  public updateOptions() {
    if (!this.salesChart) return;
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }
}

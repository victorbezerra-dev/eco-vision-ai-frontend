import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrbanDegradationMapComponent } from './urban-degradation-map.component';

describe('UrbanDegradationMapComponent', () => {
  let component: UrbanDegradationMapComponent;
  let fixture: ComponentFixture<UrbanDegradationMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UrbanDegradationMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrbanDegradationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

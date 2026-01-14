import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProcessingStep } from '../../models/invoice.model';

@Component({
  selector: 'app-processing-state',
  templateUrl: './processing-state.component.html',
  styleUrls: ['./processing-state.component.scss']
})
export class ProcessingStateComponent implements OnInit, OnDestroy {

  steps: ProcessingStep[] = [
    { text: 'Reading document structure', completed: false, current: true },
    { text: 'Identifying products and prices', completed: false, current: false },
    { text: 'Validating customer information', completed: false, current: false }
  ];

  private timers: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.startProgressAnimation();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private startProgressAnimation(): void {
    // Step 1 -> Step 2 after 1.5 seconds
    this.timers.push(
      setTimeout(() => {
        this.steps[0].completed = true;
        this.steps[0].current = false;
        this.steps[1].current = true;
      }, 1500)
    );

    // Step 2 -> Step 3 after 3 seconds
    this.timers.push(
      setTimeout(() => {
        this.steps[1].completed = true;
        this.steps[1].current = false;
        this.steps[2].current = true;
      }, 3000)
    );
  }

  private clearTimers(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
  }
}

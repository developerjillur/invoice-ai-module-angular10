import { Component, OnInit, Input } from '@angular/core';
import { WorkflowStep } from '../../models/invoice.model';

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss']
})
export class StepIndicatorComponent implements OnInit {

  @Input() currentStep: number = 1;
  @Input() steps: WorkflowStep[] = [];

  constructor() { }

  ngOnInit(): void { }

  isCompleted(index: number): boolean {
    return index + 1 < this.currentStep;
  }

  isCurrent(index: number): boolean {
    return index + 1 === this.currentStep;
  }

  isUpcoming(index: number): boolean {
    return index + 1 > this.currentStep;
  }

  getConnectorClass(index: number): string {
    if (this.isCompleted(index)) {
      return 'completed';
    }
    return '';
  }
}

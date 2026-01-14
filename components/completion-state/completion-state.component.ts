import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-completion-state',
  templateUrl: './completion-state.component.html',
  styleUrls: ['./completion-state.component.scss']
})
export class CompletionStateComponent implements OnInit {

  @Input() orderNumber: string = '';
  @Output() reset = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void { }

  onReset(): void {
    this.reset.emit();
  }
}

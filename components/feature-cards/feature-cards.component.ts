import { Component, OnInit } from '@angular/core';
import { Feature } from '../../models/invoice.model';

@Component({
  selector: 'app-feature-cards',
  templateUrl: './feature-cards.component.html',
  styleUrls: ['./feature-cards.component.scss']
})
export class FeatureCardsComponent implements OnInit {

  features: Feature[] = [
    {
      icon: 'cloud_upload',
      title: 'Easy Upload',
      description: 'Drag and drop or select files directly. Supports Excel and PDF formats.',
      iconBg: 'bg-emerald',
      iconColor: 'text-emerald'
    },
    {
      icon: 'check_circle',
      title: 'Automatic Conversion',
      description: 'AI-powered extraction of products, prices, and customer information.',
      iconBg: 'bg-emerald',
      iconColor: 'text-emerald'
    },
    {
      icon: 'account_balance',
      title: 'Accounting Integration',
      description: 'Automatically syncs with your existing accounting system.',
      iconBg: 'bg-slate',
      iconColor: 'text-slate'
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}

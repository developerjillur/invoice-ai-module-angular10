import { Component, OnInit } from '@angular/core';

interface NavItem {
  label: string;
  href: string;
  active: boolean;
}

@Component({
  selector: 'app-invoice-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navItems: NavItem[] = [
    { label: 'Orders', href: '#', active: true },
    { label: 'Products', href: '#', active: false },
    { label: 'Customers', href: '#', active: false },
    { label: 'Import', href: '#', active: false }
  ];

  constructor() { }

  ngOnInit(): void { }

  setActiveItem(item: NavItem): void {
    this.navItems.forEach(nav => nav.active = false);
    item.active = true;
  }
}

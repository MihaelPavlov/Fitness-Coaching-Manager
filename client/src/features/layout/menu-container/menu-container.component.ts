import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

export interface MenuItemInterface {
  label: string;
  class: string;
  enabled: boolean;
  visible: boolean;
  icon: string;
  route: string;
  translatable?: boolean;
}

@Component({
  selector: 'app-menu-container',
  templateUrl: 'menu-container.component.html',
  styleUrl: 'menu-container.component.scss',
})
export class MenuContainerComponent {
  @ViewChild('sidebar') sidebarElement!: ElementRef;
  public menuItems: MenuItemInterface[] = [];
  public settingsMenuItems: MenuItemInterface[] = [];
  public activeLink = 'contracts';

  constructor(private readonly viewportScroller: ViewportScroller) {
    this.updateMenuItems();
  }
  public updateMenuItems() {
    let page: string = location.pathname;

    this.updateMenuItemsWihtPage(page);
  }
  public updateMenuItemsWihtPage(page: string) {
    this.menuItems = [
      {
        label: 'Workouts',
        class: page == '/workout/list' ? 'active' : '',
        enabled: true,
        visible: true,
        icon: 'fitness_center',
        route: '/workout/list',
      },
      {
        label: 'Exercises',
        class: page == '/exercise/list' ? 'active' : '',
        enabled: true,
        visible: true,
        icon: 'article',
        route: '/exercise/list',
      },
      {
        label: 'Builders',
        class: page == '/builders/list' ? 'active' : '',
        enabled: true,
        visible: true,
        icon: 'build',
        route: '/builders/list',
      },
      {
        label: 'Chat',
        class: page == '/chat' ? 'active' : '',
        enabled: true,
        visible: true,
        icon: 'chat',
        route: '/chat',
      },
    ];
  }

  public scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}

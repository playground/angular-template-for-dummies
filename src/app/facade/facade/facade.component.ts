import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-facade',
  templateUrl: './facade.component.html',
  styleUrls: ['./facade.component.scss']
})
export class FacadeComponent implements OnInit {

  constructor(
    public themeService: ThemeService
  ) { }

  ngOnInit() {
  }

}

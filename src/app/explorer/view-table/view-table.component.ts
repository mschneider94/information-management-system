import { Component, Input, OnInit } from '@angular/core';
import { InformationSchema } from 'src/app/information-schema.interface';

@Component({
  selector: 'app-view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.css']
})
export class ViewTableComponent implements OnInit {
  @Input() schema: InformationSchema;

  constructor() { }

  ngOnInit(): void {
    }

}
